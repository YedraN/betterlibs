import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { cpus, platform, release } from 'node:os'
import { resolve } from 'node:path'

const folder = resolve(import.meta.dirname, '../.lighthouseci')
const files = (await readdir(folder)).filter((name) => /^lhr-.*\.json$/.test(name))
if (!files.length) throw new Error('No hay informes Lighthouse; ejecuta primero pnpm lighthouse.')
const results = await Promise.all(
  files.map(async (file) => JSON.parse(await readFile(resolve(folder, file), 'utf8'))),
)
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
const categories = ['performance', 'accessibility', 'best-practices', 'seo']
const urls = [...new Set(results.map((report) => new URL(report.requestedUrl).pathname))]
const rows = urls.map((path) => {
  const runs = results.filter((report) => new URL(report.requestedUrl).pathname === path)
  const scores = Object.fromEntries(
    categories.map((category) => [
      category,
      Math.round(median(runs.map((run) => run.categories[category].score * 100))),
    ]),
  )
  const metrics = Object.fromEntries(
    [
      'first-contentful-paint',
      'largest-contentful-paint',
      'total-blocking-time',
      'cumulative-layout-shift',
      'speed-index',
    ].map((audit) => [audit, median(runs.map((run) => run.audits[audit].numericValue))]),
  )
  return {
    path,
    runs: runs.length,
    scores,
    metrics,
    passes:
      runs.length >= 3 &&
      categories.every(
        (category) => median(runs.map((run) => run.categories[category].score)) >= 0.95,
      ),
    failures: [
      ...new Set(
        runs.flatMap((run) =>
          Object.values(run.audits)
            .filter(
              (audit) =>
                audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === 'binary',
            )
            .map((audit) => audit.id),
        ),
      ),
    ],
  }
})
const report = {
  measuredAt: new Date().toISOString(),
  environment: {
    os: `${platform()} ${release()}`,
    cpu: cpus()[0]?.model,
    node: process.version,
    browserLaunch: 'Playwright Chromium via CDP; Lighthouse mobile simulation and cache resets',
    lighthouse: results[0].lighthouseVersion,
    userAgent: results[0].environment.hostUserAgent,
    formFactor: results[0].configSettings.formFactor,
    throttling: results[0].configSettings.throttling,
    throttlingMethod: results[0].configSettings.throttlingMethod,
  },
  threshold: 95,
  aggregation: 'median of three or more runs; raw scores used for acceptance',
  rows,
}
const out = resolve(import.meta.dirname, '../../../docs/quality')
await mkdir(out, { recursive: true })
await writeFile(resolve(out, 'lighthouse.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(
  JSON.stringify(
    rows.map(({ path, scores, passes }) => ({ path, scores, passes })),
    null,
    2,
  ),
)
if (rows.some((row) => !row.passes)) process.exitCode = 1

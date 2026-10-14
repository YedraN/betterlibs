import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { platform, release } from 'node:os'

const report = JSON.parse(
  await readFile(new URL('../test-results/results.json', import.meta.url), 'utf8'),
)
const projects = new Map()
function walk(suite) {
  for (const spec of suite.specs ?? [])
    for (const test of spec.tests ?? []) {
      const name = test.projectName
      const row = projects.get(name) ?? {
        project: name,
        passed: 0,
        skipped: 0,
        failed: 0,
        flaky: 0,
        limitations: [],
      }
      const status = test.results.at(-1)?.status
      if (status === 'skipped') {
        row.skipped++
        row.limitations.push({
          test: spec.title,
          reason: test.annotations
            .filter((annotation) => annotation.type === 'skip')
            .map((annotation) => annotation.description)
            .join('; '),
        })
      } else if (status === 'passed' && test.status === 'expected') row.passed++
      else if (test.status === 'flaky') row.flaky++
      else row.failed++
      projects.set(name, row)
    }
  for (const child of suite.suites ?? []) walk(child)
}
for (const suite of report.suites) walk(suite)
const rows = [...projects.values()]
if (!rows.length) throw new Error('No hay pruebas de navegador')
const out = new URL('../../../docs/quality/browsers.json', import.meta.url)
await mkdir(new URL('.', out), { recursive: true })
await writeFile(
  out,
  `${JSON.stringify({ measuredAt: new Date().toISOString(), environment: `${platform()} ${release()}`, playwright: '1.63.0', durationMs: report.stats.duration, rows, errors: report.errors }, null, 2)}\n`,
)
console.log(JSON.stringify(rows, null, 2))
if (rows.some((row) => row.failed || row.flaky) || report.errors.length) process.exitCode = 1

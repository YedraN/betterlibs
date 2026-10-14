import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { cpus, platform, release } from 'node:os'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const origin = 'http://localhost:6023'
const server = spawn(
  process.execPath,
  [
    fileURLToPath(new URL('../serve.ts', import.meta.url)),
    fileURLToPath(new URL('../../playground/dist/', import.meta.url)),
    '6023',
  ],
  { stdio: 'ignore', windowsHide: true },
)
let browser
try {
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await fetch(origin)).ok) break
    } catch {
      /* Server starting. */
    }
    if (attempt > 100) throw new Error('No responde el build')
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
    locale: 'es-ES',
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await page.addInitScript(() => {
    window.__profile = { tasks: [], frames: [], phase: 'load', sampling: false }
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.__profile.tasks.push({
            phase: window.__profile.phase,
            start: entry.startTime,
            duration: entry.duration,
          })
      }).observe({ type: 'longtask', buffered: true })
    }
    window.__sample = (phase) => {
      window.__profile.phase = phase
      window.__profile.frames = []
      window.__profile.sampling = true
      let previous
      function tick(time) {
        if (!window.__profile.sampling) return
        if (previous !== undefined) window.__profile.frames.push(time - previous)
        previous = time
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  })
  const readAssets = () =>
    page.evaluate(() => {
      const resources = performance.getEntriesByType('resource').map((entry) => ({
        url: new URL(entry.name).pathname,
        bodyBytes: entry.encodedBodySize,
        transferBytes: entry.transferSize,
      }))
      const total = (match) =>
        resources
          .filter((entry) => match.test(entry.url))
          .reduce((sum, entry) => sum + entry.bodyBytes, 0)
      return {
        resources,
        initialJS: total(/\.js$/) - total(/\/(mini|position-engine)-.*\.js$/),
        deferredJS: total(/\/(mini|position-engine)-.*\.js$/),
        css: total(/\.css$/),
        fonts: total(/\.woff2$/),
        images: total(/\.(svg|png|webp|avif|jpg)$/),
      }
    })
  const rows = []
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const path of ['/', '/plantillas/producto', '/plantillas/estudio', '/plantillas/articulo']) {
    await page.goto(origin + path)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForLoadState('networkidle')
    const assets = await readAssets()
    await page.evaluate(() => window.__sample('scroll'))
    await page.evaluate(async () => {
      for (let index = 0; index < 16; index++) {
        window.scrollBy({ top: 300, behavior: 'instant' })
        await new Promise(requestAnimationFrame)
      }
      await new Promise((resolve) => setTimeout(resolve, 400))
    })
    const scroll = await page.evaluate(() => {
      window.__profile.sampling = false
      return {
        frames: window.__profile.frames,
        tasks: window.__profile.tasks.filter((task) => task.phase === 'scroll'),
      }
    })
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).waitFor()
    await page.evaluate(() => window.__sample('overlay'))
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await page.getByRole('dialog').waitFor()
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const overlay = await page.evaluate(() => {
      window.__profile.sampling = false
      return {
        frames: window.__profile.frames,
        tasks: window.__profile.tasks.filter((task) => task.phase === 'overlay'),
      }
    })
    const summary = (phase) => {
      const sorted = [...phase.frames].sort((a, b) => a - b)
      return {
        frames: sorted.length,
        medianFrameMs: sorted[Math.floor(sorted.length / 2)] ?? null,
        p95FrameMs: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? null,
        longTasks: phase.tasks,
      }
    }
    rows.push({
      path,
      assets,
      afterInteractionsAssets: await readAssets(),
      loadLongTasks: await page.evaluate(() =>
        window.__profile.tasks.filter((task) => task.phase === 'load'),
      ),
      scroll: summary(scroll),
      overlay: summary(overlay),
    })
  }
  if (errors.length) throw new Error(errors.join('\n'))
  const report = {
    measuredAt: new Date().toISOString(),
    environment: {
      os: `${platform()} ${release()}`,
      cpu: cpus()[0]?.model,
      node: process.version,
      browser: browser.version(),
      viewport: '390x844',
      cpuThrottle: 4,
      network: 'local server, no throttling',
      cache: 'First route cold; shared browser context/cache reused for subsequent routes',
      device: 'desktop emulation; not a physical mobile device',
    },
    frameReferenceMs: 16.7,
    caveat:
      'Diagnostic samples; frame timing is not a universal refresh-rate guarantee. Resource bytes are encoded HTTP bodies, including separately loaded engine chunks.',
    rows,
  }
  const out = new URL('../../../docs/quality/interactions.json', import.meta.url)
  await mkdir(new URL('.', out), { recursive: true })
  await writeFile(out, `${JSON.stringify(report, null, 2)}\n`)
  console.log(
    JSON.stringify(
      rows.map(({ path, scroll, overlay }) => ({ path, scroll, overlay })),
      null,
      2,
    ),
  )
} finally {
  await browser?.close()
  server.kill()
}

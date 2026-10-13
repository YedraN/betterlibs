import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

// Capturas de revisión. No sustituyen las referencias Linux de la suite visual.
const origin = 'http://127.0.0.1:6018'
const output = new URL('../../../docs/previews/ui-motion/', import.meta.url)
const server = spawn(
  process.execPath,
  [
    fileURLToPath(new URL('../serve.ts', import.meta.url)),
    fileURLToPath(new URL('../../storybook/storybook-static/', import.meta.url)),
    '6018',
  ],
  { stdio: 'ignore', windowsHide: true },
)
let browser
try {
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await fetch(origin)).ok) break
    } catch {
      /* Arranque del servidor. */
    }
    if (attempt >= 100) throw new Error('Storybook no responde en el puerto de revisión.')
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  await mkdir(output, { recursive: true })
  browser = await chromium.launch()
  const page = await browser.newPage({ reducedMotion: 'reduce', locale: 'es-ES' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const [story, theme, width, height] of [
    ['estados', 'light', 1440, 1080],
    ['estados', 'dark', 1440, 1080],
    ['contenido', 'light', 1440, 1080],
    ['contenido', 'dark', 1440, 1080],
    ['cabecera', 'light', 390, 844],
    ['cabecera', 'dark', 390, 844],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto(
      `${origin}/iframe.html?id=componentes-editorial-ui-prioritaria--${story}&viewMode=story&globals=theme:${theme};preset:editorial;a11y.manual:!true`,
    )
    await page.locator('#storybook-root main').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({
      path: fileURLToPath(new URL(`phase3-${story}-${theme}.png`, output)),
      fullPage: true,
    })
  }
  if (errors.length) throw new Error(errors.join('\n'))
  console.log('Seis capturas editoriales guardadas; sin errores de JavaScript.')
} finally {
  await browser?.close()
  server.kill()
}

import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const origin = 'http://127.0.0.1:6020'
const output = new URL('../../../docs/previews/ui-motion/', import.meta.url)
const server = spawn(
  process.execPath,
  [
    fileURLToPath(new URL('../serve.ts', import.meta.url)),
    fileURLToPath(new URL('../../storybook/storybook-static/', import.meta.url)),
    '6020',
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
    if (attempt >= 100) throw new Error('Storybook no responde.')
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  await mkdir(output, { recursive: true })
  browser = await chromium.launch()
  const page = await browser.newPage({ reducedMotion: 'reduce', locale: 'es-ES' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const theme of ['light', 'dark']) {
    for (const [story, width] of [
      ['formularios', 1280],
      ['menus-y-overlays', 390],
      ['posiciones', 1280],
      ['contenido', 390],
    ]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(
        `${origin}/iframe.html?id=componentes-editorial-catálogo--${story}&viewMode=story&globals=theme:${theme};preset:editorial;a11y.manual:!true`,
      )
      await page.locator('main').waitFor()
      await page.evaluate(() => document.fonts.ready)
      if (story === 'menus-y-overlays')
        await page.getByRole('button', { name: 'Abrir panel' }).click()
      if (story === 'posiciones')
        await page.getByRole('button', { name: 'Cambiar retícula' }).click()
      if (story === 'contenido') await page.locator('.bl-carousel-root').scrollIntoViewIfNeeded()
      await page.screenshot({
        path: fileURLToPath(new URL(`phase5-${story}-${theme}.png`, output)),
        fullPage: true,
      })
    }
  }
  if (errors.length) throw new Error(errors.join('\n'))
  console.log('Ocho capturas de catálogo guardadas, sin errores de JavaScript.')
} finally {
  await browser?.close()
  server.kill()
}

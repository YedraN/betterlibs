import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const origin = 'http://127.0.0.1:6019'
const output = new URL('../../../docs/previews/ui-motion/', import.meta.url)
const server = spawn(
  process.execPath,
  [
    fileURLToPath(new URL('../serve.ts', import.meta.url)),
    fileURLToPath(new URL('../../playground/dist/', import.meta.url)),
    '6019',
  ],
  { stdio: 'ignore', windowsHide: true },
)
let browser
try {
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await fetch(origin)).ok) break
    } catch {
      /* Espera al servidor local. */
    }
    if (attempt >= 100) throw new Error('El playground no responde.')
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  await mkdir(output, { recursive: true })
  browser = await chromium.launch()
  const page = await browser.newPage({ reducedMotion: 'reduce', locale: 'es-ES' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const [device, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
  ]) {
    for (const theme of ['light', 'dark']) {
      await page.setViewportSize({ width, height })
      await page.goto(origin)
      await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption(theme)
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({
        path: fileURLToPath(new URL(`phase4-${device}-${theme}.png`, output)),
        fullPage: true,
      })
      if (device === 'desktop')
        await page
          .locator('.bl-hero-root')
          .screenshot({ path: fileURLToPath(new URL(`phase4-hero-${theme}.png`, output)) })
      if (device === 'desktop' && theme === 'light') {
        await page
          .locator('.bl-cta-box')
          .screenshot({ path: fileURLToPath(new URL('phase4-cta-light.png', output)) })
        console.log(
          'Fuente CTA:',
          await page
            .locator('.bl-cta-title')
            .evaluate((element) => getComputedStyle(element).fontFamily),
        )
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'))
  console.log('Capturas de la landing guardadas, sin errores de JavaScript.')
} finally {
  await browser?.close()
  server.kill()
}

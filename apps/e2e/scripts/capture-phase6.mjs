import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const directory = resolve(import.meta.dirname, '../../../docs/previews/ui-motion')
await mkdir(directory, { recursive: true })
const browser = await chromium.launch()
try {
  for (const template of ['producto', 'estudio', 'articulo']) {
    for (const theme of ['light', 'dark']) {
      for (const viewport of [
        { width: 1440, height: 900 },
        { width: 390, height: 844 },
      ]) {
        const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
        await page.goto(`http://localhost:4173/plantillas/${template}`)
        await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption(theme)
        await page.evaluate(() => document.fonts.ready)
        for (const image of await page.locator('main img').all()) {
          await image.scrollIntoViewIfNeeded()
          await image.evaluate((node) => node.decode())
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        const name = `phase6-${template}-${theme}-${viewport.width < 500 ? 'mobile' : 'desktop'}.png`
        await page.screenshot({
          path: resolve(directory, name),
          fullPage: true,
          animations: 'disabled',
        })
        console.log(name)
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
}

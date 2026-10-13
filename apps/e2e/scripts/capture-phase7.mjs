import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from '@playwright/test'

const origin = process.env.BETTERLIBS_DOCS_TEST_URL ?? 'http://localhost:3001'
const folder = fileURLToPath(new URL('../../../docs/previews/ui-motion/', import.meta.url))
await mkdir(folder, { recursive: true })
const browser = await chromium.launch()
try {
  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' })
    const page = await context.newPage()
    for (const mobile of [false, true]) {
      await page.setViewportSize(
        mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      )
      for (const route of ['/', '/docs/galeria']) {
        await page.goto(`${origin}${route}`)
        await expect(page.locator('html')).toHaveClass(new RegExp(scheme))
        if (route !== '/') {
          await page
            .getByRole('group', { name: 'Filtrar por uso' })
            .getByRole('button', { name: 'Movimiento', exact: true })
            .click()
        }
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator('[data-docs-preview]').first()).toHaveAttribute(
          'data-theme',
          scheme,
        )
        await page.screenshot({
          path: `${folder}/phase7-${route === '/' ? 'portada' : 'galeria'}-${scheme}-${mobile ? 'mobile' : 'desktop'}.png`,
          fullPage: true,
          animations: 'disabled',
        })
      }
    }
    await context.close()
  }
} finally {
  await browser.close()
}
console.log(
  'Ocho capturas de revisión de la documentación; no son referencias de regresión visual.',
)

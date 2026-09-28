import { test } from '@playwright/test'
import { expectNoViolations, ROUTES } from './helpers'

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Plantillas en modo ${scheme === 'light' ? 'claro' : 'oscuro'}`, () => {
    test.use({ colorScheme: scheme })

    for (const route of ROUTES) {
      test(`${route.name} no tiene infracciones de axe`, async ({ page }) => {
        await page.goto(route.path)
        await page.locator('main h1').waitFor()
        // Con el aviso de cookies visible (primera visita)…
        await expectNoViolations(page)
      })
    }

    test('las plantillas cumplen también en móvil y con el menú abierto', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      await page.getByRole('button', { name: 'Rechazar todas' }).click()
      await page.getByRole('button', { name: 'Abrir menú' }).click()
      await page.getByRole('dialog', { name: 'Menú' }).waitFor()
      await expectNoViolations(page)
    })
  })
}

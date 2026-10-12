import { test } from '@playwright/test'
import { expectNoViolations } from './helpers'

for (const theme of ['light', 'dark'] as const) {
  test(`el piloto en tema ${theme} cumple axe en todos los ejemplos y el menú móvil`, async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption(theme)
    const tabs = page.getByRole('tablist', { name: 'Componentes de ejemplo' })
    for (const name of ['Botones', 'Tarjetas', 'Formularios']) {
      await tabs.getByRole('tab', { name: new RegExp(name) }).click()
      await expectNoViolations(page)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await page.getByRole('dialog', { name: 'Explora Betterlibs' }).waitFor()
    await expectNoViolations(page)
  })
}

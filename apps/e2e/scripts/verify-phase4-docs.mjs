import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'

// Ejecutar tras arrancar el build Next en 3001; también admite una URL de entorno.
const origin = process.env.BETTERLIBS_DOCS_TEST_URL ?? 'http://localhost:3001'
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ reducedMotion: 'no-preference', locale: 'es-ES' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrating/i.test(message.text()))
      errors.push(message.text())
  })
  await page.goto(`${origin}/docs/guias/animated-number`)
  const number = page.locator('[data-bl-animated-number]')
  await number.scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Aumentar importe', exact: true }).click()
  await expect(number).toHaveAttribute('data-value', '1500.5')
  await expect(number.locator('[data-bl-number-final]')).toContainText('1500,50')
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await expect(number.locator('[data-bl-number-visual]')).toContainText('1500,50')
  const trigger = page.getByRole('button', { name: 'Abrir detalles', exact: true })
  await trigger.click()
  await page.getByRole('textbox', { name: 'Nombre de la colección', exact: true }).fill('Atlas')
  await page.getByRole('button', { name: 'Guardar y cerrar', exact: true }).click()
  await expect(trigger).toBeFocused()
  await expect(page.locator('#number-details')).toHaveCount(0)
  await page.goto(`${origin}/docs/bloques/editoriales`)
  await page.getByRole('tab', { name: 'Editar', exact: true }).click()
  await expect(
    page.getByRole('textbox', { name: 'Nombre de tu proyecto', exact: true }),
  ).toBeVisible()
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  assert.deepEqual(errors, [])

  const withoutJs = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await withoutJs.newPage()
  await staticPage.goto(`${origin}/docs/guias/animated-number`)
  await expect(staticPage.locator('[data-bl-number-visual]')).toContainText('1250,50')
  await expect(staticPage.locator('[data-bl-number-visual]')).toBeVisible()
  await staticPage.goto(`${origin}/docs/bloques/editoriales`)
  await expect(staticPage.locator('.bl-hero-root[data-variant="editorial"]')).toBeVisible()
  await expect(staticPage.locator('.bl-bento-features-grid')).toBeVisible()
  await withoutJs.close()

  const fallback = await browser.newContext()
  await fallback.addInitScript(() => {
    Element.prototype.animate = undefined
  })
  const fallbackPage = await fallback.newPage()
  await fallbackPage.goto(`${origin}/docs/guias/animated-number`)
  await fallbackPage.getByRole('button', { name: 'Abrir detalles', exact: true }).click()
  await fallbackPage.getByRole('button', { name: 'Guardar y cerrar', exact: true }).click()
  await expect(fallbackPage.locator('#number-details')).toHaveCount(0)
  await fallback.close()
  console.log(
    'Next: cifras, selección, cancelación, foco, SSR sin JavaScript y fallback sin WAAPI verificados.',
  )
} finally {
  await browser.close()
}

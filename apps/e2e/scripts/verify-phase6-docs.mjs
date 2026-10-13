import { chromium, expect } from '@playwright/test'

const origin = process.env.BETTERLIBS_DOCS_TEST_URL ?? 'http://localhost:3001'
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ reducedMotion: 'no-preference' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|mismatch/i.test(message.text()))
      errors.push(message.text())
  })
  await page.goto(`${origin}/docs/guias/lectura-y-texto`)
  await page.getByRole('button', { name: 'Repetir texto', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Espacio para leer. Tiempo para entender.', exact: true }),
  ).toBeVisible()
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await expect(page.getByRole('button', { name: 'Repetir texto', exact: true })).toBeDisabled()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect
    .poll(() =>
      page.getByRole('progressbar', { name: 'Progreso de lectura' }).evaluate((node) => node.value),
    )
    .toBeGreaterThan(0.8)
  await page.goto(`${origin}/ejemplos/navegacion`)
  await expect(page.getByRole('heading', { name: 'Primera página', exact: true })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 600))
  await page
    .getByRole('link', { name: 'Continuar a la segunda página', exact: true })
    .scrollIntoViewIfNeeded()
  const previous = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: 'Continuar a la segunda página', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Segunda página', exact: true })).toBeFocused()
  await expect(page).toHaveTitle(/Segunda página/)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Primera página', exact: true })).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(previous - 10)
  await page.getByRole('link', { name: 'Ir al apartado de la segunda página', exact: true }).click()
  await expect(page.locator('#destino')).toBeFocused()
  await expect(page.locator('#destino')).toBeInViewport()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() => page.locator('[data-page-entry]').evaluate((node) => node.getAnimations().length))
    .toBe(0)
  await page.getByRole('link', { name: 'Volver a la primera página', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Primera página', exact: true })).toBeFocused()
  await page.evaluate(() => {
    Element.prototype.animate = undefined
  })
  await page.getByRole('link', { name: 'Segunda página', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Segunda página', exact: true })).toBeFocused()
  expect(errors).toEqual([])
  const context = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await context.newPage()
  await staticPage.goto(`${origin}/ejemplos/navegacion/segunda`)
  await expect(
    staticPage.getByRole('heading', { name: 'Segunda página', exact: true }),
  ).toBeVisible()
  await expect(staticPage.locator('[data-page-entry]')).not.toHaveAttribute('style', /opacity:\s*0/)
  await context.close()
  console.log(
    'Next: lectura, preferencias, SSR, hidratación, foco, anclas, historial, scroll y fallback correctos.',
  )
} finally {
  await browser.close()
}

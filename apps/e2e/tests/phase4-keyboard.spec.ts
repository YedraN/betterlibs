import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, waitForStory } from './helpers'

test.use({ reducedMotion: 'no-preference' })
test('la cifra de la portada conserva el final accesible, tolera cambios rápidos y cancela en vivo', async ({
  page,
}) => {
  await page.goto('/')
  const number = page.locator('[data-bl-animated-number]').first()
  await number.scrollIntoViewIfNeeded()
  await expect(number.locator('[data-bl-number-visual]')).toHaveText('8')
  await number.evaluate((element) =>
    element.style.setProperty('--bl-motion-navigation-duration', '2s'),
  )
  await page.getByRole('button', { name: 'Añadir una pieza' }).click()
  await expect(number).toHaveAttribute('data-value', '9')
  await expect(number.locator('[data-bl-number-final]')).toHaveText('9')
  await expect(number.locator('[data-bl-number-visual]')).toHaveAttribute('aria-hidden', 'true')
  await expect(number.locator('[data-bl-number-visual]')).toHaveAttribute('data-state', 'running')
  await page.getByRole('button', { name: 'Quitar una pieza' }).click()
  await expect(number).toHaveAttribute('data-value', '8')
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await expect(number.locator('[data-bl-number-visual]')).toHaveText('8')
  await expect(number.locator('[data-bl-number-visual]')).toHaveAttribute('data-state', 'idle')
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('system')
  await page.getByRole('button', { name: 'Repetir cifra' }).click()
  await expect(number.locator('[data-bl-number-visual]')).toHaveAttribute('data-state', 'running')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(number.locator('[data-bl-number-visual]')).toHaveText('8')
  await expect(number.locator('[data-bl-number-visual]')).toHaveAttribute('data-state', 'idle')
})

test('la cifra y los cuatro bloques están presentes sin JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://localhost:4173/')
  await expect(page.locator('[data-bl-number-visual]')).toHaveText('8')
  await expect(page.locator('.bl-hero-root[data-variant="editorial"]')).toBeVisible()
  await expect(page.locator('.bl-bento-features-grid')).toBeVisible()
  await expect(page.locator('.bl-feature-showcase-panel').first()).toBeVisible()
  await expect(page.locator('.bl-cta-box[data-panel-tone="inverse"]')).toBeVisible()
  await context.close()
})

test.describe('cifras y composiciones en Storybook', () => {
  test.use({ baseURL: STORYBOOK_URL })
  test('formato de moneda, salida inerte y preferencia global compartida', async ({ page }) => {
    await page.goto(
      '/iframe.html?id=bloques-editorial-primera-página--cifras&viewMode=story&globals=preset:editorial;a11y.manual:!true',
    )
    await waitForStory(page)
    const number = page.locator('[data-bl-animated-number]')
    await expect(number.locator('[data-bl-number-final]')).toContainText('1250,50')
    await page.getByRole('button', { name: 'Aumentar importe' }).click()
    await expect(number.locator('[data-bl-number-final]')).toContainText('1500,50')
    await page.getByRole('button', { name: 'Abrir detalles' }).click()
    await page.getByRole('textbox', { name: 'Nombre de la colección' }).fill('Atlas')
    await page.getByRole('button', { name: 'Guardar y cerrar' }).click()
    await expect(page.getByRole('button', { name: 'Abrir detalles' })).toBeFocused()
    await page.getByRole('combobox', { name: 'Movimiento' }).selectOption('off')
    await page.getByRole('button', { name: 'Reducir importe' }).click()
    await expect(number.locator('[data-bl-number-visual]')).toContainText('1250,50')
    await expect(number.locator('[data-bl-number-visual]')).toHaveAttribute('data-state', 'idle')
    await expectNoViolations(page)
  })
  for (const theme of ['light', 'dark']) {
    test(`las composiciones en ${theme} admiten teclado y textos ampliados`, async ({ page }) => {
      await page.goto(
        `/iframe.html?id=bloques-editorial-primera-página--composiciones&viewMode=story&globals=theme:${theme};preset:editorial;a11y.manual:!true`,
      )
      await waitForStory(page)
      const list = page.getByRole('tablist', { name: 'Ejemplos editoriales' })
      await list.getByRole('tab', { name: 'Leer' }).focus()
      await page.keyboard.press('ArrowRight')
      await expect(page.getByRole('textbox', { name: 'Nombre de tu proyecto' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Volver a la portada' })).toHaveCount(0)
      await page.keyboard.press('Tab')
      await expect(page.getByRole('tabpanel')).toBeFocused()
      // Evalúa el contraste del estado final; la entrada del bento puede seguir en curso al hacer scroll.
      await page.getByRole('combobox', { name: 'Movimiento' }).selectOption('off')
      await expect
        .poll(() =>
          page
            .locator('[data-bl-reveal]')
            .evaluateAll((elements) =>
              elements.every((element) => getComputedStyle(element).opacity === '1'),
            ),
        )
        .toBe(true)
      await expectNoViolations(page, {
        disableRules: ['region', 'landmark-one-main', 'page-has-heading-one'],
      })
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.locator('html').evaluate((element) => {
          element.style.fontSize = '200%'
        })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
      }
    })
  }
})

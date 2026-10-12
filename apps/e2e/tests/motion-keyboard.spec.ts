import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { waitForStory } from './helpers'

test.use({ baseURL: STORYBOOK_URL, reducedMotion: 'no-preference' })

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/iframe.html?id=movimiento-primitivas--sistema&viewMode=story&globals=preset:editorial',
  )
  await waitForStory(page)
})

test('la salida es inerte, devuelve el foco y admite reapertura rápida', async ({ page }) => {
  const toggle = page.getByRole('button', { name: 'Abrir detalles' })
  await toggle.click()
  const field = page.getByRole('textbox', { name: 'Nombre de la composición' })
  await field.fill('Atlas')
  // Hold the exit open long enough to inspect the functional state, not just the final DOM.
  await page.locator('#motion-details').evaluate((element) => {
    ;(element as HTMLElement).style.setProperty('--bl-motion-reveal-exit-duration', '2s')
  })
  await page.getByRole('button', { name: 'Guardar y cerrar' }).click()
  await expect(page.getByRole('button', { name: 'Abrir detalles' })).toBeFocused()
  await expect(page.locator('#motion-details')).toHaveAttribute('inert', '')
  await expect(page.locator('#motion-details')).toHaveAttribute('aria-hidden', 'true')
  await expect(field).toHaveCount(0)
  await page.getByRole('button', { name: 'Abrir detalles' }).click()
  await expect(field).toHaveValue('Atlas')
  await expect(page.locator('#motion-details')).not.toHaveAttribute('inert', '')
  await page.waitForTimeout(2100)
  await expect(field).toBeVisible()
})

test('repetición, límite de secuencia y cambio de preferencia durante el efecto', async ({
  page,
}) => {
  await page.locator('[data-bl-reveal]').evaluateAll((elements) => {
    for (const element of elements)
      (element as HTMLElement).style.setProperty('--bl-motion-reveal-duration', '2s')
  })
  await page.getByRole('button', { name: 'Repetir entradas' }).click()
  await expect
    .poll(() =>
      page
        .locator('[data-bl-reveal]')
        .evaluateAll((elements) => elements.flatMap((element) => element.getAnimations()).length),
    )
    .toBeGreaterThan(0)
  const delays = await page
    .locator('[data-bl-reveal]')
    .evaluateAll((elements) =>
      elements.flatMap((element) =>
        element.getAnimations().map((animation) => animation.effect?.getTiming().delay),
      ),
    )
  expect(Math.max(...delays.map(Number))).toBeLessThanOrEqual(240)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: 'Repetir entradas' })).toBeDisabled()
  await expect
    .poll(() =>
      page
        .locator('[data-bl-reveal]')
        .evaluateAll((elements) => elements.flatMap((element) => element.getAnimations()).length),
    )
    .toBe(0)
  await page.getByRole('button', { name: 'Abrir detalles' }).click()
  await page.getByRole('button', { name: 'Guardar y cerrar' }).click()
  await expect(page.locator('#motion-details')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Abrir detalles' })).toBeFocused()
})

test('sin WAAPI se conserva el contenido y la salida termina', async ({ page }) => {
  await page.evaluate(() => {
    Element.prototype.animate = undefined as unknown as typeof Element.prototype.animate
  })
  await page.getByRole('button', { name: 'Repetir entradas' }).click()
  await expect(page.getByText('Identidad', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Abrir detalles' }).click()
  await page.getByRole('button', { name: 'Guardar y cerrar' }).click()
  await expect(page.locator('#motion-details')).toHaveCount(0)
})

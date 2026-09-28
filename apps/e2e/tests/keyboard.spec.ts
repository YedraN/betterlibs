import { expect, type Page, test } from '@playwright/test'

/** Descarta el aviso de cookies para que no intercepte el foco ni los clics. */
async function rejectCookies(page: Page) {
  await page.getByRole('button', { name: 'Rechazar todas' }).click()
  await expect(page.getByRole('region', { name: 'Aviso de cookies' })).toBeHidden()
}

test('el aviso de cookies se maneja con teclado y recuerda la elección', async ({ page }) => {
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'Aviso de cookies' })
  await expect(banner).toBeVisible()
  // Rechazar y aceptar tienen el mismo peso visual y ambos son alcanzables con Tab.
  const reject = banner.getByRole('button', { name: 'Rechazar todas' })
  await reject.focus()
  await page.keyboard.press('Enter')
  await expect(banner).toBeHidden()
  await page.reload()
  await page.locator('main h1').waitFor()
  await expect(banner).toBeHidden()

  // Se puede volver a abrir desde el pie; el diálogo atrapa el foco y Escape lo cierra.
  const reopen = page.getByRole('button', { name: 'Configurar cookies' })
  await reopen.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(':focus')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('el primer Tab lleva al enlace de salto y este al contenido principal', async ({ page }) => {
  await page.goto('/')
  await rejectCookies(page)
  // Visita siguiente, ya sin aviso de cookies: el primer Tab va al enlace de salto.
  await page.reload()
  await page.locator('main h1').waitFor()
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Saltar al contenido principal' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
  await page.keyboard.press('Tab')
  const focusedInMain = await page.evaluate(() => Boolean(document.activeElement?.closest('#main')))
  expect(focusedInMain).toBe(true)
})

test('el mega menú se abre con Enter, se recorre con Tab y se cierra con Escape', async ({
  page,
}) => {
  await page.goto('/')
  await rejectCookies(page)
  const trigger = page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('button', { name: 'Servicios' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveRole('link')
  await page.keyboard.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
})

test('al navegar sin recargar el foco va al título de la página nueva', async ({ page }) => {
  await page.goto('/')
  await rejectCookies(page)
  await page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Sobre nosotros' })
    .click()
  await expect(page).toHaveURL(/\/sobre-nosotros$/)
  await expect(page.locator('main h1')).toBeFocused()
  await expect(page).toHaveTitle(/Norte Consultores/)
})

test.describe('en móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('el menú móvil atrapa el foco, se cierra con Escape y devuelve el foco', async ({
    page,
  }) => {
    await page.goto('/')
    await rejectCookies(page)
    const open = page.getByRole('button', { name: 'Abrir menú' })
    await open.focus()
    await page.keyboard.press('Enter')
    const menu = page.getByRole('dialog', { name: 'Menú' })
    await expect(menu).toBeVisible()
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab')
      await expect(menu.locator(':focus')).toHaveCount(1)
    }
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(open).toBeFocused()
  })

  test('al elegir un enlace del menú móvil se cierra el panel y se navega', async ({ page }) => {
    await page.goto('/')
    await rejectCookies(page)
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    const menu = page.getByRole('dialog', { name: 'Menú' })
    await menu.getByRole('link', { name: 'Contacto' }).click()
    await expect(menu).toBeHidden()
    await expect(page).toHaveURL(/\/contacto$/)
    await expect(page.locator('main h1')).toBeFocused()
  })
})

test('el formulario de contacto lleva el foco al resumen de errores y de ahí al campo', async ({
  page,
}) => {
  await page.goto('/contacto')
  await rejectCookies(page)
  const form = page.getByRole('form', { name: 'Formulario de contacto' })
  await form.getByRole('button', { name: 'Enviar mensaje' }).click()

  const summary = page.locator(':focus')
  await expect(summary).toContainText('Revisa los siguientes campos')
  const firstError = summary.getByRole('link').first()
  await firstError.click()
  await expect(form.getByRole('textbox', { name: /Nombre/ })).toBeFocused()

  // El error se anuncia con el campo: lo describe y el campo queda marcado como no válido.
  const name = form.getByRole('textbox', { name: /Nombre/ })
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(name).toHaveAccessibleDescription(/Error/)

  await name.fill('Ana')
  await page.keyboard.press('Tab')
  await expect(name).not.toHaveAttribute('aria-invalid', 'true')
})

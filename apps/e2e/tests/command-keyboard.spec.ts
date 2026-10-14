import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, storyUrl, waitForStory } from './helpers'

test.use({ baseURL: STORYBOOK_URL })
const story = 'componentes-editorial-paleta-de-comandos--'

test('Command inline: recorre la lista sin desplazar la página', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 440 })
  await page.goto(storyUrl(`${story}en-pagina`))
  await waitForStory(page)
  const input = page.getByRole('combobox')
  await input.focus()
  const originalScroll = await page.evaluate(() => window.scrollY)
  for (let index = 0; index < 15; index++) await input.press('ArrowDown')
  await expect(page.getByRole('option', { name: 'Abrir Encuentros', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect
    .poll(() => page.getByRole('listbox').evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0)
  expect(await page.evaluate(() => window.scrollY)).toBe(originalScroll)
  await input.press('Enter')
  await expect(page.getByRole('status').last()).toContainText('Colección elegida: Encuentros.')
})

for (const theme of ['light', 'dark'] as const) {
  test(`Command ${theme}: teclado, filtro, ejecución y retorno de foco`, async ({
    page,
  }, testInfo) => {
    await page.goto(storyUrl(`${story}acciones`, theme))
    await waitForStory(page)
    const trigger = page.getByRole('button', { name: 'Buscar acciones', exact: true })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: '¿Qué quieres hacer?' })
    const input = dialog.getByRole('combobox')
    await expect(input).toBeFocused()
    await input.press('ArrowDown')
    await expect(dialog.getByRole('option', { name: 'Abrir Atlas', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await input.press('ArrowDown')
    await expect(
      dialog.getByRole('option', { name: 'Usar tema claro', exact: true }),
    ).toHaveAttribute('aria-selected', 'true')
    await expect(input).toBeFocused()
    await expectNoViolations(page)
    if (testInfo.project.name === 'keyboard') {
      await page.screenshot({ path: `../../.release/command-${theme}.png` })
    }
    await input.fill('coleccion crear')
    await expect(dialog.getByRole('option')).toHaveCount(1)
    await input.press('Enter')
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await expect(page.getByRole('status')).toContainText('Acción elegida: Nueva colección.')
    await trigger.click()
    await expect(input).toHaveValue('')
    await input.fill('no existe')
    await expect(dialog.getByRole('option')).toHaveCount(0)
    await input.press('Enter')
    await expect(dialog).toBeVisible()
    await input.press('Escape')
    await expect(trigger).toBeFocused()
  })
}

test('Command: móvil, zoom, carga y lista vacía', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto(storyUrl(`${story}acciones`, 'dark'))
  await waitForStory(page)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  await page.getByRole('button', { name: 'Buscar acciones', exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true)
  await page.getByRole('option', { name: 'Abrir Atlas', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Acción elegida: Abrir Atlas.')
  for (const state of ['cargando', 'sin-acciones']) {
    await page.goto(storyUrl(`${story}${state}`))
    await waitForStory(page)
    await page.getByRole('button', { name: 'Buscar acciones', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('option')).toHaveCount(0)
    await expect(dialog.getByRole('status')).toContainText(
      state === 'cargando' ? 'Buscando acciones' : 'Prueba otra búsqueda',
    )
    await dialog.getByRole('combobox').press('Enter')
    await expect(dialog).toBeVisible()
    await expectNoViolations(page)
    await dialog.getByRole('combobox').press('Escape')
    await expect(dialog).not.toBeVisible()
  }
})

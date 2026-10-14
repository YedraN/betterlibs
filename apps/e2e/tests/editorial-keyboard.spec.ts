import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, waitForStory } from './helpers'

test.use({ baseURL: STORYBOOK_URL, reducedMotion: 'no-preference' })
const prefix = 'componentes-editorial-ui-prioritaria--'

async function openStory(page: import('@playwright/test').Page, story: string, theme = 'light') {
  await page.goto(
    `/iframe.html?id=${prefix}${story}&viewMode=story&globals=theme:${theme};preset:editorial;a11y.manual:!true`,
  )
  await waitForStory(page)
}

for (const theme of ['light', 'dark']) {
  test(`estados editoriales y diálogo accesibles en ${theme}`, async ({ page }) => {
    await openStory(page, 'estados', theme)
    const save = page.locator('button').filter({ hasText: 'Guardar colección' })
    await save.focus()
    const width = await save.evaluate((element) => element.getBoundingClientRect().width)
    await page.keyboard.press('Enter')
    await expect(save).toBeFocused()
    await expect(save).toHaveAttribute('aria-busy', 'true')
    expect(await save.evaluate((element) => element.getBoundingClientRect().width)).toBe(width)
    await expect(page.getByRole('status')).toHaveText('Colección guardada.')
    await page.getByRole('button', { name: 'Comprobar nombre' }).click()
    const name = page.getByRole('textbox', { name: 'Nombre', exact: true })
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription(/tres caracteres/)
    await name.fill('Colección de interfaces')
    await page.keyboard.press('Tab')
    await expect(name).not.toHaveAttribute('aria-invalid', 'true')
    await expectNoViolations(page)
    const trigger = page.getByRole('button', { name: 'Crear colección', exact: true })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Crear colección' })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator(':focus')).toHaveCount(1)
    await expectNoViolations(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    await trigger.press('Enter')
    await expect(dialog).toBeVisible()
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
    await expect(trigger).toBeFocused()
  })

  test(`pestañas, paneles y tarjetas accesibles en ${theme}`, async ({ page }) => {
    await openStory(page, 'contenido', theme)
    await expectNoViolations(page)
    for (const variant of ['line', 'pill']) {
      const list = page.getByRole('tablist', { name: `Colección ${variant}` })
      const design = list.getByRole('tab', { name: 'Diseño editorial' })
      const motion = list.getByRole('tab', { name: 'Movimiento y comportamiento' })
      await design.focus()
      await page.keyboard.press('ArrowRight')
      await expect(motion).toHaveAttribute('aria-selected', 'true')
      await page.keyboard.press('ArrowRight')
      await expect(design).toHaveAttribute('aria-selected', 'true')
      const root = list.locator('..')
      await expect(root.getByRole('button', { name: 'Repetir demostración' })).toHaveCount(0)
      await expect(list.locator('.bl-tabs-indicator')).toBeVisible()
    }
    await page
      .getByRole('combobox', { name: 'Orientación de las pestañas' })
      .selectOption('vertical')
    const list = page.getByRole('tablist', { name: 'Colección line' })
    await list.getByRole('tab', { name: 'Diseño editorial' }).focus()
    await page.keyboard.press('ArrowDown')
    await expect(list.getByRole('tab', { name: 'Movimiento y comportamiento' })).toBeFocused()
    await expectNoViolations(page)
  })
}

test('el contenido del acordeón sale inerte, tolera altura variable y se puede reabrir', async ({
  page,
}) => {
  await openStory(page, 'contenido')
  await page.getByRole('button', { name: 'Alternar detalles' }).click()
  await expect(
    page.getByText('Las tarjetas pueden contener texto largo', { exact: false }),
  ).toBeVisible()
  await page
    .locator('html')
    .evaluate((element) =>
      element.style.setProperty('--bl-motion-disclosure-exit-duration', '900ms'),
    )
  const trigger = page.getByRole('button', {
    name: '¿Puedo cambiar el contenido con el panel abierto?',
  })
  await trigger.click()
  const closed = page.locator('.bl-accordion-content').first()
  await expect(closed).toHaveAttribute('inert', '')
  await expect(closed).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByRole('link', { name: 'Volver al contenido' })).toHaveCount(0)
  await trigger.press('Enter')
  await expect(page.getByRole('link', { name: 'Volver al contenido' })).toBeVisible()
  await expect(page.locator('.bl-accordion-content[data-state="open"]')).not.toHaveAttribute(
    'inert',
  )
  await trigger.press('Enter')
  await page.locator('html').evaluate((element) => {
    element.dataset.motion = 'off'
  })
  await expect(closed).toBeHidden()
})

test('cambiar la preferencia cancela CSS y el sistema reducido prevalece', async ({ page }) => {
  await openStory(page, 'estados')
  const mode = page.getByRole('combobox', { name: 'Movimiento' })
  const trigger = page.getByRole('button', { name: 'Crear colección', exact: true })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  // También los portales comparten la preferencia de esta zona.
  await page
    .locator('[data-motion="system"]')
    .last()
    .evaluate((element) => {
      element.setAttribute('data-motion', 'off')
    })
  await expect(dialog).toHaveCSS('animation-name', 'none')
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await mode.selectOption('reduced')
  await expect(trigger).toHaveCSS('transition-duration', '0s')
  await mode.selectOption('off')
  await trigger.hover()
  await expect(trigger.locator('[data-position="end"]')).toHaveCSS('translate', 'none')
  await mode.selectOption('system')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await trigger.hover()
  await expect(trigger.locator('[data-position="end"]')).toHaveCSS('translate', 'none')
  await trigger.click()
  await expect(dialog).toHaveCSS('animation-name', 'none')
})

test('indicador RTL y cambios de etiqueta mantienen la selección alineada', async ({ page }) => {
  await openStory(page, 'contenido')
  await page.locator('html').evaluate((element) => {
    element.setAttribute('dir', 'rtl')
    element.dataset.motion = 'off'
  })
  const list = page.getByRole('tablist', { name: 'Colección pill' })
  const selected = list.getByRole('tab', { name: 'Diseño editorial' })
  await selected.evaluate((element) => {
    element.textContent = 'Diseño editorial para equipos'
  })
  await expect(async () => {
    const indicatorBox = await list.locator('.bl-tabs-indicator').boundingBox()
    const tabBox = await selected.boundingBox()
    expect(indicatorBox).not.toBeNull()
    expect(tabBox).not.toBeNull()
    if (!indicatorBox || !tabBox)
      throw new Error('Falta la geometría del indicador o de la pestaña.')
    expect(Math.abs(indicatorBox.x - tabBox.x)).toBeLessThan(2)
    expect(Math.abs(indicatorBox.width - tabBox.width)).toBeLessThan(2)
  }).toPass()
})

test('el texto largo cabe en móvil y al ampliar el texto al 200 %', async ({ page }) => {
  await openStory(page, 'texto-largo')
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.locator('html').evaluate((element) => {
      element.style.fontSize = '200%'
    })
    const overflow = await page.evaluate(() =>
      Array.from(document.querySelectorAll('body *'))
        .filter((element) => element.getBoundingClientRect().right > innerWidth + 1)
        .map((element) => ({
          tag: element.tagName,
          class: element.className,
          width: element.getBoundingClientRect().width,
        })),
    )
    expect(overflow).toEqual([])
    await expect(page.getByRole('heading')).toBeVisible()
    await expectNoViolations(page)
  }
})

test('la cabecera oculta vuelve al recibir foco', async ({ page }) => {
  await openStory(page, 'cabecera')
  const header = page.locator('header')
  await page.evaluate(() => window.scrollTo(0, 600))
  await expect(header).toHaveAttribute('data-hidden', 'true')
  await page
    .getByRole('link', { name: 'Betterlibs', exact: true })
    .evaluate((element: HTMLElement) => element.focus({ preventScroll: true }))
  await expect(header).not.toHaveAttribute('data-hidden')
  await expect(header).toHaveAttribute('data-scrolled', 'true')
})

test.describe('menú editorial táctil', () => {
  test.skip(
    ({ browserName }) => browserName === 'firefox',
    'Firefox no admite isMobile/hasTouch en Playwright; su recorrido móvil con teclado sigue cubierto.',
  )
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  test('abre, atrapa el foco, cierra y navega', async ({ page }) => {
    await openStory(page, 'cabecera')
    const trigger = page.getByRole('button', { name: 'Abrir menú' })
    await trigger.tap()
    const menu = page.getByRole('dialog', { name: 'Menú' })
    await expect(menu).toBeVisible()
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      await expect(menu.locator(':focus')).toHaveCount(1)
    }
    await expectNoViolations(page)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await trigger.tap()
    await menu.getByRole('link', { name: 'Documentación', exact: true }).tap()
    await expect(menu).toHaveCount(0)
    await expect(page.locator('main h1')).toBeFocused()
  })
})

import { expect, type Page, test } from '@playwright/test'

test.use({ reducedMotion: 'no-preference' })

const pageErrors = new Map<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  pageErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|hydrating|server rendered/i.test(message.text())) {
      errors.push(message.text())
    }
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Interfacesque se sientenvivas.')
})

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page), 'Errores de ejecución o hidratación').toEqual([])
  pageErrors.delete(page)
})

test('el enlace de salto lleva al contenido de Betterlibs', async ({ page }) => {
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Saltar al contenido principal' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('main')))).toBe(true)
})

test('las pestañas del movimiento funcionan con flechas y las tarjetas conservan su estado', async ({
  page,
}) => {
  const tabs = page.getByRole('tablist', { name: 'Tipo de animación' })
  await tabs.getByRole('tab', { name: 'Entrada' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(tabs.getByRole('tab', { name: 'Secuencia' })).toBeFocused()
  await expect(tabs.getByRole('tab', { name: 'Secuencia' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  const save = page.getByRole('button', { name: 'Guardar colección', exact: true })
  await save.click()
  await expect(page.getByRole('button', { name: 'Colección guardada' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await tabs.getByRole('tab', { name: 'Respuesta' }).click()
  await expect(page.getByRole('button', { name: 'Colección guardada' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('los componentes de ejemplo responden y el formulario no navega al confirmar', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Haz que pase' }).click()
  await expect(page.getByRole('status')).toContainText('Acción completada')
  const tabs = page.getByRole('tablist', { name: 'Componentes de ejemplo' })
  await tabs.getByRole('tab', { name: 'Tarjetas' }).click()
  await page.getByRole('button', { name: 'Añadir a mi colección' }).click()
  await expect(page.getByRole('button', { name: 'En tu colección' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await tabs.getByRole('tab', { name: 'Formularios' }).click()
  const input = page.getByRole('textbox', { name: 'Nombre del proyecto' })
  await input.fill('Atlas')
  await page.getByRole('button', { name: 'Previsualizar proyecto' }).click()
  await expect(page.getByRole('status')).toContainText(
    'Tu proyecto «Atlas» está listo para empezar.',
  )
  await expect(page).toHaveURL(/\/$/)
  await input.fill('   ')
  await page.getByRole('button', { name: 'Previsualizar proyecto' }).click()
  await expect(input).toBeFocused()
  expect(
    await input.evaluate((element: HTMLInputElement) => element.validity.patternMismatch),
  ).toBe(true)
})

test('desactivar movimiento cancela la animación y la preferencia del sistema no se puede forzar', async ({
  page,
}) => {
  const replay = page.getByRole('button', { name: 'Reproducir' })
  await expect(replay).toBeEnabled()
  await replay.click()
  expect(
    await page.locator('[data-preview-card]').evaluate((element) => element.getAnimations().length),
  ).toBeGreaterThan(0)
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await expect(replay).toBeDisabled()
  expect(
    await page.locator('[data-preview-card]').evaluate((element) => element.getAnimations().length),
  ).toBe(0)
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('system')
  await expect(replay).toBeEnabled()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(replay).toBeDisabled()
  await expect(page.locator('[data-pilot]')).toHaveAttribute('data-motion', 'reduced')
  await page.getByRole('button', { name: 'Guardar colección', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Colección guardada' })).toBeVisible()
})

test('las preferencias de tema conservan las interacciones y la página cabe en pantallas estrechas', async ({
  page,
}) => {
  const theme = page.getByRole('combobox', { name: 'Tema', exact: true })
  await theme.selectOption('dark')
  await expect(page.locator('[data-pilot]')).toHaveAttribute('data-theme', 'dark')
  await theme.selectOption('light')
  await expect(page.locator('[data-pilot]')).toHaveAttribute('data-theme', 'light')
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 })
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
    expect(fits, `Sin desbordamiento a ${width}px`).toBe(true)
  }
})

test('la plantilla corporativa y el historial conservan el foco y el título', async ({ page }) => {
  await page.getByRole('link', { name: 'Explorar plantilla', exact: true }).click()
  await expect(page).toHaveURL(/\/plantillas\/corporativa$/)
  await expect(page.locator('main h1')).toBeFocused()
  await expect(page).toHaveTitle(/Norte Consultores/)
  await page.goBack()
  await expect(page.locator('main h1')).toBeFocused()
  await expect(page).toHaveTitle(/Betterlibs/)
})

test('el menú móvil conserva el foco, hereda el tema y permite navegar a las secciones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  const open = page.getByRole('button', { name: 'Abrir menú' })
  await open.click()
  const menu = page.getByRole('dialog', { name: 'Explora Betterlibs' })
  await expect(menu).toBeVisible()
  expect(await menu.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
    'rgb(34, 34, 34)',
  )
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab')
    await expect(menu.locator(':focus')).toHaveCount(1)
  }
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(open).toBeFocused()
  await open.click()
  await menu.getByRole('link', { name: 'Componentes' }).click()
  await expect(menu).toBeHidden()
  await expect(page.locator('#components-title')).toBeFocused()
  await expect(page).toHaveURL(/#componentes$/)
})

test('el preset respeta el modo explícito bajo un sistema y un ancestro oscuros', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  const theme = page.getByRole('combobox', { name: 'Tema', exact: true })
  await theme.selectOption('light')
  await expect(page.locator('[data-pilot]')).toHaveCSS('background-color', 'rgb(245, 243, 238)')
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark'
  })
  await expect(page.locator('[data-pilot]')).toHaveCSS('background-color', 'rgb(245, 243, 238)')
  await theme.selectOption('system')
  await expect(page.locator('[data-pilot]')).toHaveCSS('background-color', 'rgb(20, 20, 20)')
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light'
  })
  await expect(page.locator('[data-pilot]')).toHaveCSS('background-color', 'rgb(245, 243, 238)')
  await theme.selectOption('dark')
  await expect(page.locator('[data-pilot]')).toHaveCSS('background-color', 'rgb(20, 20, 20)')
})

test('el preset en html sigue el sistema y permite cambiar el modo explícito', async ({ page }) => {
  await page.evaluate(() => {
    document.documentElement.dataset.preset = 'editorial'
    document.querySelector('[data-pilot]')?.removeAttribute('data-preset')
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(20, 20, 20)')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light'
  })
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(245, 243, 238)')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
})

test('la animación usa los overrides CSS de los tokens compartidos', async ({ page }) => {
  await page.locator('[data-pilot]').evaluate((element) => {
    ;(element as HTMLElement).style.setProperty('--bl-motion-reveal-duration', '2s')
  })
  await page.getByRole('button', { name: 'Reproducir' }).click()
  await expect
    .poll(() =>
      page
        .locator('[data-preview-card]')
        .evaluate((element) =>
          element.getAnimations().map((animation) => animation.effect?.getTiming().duration),
        ),
    )
    .toContain(2000)
})

test('el contenido y los controles se adaptan a texto ampliado al 200 %', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Texto ampliado a ${width}px`,
    ).toBe(true)
    const tabs = page.getByRole('tablist', { name: 'Componentes de ejemplo' })
    await tabs.getByRole('tab', { name: 'Formularios' }).click()
    await page
      .getByRole('textbox', { name: 'Nombre del proyecto' })
      .fill('Un proyecto con un nombre largo que conserva la lectura')
    await page.getByRole('button', { name: 'Previsualizar proyecto' }).click()
    await expect(page.getByRole('status')).toContainText('está listo para empezar')
  }
})

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('el contenido está prerenderizado y la plantilla es navegable', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Más que piezas/ })).toBeVisible()
    await expect(page.locator('[data-preview-card]')).toBeVisible()
    await page.getByRole('link', { name: 'Explorar plantilla', exact: true }).click()
    await expect(page.locator('main h1')).toContainText('Crece con orden')
    await expect(page).toHaveTitle(/Norte Consultores/)
  })
})

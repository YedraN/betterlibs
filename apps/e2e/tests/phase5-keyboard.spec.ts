import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, waitForStory } from './helpers'

test.use({ baseURL: STORYBOOK_URL, reducedMotion: 'no-preference' })
const url = (story: string, theme = 'light') =>
  `/iframe.html?id=componentes-editorial-catálogo--${story}&viewMode=story&globals=theme:${theme};preset:editorial;a11y.manual:!true`

for (const theme of ['light', 'dark']) {
  test(`formulario editorial ${theme}: errores, controles nativos, archivo y éxito`, async ({
    page,
  }) => {
    await page.goto(url('formularios', theme))
    await waitForStory(page)
    await page.getByRole('button', { name: 'Guardar colección' }).click()
    await expect(page.locator('.bl-error-summary-root')).toBeFocused()
    await page
      .locator('.bl-error-summary-root')
      .getByRole('link', { name: /Nombre de la colección/ })
      .click()
    await expect(page.getByRole('textbox', { name: /Nombre de la colección/ })).toBeFocused()
    await page.getByRole('textbox', { name: /Nombre de la colección/ }).fill('Atlas')
    await page.getByRole('textbox', { name: /Descripción/ }).fill('Una biblioteca para el equipo.')
    await page.getByRole('combobox', { name: 'Visibilidad' }).selectOption('public')
    await page.getByRole('radio', { name: 'Artículo' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: 'Galería' })).toBeChecked()
    await expect(page.getByRole('radio', { name: 'Vídeo' })).toBeDisabled()
    await page.getByRole('checkbox', { name: 'Imágenes' }).check()
    await page.getByRole('switch', { name: 'Recibir avisos' }).focus()
    await page.keyboard.press('Space')
    await expect(page.getByRole('switch', { name: 'Recibir avisos' })).not.toBeChecked()
    const file = page.getByLabel('Archivo de referencia')
    await file.setInputFiles({
      name: 'referencia-editorial-con-un-nombre-de-archivo-muy-largo.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Atlas'),
    })
    await page.getByRole('button', { name: /Quitar referencia/ }).click()
    await expect(file).toBeFocused()
    await expect(page.getByRole('textbox', { name: 'Código' })).toHaveAttribute('readonly', '')
    await page.getByRole('button', { name: 'Guardar colección' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Colección guardada' })).toBeVisible()
    await expectNoViolations(page)
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

  test(`menús y popover ${theme}: opciones, submenú, borrador y foco`, async ({ page }) => {
    await page.goto(url('menus-y-overlays', theme))
    await waitForStory(page)
    const trigger = page.getByRole('button', { name: 'Opciones de colección' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('menuitemcheckbox')).toBeFocused()
    await page.keyboard.press('Space')
    await expect(trigger).toBeFocused()
    await expect(page.getByRole('status')).toContainText('Retícula oculta')
    await trigger.click()
    await page.getByRole('menuitemradio', { name: 'Por nombre' }).click()
    await expect(page.getByRole('status')).toContainText('Por nombre')
    await trigger.click()
    await page.getByRole('menuitem', { name: 'Compartir' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('menuitem', { name: 'Preparar enlace' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(trigger).toBeFocused()
    await expect(page.getByRole('status')).toContainText('Enlace preparado')
    await page.getByRole('button', { name: 'Editar nombre', exact: true }).click()
    await expect(page.getByRole('textbox', { name: 'Nombre corto' })).toBeFocused()
    await page.getByRole('textbox', { name: 'Nombre corto' }).fill('Borrador')
    await expectNoViolations(page)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Editar nombre', exact: true })).toBeFocused()
    await expect(page.getByRole('textbox', { name: 'Nombre corto' })).toHaveCount(0)
    await page.getByRole('button', { name: 'Acerca del historial' }).focus()
    await expect(page.getByRole('tooltip')).toBeVisible()
    // Tooltip portaled: su región visual duplicada es decorativa respecto a la descripción accesible.
    await expectNoViolations(page, { disableRules: ['region'] })
    await page.keyboard.press('Escape')
  })

  test(`contenido editorial ${theme}: selección, paginación y texto ampliado`, async ({ page }) => {
    await page.goto(url('contenido', theme))
    await waitForStory(page)
    await page.getByRole('button', { name: 'Diseño editorial' }).click()
    await expect(page.getByRole('button', { name: 'Diseño editorial' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await page
      .getByRole('navigation', { name: 'Paginación' })
      .getByRole('button', { name: 'Siguiente', exact: true })
      .click()
    await expect(page.getByRole('button', { name: 'Página 3', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expectNoViolations(page)
    await page.setViewportSize({ width: 320, height: 900 })
    await page.locator('html').evaluate((element) => {
      element.style.fontSize = '200%'
    })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('.bl-skeleton-root').first()).toHaveCSS('animation-name', 'none')
  })
}

for (const side of ['right', 'left', 'top', 'bottom']) {
  test(`Drawer ${side}: modal, popover anidado y cierre inmediato`, async ({ page }) => {
    await page.goto(url('menus-y-overlays'))
    await waitForStory(page)
    await page.getByRole('combobox', { name: 'Lado del panel' }).selectOption(side)
    const trigger = page.getByRole('button', { name: 'Abrir panel' })
    await trigger.click()
    const drawer = page.getByRole('dialog', { name: 'Editar colección' })
    await expect(drawer).toBeVisible()
    await expect(drawer).toHaveAttribute('data-side', side)
    await expect(page.getByRole('textbox', { name: 'Título del borrador' })).toBeFocused()
    await page.getByRole('textbox', { name: 'Título del borrador' }).fill('Conservado')
    await page.getByRole('button', { name: 'Ayuda del borrador' }).click()
    await page.keyboard.press('Escape')
    await expect(drawer).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ayuda del borrador' })).toBeFocused()
    await expectNoViolations(page)
    // Comprueba el primer frame tras Escape: el foco no espera al rol de salida.
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(drawer).toHaveCount(0)
    await trigger.click()
    await expect(page.getByRole('textbox', { name: 'Título del borrador' })).toHaveValue(
      'Conservado',
    )
    await page.getByRole('button', { name: 'Guardar y cerrar panel' }).click()
    await expect(trigger).toBeFocused()
  })
}

test('Toast: F8, acción, salida inerte y actualización durante el cierre', async ({ page }) => {
  await page.goto(url('menus-y-overlays', 'dark'))
  await waitForStory(page)
  await page.getByRole('button', { name: 'Mostrar notificación' }).click()
  await expect(page.locator('.bl-toast-title')).toHaveText('Colección guardada')
  await page.keyboard.press('F8')
  await expect(page.locator('.bl-toast-viewport')).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Deshacer' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main [role="status"]')).toContainText('Cambios deshechos')
  await page.getByRole('button', { name: 'Mostrar notificación' }).click()
  await expect(page.locator('.bl-toast-toast[data-state="open"]')).toHaveCSS('opacity', '1')
  await expectNoViolations(page)
  await page
    .locator('main')
    .getByRole('button', { name: 'Cerrar notificación', exact: true })
    .click()
  const closing = page.locator('.bl-toast-toast[data-state="closed"]')
  await expect(closing).toHaveAttribute('inert', '')
  await expect(closing).toHaveAttribute('aria-hidden', 'true')
  await page.getByRole('button', { name: 'Actualizar notificación' }).click()
  await expect(page.locator('.bl-toast-title')).toHaveText('Colección actualizada')
  await page.waitForTimeout(450)
  await expect(page.locator('.bl-toast-title')).toHaveText('Colección actualizada')
})

test('posiciones y Tabs: carga diferida, cambios rápidos, modos y borradores', async ({ page }) => {
  const engines: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('position-engine-')) engines.push(request.url())
  })
  await page.goto(url('posiciones'))
  await waitForStory(page)
  await page.waitForTimeout(100)
  expect(engines).toHaveLength(0)
  await page.getByRole('textbox', { name: 'Nota de Lectura' }).fill('Borrador estable')
  await page.getByRole('button', { name: 'Invertir orden' }).click()
  await expect.poll(() => engines.length).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Invertir orden' }).click()
  await page.getByRole('button', { name: 'Cambiar retícula' }).click()
  await expect(page.getByRole('textbox', { name: 'Nota de Lectura' })).toHaveValue(
    'Borrador estable',
  )
  const list = page.getByRole('tablist', { name: 'Capacidades opcionales' })
  await list.getByRole('tab', { name: 'Lectura', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(list.getByRole('tab', { name: 'Diseño', exact: true })).toBeFocused()
  await expect(list.getByRole('tab', { name: 'Lectura', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.keyboard.press('Enter')
  await expect(list.getByRole('tab', { name: 'Diseño', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect
    .poll(() =>
      page.locator('.bl-tabs-indicator').evaluate((element) => element.getAnimations().length),
    )
    .toBeGreaterThan(0)
  await page.keyboard.press('ArrowRight')
  await expect(list.getByRole('tab', { name: 'Código', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('textbox', { name: 'Nota de código', exact: true })).toBeVisible()
  await page.getByRole('combobox', { name: 'Movimiento' }).selectOption('off')
  await expect
    .poll(() =>
      page
        .locator('[data-bl-layout], .bl-tabs-indicator')
        .evaluateAll((items) => items.every((item) => item.getAnimations().length === 0)),
    )
    .toBe(true)
  await page.getByRole('button', { name: 'Alternar pieza' }).click()
  await expect(page.getByRole('textbox', { name: 'Nota de Archivo' })).toBeVisible()
  await expectNoViolations(page)
  await page.getByRole('combobox', { name: 'Movimiento' }).selectOption('system')
  await page.getByRole('button', { name: 'Cambiar retícula' }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() =>
      page
        .locator('[data-bl-layout]')
        .evaluateAll((items) =>
          items.every(
            (item) =>
              item.getAnimations().length === 0 && (item as HTMLElement).style.transform === '',
          ),
        ),
    )
    .toBe(true)
})

test('capacidad bloqueada o WAAPI ausente: contenido y controles permanecen utilizables', async ({
  page,
}) => {
  await page.route('**/position-engine-*.js', (route) => route.abort())
  await page.goto(url('posiciones'))
  await waitForStory(page)
  await page.getByRole('button', { name: 'Invertir orden' }).click()
  await expect
    .poll(() =>
      page
        .locator('[data-bl-layout]')
        .evaluateAll((items) =>
          items.every((item) => (item as HTMLElement).style.transform === ''),
        ),
    )
    .toBe(true)
  await page.getByRole('tab', { name: 'Diseño', exact: true }).click()
  await expect(page.getByRole('tabpanel')).toContainText('continuidad')
  await page.reload()
  await page.evaluate(() => {
    Element.prototype.animate = undefined as unknown as typeof Element.prototype.animate
  })
  await page.getByRole('button', { name: 'Cambiar retícula' }).click()
  await expect(page.getByRole('textbox', { name: 'Nota de Lectura' })).toBeVisible()
})

test('indicador vertical RTL: flechas, geometría y cancelación', async ({ page }) => {
  await page.goto(url('posiciones-verticales-rtl'))
  await waitForStory(page)
  const list = page.getByRole('tablist', { name: 'Capacidades opcionales' })
  await list.getByRole('tab', { name: 'Lectura', exact: true }).focus()
  await page.keyboard.press('ArrowDown')
  await expect(list.getByRole('tab', { name: 'Diseño', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(list.getByRole('tab', { name: 'Diseño', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByRole('tabpanel')).toContainText('continuidad')
  await page.getByRole('combobox', { name: 'Movimiento' }).selectOption('reduced')
  const indicator = page.locator('.bl-tabs-indicator')
  await expect.poll(() => indicator.evaluate((element) => element.getAnimations().length)).toBe(0)
  await expect(indicator).toHaveCSS('width', '2px')
  const delta = await list.evaluate((element) => {
    const active = element.querySelector('[data-state="active"]')?.getBoundingClientRect()
    const indicator = element.querySelector('.bl-tabs-indicator')?.getBoundingClientRect()
    return active && indicator
      ? Math.abs(active.right - indicator.right) + Math.abs(active.top - indicator.top)
      : Infinity
  })
  expect(delta).toBeLessThan(1)
  await page.setViewportSize({ width: 390, height: 844 })
  await expectNoViolations(page)
})

test('Carousel cancela autoplay al cambiar data-motion y mantiene navegación directa', async ({
  page,
}) => {
  await page.clock.install()
  await page.goto(url('contenido'))
  await waitForStory(page)
  const carousel = page.getByRole('region', { name: 'Piezas destacadas' })
  await carousel.scrollIntoViewIfNeeded()
  await page.locator('html').evaluate((element) => {
    element.dataset.motion = 'off'
  })
  await expect(carousel.getByRole('button', { name: 'Reanudar el carrusel' })).toBeDisabled()
  const current = await carousel.locator('[aria-current="true"]').getAttribute('aria-label')
  await page.clock.fastForward(12000)
  await expect(carousel.locator('[aria-current="true"]')).toHaveAttribute(
    'aria-label',
    current ?? '',
  )
  await carousel.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(carousel.locator('[aria-current="true"]')).toHaveAttribute(
    'aria-label',
    'Ir a la diapositiva 2',
  )
  await page.locator('html').evaluate((element) => {
    delete element.dataset.motion
  })
  await expect(carousel.getByRole('button', { name: 'Pausar el carrusel' })).toBeEnabled()
})

test.describe('interacciones táctiles', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })
  test('menú, panel y descarte de una notificación en móvil', async ({ page }) => {
    await page.goto(url('menus-y-overlays', 'dark'))
    await waitForStory(page)
    await page.getByRole('button', { name: 'Opciones de colección' }).tap()
    await page.getByRole('menuitemcheckbox').tap()
    await expect(page.getByRole('status')).toContainText('Retícula oculta')
    await page.getByRole('button', { name: 'Abrir panel' }).tap()
    await page.getByRole('button', { name: 'Guardar y cerrar panel' }).tap()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('button', { name: 'Mostrar notificación' }).tap()
    const toast = page.locator('.bl-toast-toast[data-state="open"]')
    await expect(toast).toBeVisible()
    const box = await toast.boundingBox()
    if (!box) throw new Error('No hay una notificación visible')
    const touch = await page.context().newCDPSession(page)
    const x = box.x + 50
    const y = box.y + 30
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x + 20, y }],
    })
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x + 100, y }],
    })
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await touch.detach()
    await expect(toast).toHaveCount(0)
  })
})

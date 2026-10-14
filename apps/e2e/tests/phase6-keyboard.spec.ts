import { expect, test } from '@playwright/test'
import { expectNoViolations } from './helpers'

test.use({ reducedMotion: 'no-preference' })

const templates = ['/plantillas/producto', '/plantillas/estudio', '/plantillas/articulo']
for (const route of templates) {
  test(`${route}: SSR sin JavaScript, imágenes locales y lectura a 200 %`, async ({
    browser,
    page,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    })
    const staticPage = await context.newPage()
    await staticPage.goto(`http://localhost:4173${route}`)
    await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(staticPage.locator('main')).not.toContainText('undefined')
    await context.close()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(route)
    await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true)
    await expectNoViolations(page)
    // Los motores usan distintos márgenes para lazy loading: solicita cada imagen al entrar en vista.
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
        )
        .toBe(true)
    }
  })
}

test('los precios cambian con flechas sin perder foco y el formulario valida antes de preparar', async ({
  page,
}) => {
  await page.goto('/plantillas/producto')
  const annual = page.getByRole('radio', { name: 'Anual · ahorra 20 %' })
  const monthly = page.getByRole('radio', { name: 'Mensual', exact: true })
  await monthly.focus()
  await page.keyboard.press('ArrowRight')
  await expect(annual).toBeChecked()
  await expect(annual).toBeFocused()
  await expect(page.locator('.bl-pricing-amount').first()).toHaveText('115,20 €')
  await expect(page.getByText('Equivale a 9,60 €/mes')).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(monthly).toBeFocused()
  await page.getByRole('link', { name: 'Elegir Equipo', exact: true }).click()
  await expect(page.locator('#acceso')).toBeFocused()
  await page.getByRole('button', { name: 'Preparar solicitud' }).click()
  await expect(page.locator('.bl-error-summary-root')).toBeFocused()
  await expect(page.getByRole('textbox', { name: 'Nombre del equipo' })).toHaveAttribute(
    'aria-invalid',
    'true',
  )
  await page.getByRole('textbox', { name: 'Nombre del equipo' }).fill('Atlas')
  await page.getByRole('textbox', { name: 'Correo de trabajo' }).fill('equipo@example.com')
  await page.getByRole('button', { name: 'Preparar solicitud' }).click()
  await expect(page.getByText('Solicitud preparada.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Añadir tarea de ejemplo' }).click()
  await expect(page.getByText('1 tarea añadida al ejemplo.')).toBeVisible()
})

test('anclas de la misma ruta orientan foco, cambian historial y progreso incluso en off', async ({
  page,
}) => {
  await page.goto('/plantillas/articulo')
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  const anchor = page
    .getByRole('navigation', { name: 'En este artículo' })
    .getByRole('link', { name: 'Llegar y poder volver' })
  await anchor.scrollIntoViewIfNeeded()
  const previous = await page.evaluate(() => window.scrollY)
  await anchor.click()
  await expect(page).toHaveURL(/#navegacion$/)
  await expect(page.locator('#navegacion')).toBeFocused()
  const progress = page.getByRole('progressbar', { name: 'Progreso de lectura' })
  await expect
    .poll(() => progress.evaluate((node) => (node as HTMLProgressElement).value))
    .toBeGreaterThan(0.5)
  await page.goBack()
  await expect(page).toHaveURL('/plantillas/articulo')
  await expect
    .poll(() => page.evaluate((value) => Math.abs(window.scrollY - value), previous))
    .toBeLessThan(10)
  await page.goForward()
  await expect(page.locator('#navegacion')).toBeFocused()
  await expect
    .poll(() => progress.evaluate((node) => (node as HTMLProgressElement).value))
    .toBeGreaterThan(0.5)
})

test('una ruta nueva anuncia título y foco, atrás/adelante restaura scroll y la página mantiene tema', async ({
  page,
}) => {
  await page.goto('/plantillas/articulo')
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  await page
    .getByRole('link', { name: 'Explorar la página de producto', exact: true })
    .scrollIntoViewIfNeeded()
  const previous = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: 'Explorar la página de producto', exact: true }).click()
  await expect(page).toHaveURL('/plantillas/producto')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page).toHaveTitle('El trabajo en su sitio · Atlas')
  await expect(page.getByRole('combobox', { name: 'Tema', exact: true })).toHaveValue('dark')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10)
  await page.evaluate(() => window.scrollTo(0, 700))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(650)
  await page.goBack()
  await expect(page).toHaveURL('/plantillas/articulo')
  await expect
    .poll(() => page.evaluate((value) => Math.abs(window.scrollY - value), previous))
    .toBeLessThan(10)
  await page.goForward()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(650)
})

test('la ausencia de View Transition y un hash mal formado conservan navegación funcional', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: undefined })
    Object.defineProperty(Element.prototype, 'animate', { configurable: true, value: undefined })
  })
  await page.goto('/plantillas/producto')
  await page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Artículo', exact: true })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.evaluate(() => {
    window.location.hash = '%E0%A4%A'
  })
  await expect(page).toHaveURL(/%E0%A4%A$/)
  await page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Estudio', exact: true })
    .click()
  await expect(page).toHaveURL('/plantillas/estudio')
  expect(errors).toEqual([])
})

test('los enlaces con target y clic modificado mantienen apertura nativa', async ({ page }) => {
  await page.goto('/plantillas/producto')
  const link = page.getByRole('link', { name: 'Ver la librería', exact: true })
  await link.evaluate((node) => node.setAttribute('target', '_blank'))
  const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()])
  await expect(page).toHaveURL('/plantillas/producto')
  await popup.close()
  await link.evaluate((node) => node.removeAttribute('target'))
  // Observe the event after React's delegated handler, then suppress the browser's tab action.
  await page.evaluate(() =>
    document.addEventListener(
      'click',
      (event) => {
        document.documentElement.dataset.modifiedPrevented = String(event.defaultPrevented)
        event.preventDefault()
      },
      { once: true },
    ),
  )
  await link.click({ modifiers: ['Control'] })
  await expect(page.locator('html')).toHaveAttribute('data-modified-prevented', 'false')
  await expect(page).toHaveURL('/plantillas/producto')
})

test('el menú móvil lleva a la plantilla, cierra su portal y sitúa el foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/plantillas/producto')
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  const dialog = page.getByRole('dialog', { name: 'Menú' })
  await dialog.getByRole('link', { name: 'Estudio', exact: true }).click()
  await expect(page).toHaveURL('/plantillas/estudio')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
})

test('una descarga conserva su enlace nativo y no crea una entrada del router', async ({
  page,
}) => {
  await page.goto('/plantillas/producto')
  const link = page.getByRole('link', { name: 'Ver la librería', exact: true })
  await link.evaluate((node) => {
    node.setAttribute('href', '/editorial/reading-cover.svg')
    node.setAttribute('download', 'portada.svg')
  })
  const [download] = await Promise.all([page.waitForEvent('download'), link.click()])
  expect(download.suggestedFilename()).toBe('portada.svg')
  await expect(page).toHaveURL('/plantillas/producto')
})

test('View Transition se omite en off y se cancela al reducir el sistema durante un cambio', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const start = document.startViewTransition?.bind(document)
    if (!start) return
    let count = 0
    let skipped = 0
    document.startViewTransition = (...args) => {
      document.documentElement.dataset.transitionCount = String(++count)
      const transition = start(...args)
      const skip = transition.skipTransition.bind(transition)
      transition.skipTransition = () => {
        document.documentElement.dataset.transitionSkipped = String(++skipped)
        skip()
      }
      return transition
    }
  })
  await page.goto('/plantillas/producto')
  await page.addStyleTag({
    content:
      '::view-transition-old(root),::view-transition-new(root) {animation-duration: 5s !important;}',
  })
  await page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Estudio', exact: true })
    .click()
  await expect(page.locator('html')).toHaveAttribute('data-transition-count', '1')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('html')).toHaveAttribute('data-transition-skipped', /^[1-9]/)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Artículo', exact: true })
    .click()
  await expect(page.locator('html')).toHaveAttribute('data-transition-count', '1')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
})

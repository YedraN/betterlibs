import AxeBuilder from '@axe-core/playwright'
import { chromium, expect } from '@playwright/test'

const origin = process.env.BETTERLIBS_DOCS_TEST_URL ?? 'http://localhost:3001'
const browser = await chromium.launch()
try {
  const context = await browser.newContext({ reducedMotion: 'no-preference', locale: 'es-ES' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|mismatch/i.test(message.text()))
      errors.push(message.text())
  })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
  await page.goto(`${origin}/docs/galeria`)
  const search = page.getByRole('searchbox', { name: 'Buscar ejemplos' })
  await search.fill('dialogo')
  await expect(page.getByRole('group', { name: 'Diálogo con contexto', exact: true })).toBeVisible()
  await expect(page.getByText('1 ejemplo disponible.', { exact: true })).toBeVisible()
  await search.fill('no existe este ejemplo')
  await expect(
    page.getByText('No hay ejemplos para esta búsqueda.', { exact: false }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Limpiar filtros' }).click()
  await expect(search).toBeFocused()
  await page
    .getByRole('group', { name: 'Filtrar por uso' })
    .getByRole('button', { name: 'Componentes', exact: true })
    .click()
  const form = page.getByRole('group', { name: 'Formulario y borrador', exact: true })
  const commands = page.getByRole('group', { name: 'Buscar y ejecutar acciones', exact: true })
  await commands.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  await commands.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await commands.getByRole('button', { name: 'Buscar acciones', exact: true }).click()
  const palette = page.getByRole('dialog', { name: '¿Qué quieres hacer?' })
  await expect(palette.getByRole('combobox')).toBeFocused()
  expect(
    await palette.evaluate((element) => {
      const portal = element.closest('[data-docs-preview]')
      return {
        theme: portal?.getAttribute('data-theme'),
        mode: portal?.getAttribute('data-motion'),
      }
    }),
  ).toEqual({ theme: 'dark', mode: 'off' })
  await palette.getByRole('combobox').fill('crear coleccion')
  await expect(palette.getByRole('option')).toHaveCount(1)
  await palette.getByRole('combobox').press('Enter')
  await expect(commands.getByRole('button', { name: 'Buscar acciones', exact: true })).toBeFocused()
  await expect(commands.getByRole('status').filter({ hasText: 'Acción elegida:' })).toContainText(
    'Acción elegida: Nueva colección.',
  )
  await commands.getByText('Ver código', { exact: true }).click()
  await commands.getByRole('button', { name: 'Copiar código', exact: true }).click()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'export function CommandExample',
  )
  await form.getByRole('textbox', { name: 'Nombre del proyecto' }).fill('Atlas doc')
  await form
    .getByRole('textbox', { name: 'Descripción', exact: true })
    .fill('Un borrador que permanece')
  await form.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  await form.getByRole('combobox', { name: 'Estilo', exact: true }).selectOption('default')
  await form.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await expect(form.getByRole('textbox', { name: 'Nombre del proyecto' })).toHaveValue('Atlas doc')
  await expect(form.getByRole('textbox', { name: 'Descripción', exact: true })).toHaveValue(
    'Un borrador que permanece',
  )
  await form.getByText('Ver código', { exact: true }).click()
  await form.getByRole('button', { name: 'Copiar código' }).click()
  await expect(form.getByText('Código copiado.', { exact: true })).toBeVisible()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('export function FormExample')
  expect(copied).not.toContain('usePreviewReplay')
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: () => Promise.reject(new Error('Denied')),
    })
  })
  await form.getByRole('button', { name: 'Copiar código' }).click()
  await expect(form.getByText('No se pudo copiar. Abre el código y selecciónalo.')).toBeVisible()
  await form.getByRole('button', { name: 'Guardar proyecto' }).click()
  await expect(
    form.getByText('Proyecto guardado en esta demostración.', { exact: true }),
  ).toBeVisible()
  const dialogDemo = page.getByRole('group', { name: 'Diálogo con contexto', exact: true })
  await dialogDemo.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  await dialogDemo.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await dialogDemo.getByRole('button', { name: 'Editar colección' }).click()
  const dialog = page.getByRole('dialog', { name: 'Editar colección', exact: true })
  await expect(dialog).toBeVisible()
  const attributes = await dialog.evaluate((element) => {
    const portal = element.closest('[data-docs-preview]')
    return { theme: portal?.getAttribute('data-theme'), mode: portal?.getAttribute('data-motion') }
  })
  expect(attributes).toEqual({ theme: 'dark', mode: 'off' })
  await dialog.getByRole('textbox', { name: 'Nombre de la colección' }).fill('Atlas portal')
  await page.keyboard.press('Escape')
  await expect(dialogDemo.getByRole('button', { name: 'Editar colección' })).toBeFocused()
  await dialogDemo.getByRole('button', { name: 'Editar colección' }).click()
  await expect(dialog.getByRole('textbox', { name: 'Nombre de la colección' })).toHaveValue(
    'Atlas portal',
  )
  await page.keyboard.press('Escape')
  await page
    .getByRole('group', { name: 'Filtrar por uso' })
    .getByRole('button', { name: 'Movimiento', exact: true })
    .click()
  const reveal = page.getByRole('group', { name: 'Entradas con ritmo', exact: true })
  await reveal.locator('[data-bl-reveal]').first().scrollIntoViewIfNeeded()
  await reveal.evaluate((node) => node.style.setProperty('--bl-motion-reveal-duration', '2s'))
  await reveal.getByRole('button', { name: 'Repetir animación' }).click()
  await expect
    .poll(() =>
      reveal
        .locator('[data-bl-reveal]')
        .evaluateAll((nodes) => nodes.flatMap((node) => node.getAnimations()).length),
    )
    .toBeGreaterThan(0)
  await reveal.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await expect(reveal.getByRole('button', { name: 'Repetir animación' })).toBeDisabled()
  await expect
    .poll(() =>
      reveal
        .locator('[data-bl-reveal]')
        .evaluateAll((nodes) => nodes.flatMap((node) => node.getAnimations()).length),
    )
    .toBe(0)
  await reveal.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('system')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(reveal.getByRole('button', { name: 'Repetir animación' })).toBeDisabled()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const presence = page.getByRole('group', { name: 'Contenido condicional', exact: true })
  await presence.getByRole('button', { name: 'Mostrar detalles' }).click()
  await presence.getByRole('textbox', { name: 'Borrador del detalle' }).fill('Atlas presencia')
  await presence.getByRole('button', { name: 'Cerrar detalle' }).click()
  await expect(presence.getByRole('button', { name: 'Mostrar detalles' })).toBeFocused()
  await presence.getByRole('button', { name: 'Mostrar detalles' }).click()
  await expect(presence.getByRole('textbox', { name: 'Borrador del detalle' })).toHaveValue(
    'Atlas presencia',
  )
  await presence.getByRole('button', { name: 'Cerrar detalle' }).click()
  const routes = [
    '/docs/componentes/interactivos/command',
    '/',
    '/docs/galeria',
    '/docs/movimiento',
    '/docs/movimiento/preferencias',
    '/docs/movimiento/reveal',
    '/docs/movimiento/stagger',
    '/docs/movimiento/presence',
    '/docs/movimiento/animated-number',
    '/docs/movimiento/text-reveal',
    '/docs/movimiento/scroll-progress',
    '/docs/movimiento/animacion-de-acciones',
    '/docs/movimiento/posiciones',
    '/docs/movimiento/tabs-con-spring',
    '/docs/primeros-pasos/instalacion',
    '/docs/guias/ssr-y-preferencias',
    '/docs/guias/composicion-con-radix',
    '/docs/guias/rendimiento',
    '/docs/guias/migracion-editorial',
    '/docs/guias/resolver-problemas',
  ]
  for (const route of routes) {
    const response = await page.goto(`${origin}${route}`)
    expect(response?.ok(), route).toBe(true)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      route,
    ).toBe(true)
  }
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
    for (const route of ['/', '/docs/galeria', '/docs/movimiento/scroll-progress']) {
      await page.goto(`${origin}${route}`)
      await expect(page.locator('html')).toHaveClass(new RegExp(scheme))
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze()
      expect(
        results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        `${route} ${scheme}`,
      ).toEqual([])
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of [
    '/',
    '/docs/movimiento/preferencias',
    '/docs/movimiento/animacion-de-acciones',
  ]) {
    await page.goto(`${origin}${route}`)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      route,
    ).toBe(true)
  }
  await page.goto(`${origin}/docs/galeria`)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.getByRole('searchbox', { name: 'Buscar ejemplos' }).fill('articulo')
  await expect(
    page.getByRole('link', { name: 'Explorar artículo →', exact: true }),
  ).toHaveAttribute('href', /\/plantillas\/articulo$/)
  await page.goto(`${origin}/docs/movimiento`)
  const mobileSearch = page
    .locator('#nd-subnav')
    .getByRole('button', { name: 'Abrir búsqueda', exact: true })
  await expect(mobileSearch).toBeVisible()
  await mobileSearch.click()
  await expect(page.getByRole('dialog', { name: 'Buscar', exact: true })).toBeVisible()
  await page.getByRole('combobox', { name: 'Buscar', exact: true }).fill('ScrollProgress')
  const result = page.getByRole('option', {
    name: 'Documentación Movimiento ScrollProgress',
    exact: true,
  })
  await expect(result).toBeVisible()
  await result.click()
  await expect(page).toHaveURL(`${origin}/docs/movimiento/scroll-progress`)
  await expect(
    page.getByRole('heading', { level: 1, name: 'ScrollProgress', exact: true }),
  ).toBeVisible()
  expect(errors).toEqual([])
  const noScript = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await noScript.newPage()
  await staticPage.goto(`${origin}/docs/galeria`)
  await expect(
    staticPage.getByRole('heading', { name: 'Acciones y estados', exact: true }),
  ).toBeVisible()
  await expect(
    staticPage.getByRole('heading', { name: 'Una idea clara. Un ritmo propio.', exact: true }),
  ).toBeVisible()
  await noScript.close()
  console.log(
    'Fase 7: búsqueda, código, copia, borradores, portales, preferencias, foco, API, axe, SSR y texto ampliado correctos.',
  )
} finally {
  await browser.close()
}

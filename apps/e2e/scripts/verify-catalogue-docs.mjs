import { mkdir, writeFile } from 'node:fs/promises'
import AxeBuilder from '@axe-core/playwright'
import { chromium, expect } from '@playwright/test'

const origin = process.env.BETTERLIBS_DOCS_TEST_URL ?? 'http://localhost:3001'
const routes = [
  'combobox',
  'multi-select',
  'date-picker',
  'data-table',
  'sidebar',
  'stepper',
  'dropzone',
  'slider',
  'toggle-group',
  'tree-view',
  'split-pane',
  'kanban',
  'timeline',
  'empty-state',
  'code-block',
  'image-viewer',
  'inline-edit',
  'notifications',
  'filter-toolbar',
]
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const browser = await chromium.launch()
const report = {
  origin,
  verifiedAt: new Date().toISOString(),
  routes,
  audits: 0,
  mobileRoutes: 0,
  ssrRoutes: 0,
  errors: [],
}
try {
  const context = await browser.newContext({ reducedMotion: 'reduce', locale: 'es-ES' })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
  const page = await context.newPage()
  page.on('pageerror', (error) => report.errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|mismatch/i.test(message.text()))
      report.errors.push(message.text())
  })
  for (const route of routes) {
    const response = await page.goto(`${origin}/docs/componentes/avanzados/${route}`)
    expect(response?.ok(), route).toBe(true)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const preview = page.getByRole('group', { name: 'Ejemplo interactivo', exact: true })
    await expect(preview).toBeVisible()
    for (const preset of ['default', 'editorial']) {
      await preview.getByRole('combobox', { name: 'Estilo', exact: true }).selectOption(preset)
      for (const theme of ['light', 'dark']) {
        await preview.getByRole('combobox', { name: 'Tema', exact: true }).selectOption(theme)
        const results = await new AxeBuilder({ page }).withTags(tags).analyze()
        expect(
          results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
          `${route} ${preset} ${theme}`,
        ).toEqual([])
        report.audits++
      }
    }
    await preview.getByRole('button', { name: 'Copiar código', exact: true }).click()
    expect(await page.evaluate(() => navigator.clipboard.readText()), route).toContain(
      'export function',
    )
  }
  await page.goto(`${origin}/docs/componentes/avanzados/combobox`)
  const preview = page.getByRole('group', { name: 'Ejemplo interactivo', exact: true })
  await preview.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  await preview.getByRole('combobox', { name: 'Estilo', exact: true }).selectOption('default')
  const trigger = preview.getByRole('combobox', { name: /Proyecto:/ })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Proyecto', exact: true })
  await expect(dialog).toBeVisible()
  expect(
    await dialog.evaluate((node) => ({
      theme: node.closest('[data-docs-preview]')?.getAttribute('data-theme'),
      preset: node.closest('[data-docs-preview]')?.getAttribute('data-preset'),
    })),
  ).toEqual({ theme: 'dark', preset: 'default' })
  const search = dialog.getByRole('combobox', { name: 'Buscar proyecto' })
  await search.fill('diseño')
  await search.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(trigger).toContainText('Atlas')
  await page.goto(`${origin}/docs/galeria`)
  await expect(page.getByText('29 ejemplos disponibles.', { exact: true })).toBeVisible()
  await page.getByRole('searchbox', { name: 'Buscar ejemplos' }).fill('Paneles ajustables')
  await expect(page.getByRole('group', { name: 'Paneles ajustables', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 320, height: 900 })
  for (const route of routes) {
    await page.goto(`${origin}/docs/componentes/avanzados/${route}`)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `${route}: 320px, texto 200%`,
    ).toBe(true)
    report.mobileRoutes++
  }
  const noScript = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await noScript.newPage()
  for (const route of routes) {
    await staticPage.goto(`${origin}/docs/componentes/avanzados/${route}`)
    await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(
      staticPage.getByRole('group', { name: 'Ejemplo interactivo', exact: true }),
    ).toBeVisible()
    report.ssrRoutes++
  }
  await noScript.close()
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`${origin}/docs/componentes/avanzados/kanban`)
  await page
    .getByRole('group', { name: 'Ejemplo interactivo', exact: true })
    .getByRole('combobox', { name: 'Tema', exact: true })
    .selectOption('dark')
  await page.screenshot({ path: '../../.release/catalogue-desktop.png' })
  expect(report.errors, 'Errores de cliente/hidratación').toEqual([])
  await mkdir(new URL('../../../docs/quality/', import.meta.url), { recursive: true })
  await writeFile(
    new URL('../../../docs/quality/catalogue-docs.json', import.meta.url),
    `${JSON.stringify(report, null, 2)}\n`,
  )
  console.log(
    `Catálogo Next: ${report.audits} auditorías axe, ${report.mobileRoutes} rutas móviles, ${report.ssrRoutes} SSR; copia, búsqueda, portales y foco correctos.`,
  )
} finally {
  await browser.close()
}

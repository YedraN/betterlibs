import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, readStories, storyUrl, waitForStory } from './helpers'

test.use({ baseURL: STORYBOOK_URL })
const stories = readStories().filter((story) => story.title === 'Componentes/Avanzados/Catálogo')
const open = async (page: import('@playwright/test').Page, name: string) => {
  const story = stories.find((item) => item.name === name)
  if (!story) throw new Error(`Falta la story ${name}`)
  await page.goto(storyUrl(story.id))
  await waitForStory(page)
}

for (const story of stories) {
  test(`Avanzados ${story.name}: responsive y texto ampliado`, async ({ page }) => {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(storyUrl(story.id))
      await waitForStory(page)
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%'
      })
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
        console.log(
          'Overflow',
          story.name,
          width,
          await page.evaluate(() =>
            [...document.querySelectorAll('main *')]
              .filter((node) => {
                const rectangle = node.getBoundingClientRect()
                if (rectangle.width <= innerWidth && rectangle.right <= innerWidth) return false
                let parent = node.parentElement
                while (parent && parent.tagName !== 'MAIN') {
                  if (
                    ['auto', 'scroll', 'hidden', 'clip'].includes(
                      getComputedStyle(parent).overflowX,
                    )
                  )
                    return false
                  parent = parent.parentElement
                }
                return true
              })
              .slice(0, 12)
              .map((node) => ({
                tag: node.tagName,
                class: node.className,
                text: node.textContent?.slice(0, 30),
                width: node.getBoundingClientRect().width,
              })),
          ),
        )
      }
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true)
    }
  })
}

test('Avanzados Combobox: filtro, selección, foco y portal oscuro', async ({ page }) => {
  await open(page, 'Combobox')
  const trigger = page.getByRole('combobox', { name: /Proyecto:/ })
  await trigger.click()
  const search = page.getByRole('combobox', { name: 'Buscar proyecto' })
  await expect(search).toBeFocused()
  await expectNoViolations(page)
  await search.fill('diseño')
  await search.press('Enter')
  await expect(trigger).toBeFocused()
  await expect(trigger).toContainText('Atlas')
  await trigger.click()
  await search.fill('nada')
  await expect(page.getByRole('option')).toHaveCount(0)
  await search.press('Escape')
  await expect(trigger).toBeFocused()
})
test('Avanzados Multi Select: añadir, quitar y conservar búsqueda', async ({ page }) => {
  await open(page, 'Multi Select')
  await page.getByRole('button', { name: 'Elegir especialidades (0)' }).click()
  const search = page.getByRole('combobox', { name: 'Buscar especialidades' })
  await search.fill('movimiento')
  await search.press('Enter')
  await expect(page.getByRole('option', { name: 'Quitar Movimiento' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await search.press('Escape')
  await page.getByRole('button', { name: 'Quitar Movimiento' }).click()
  await expect(page.getByRole('status')).toContainText('0 seleccionadas')
})
test('Avanzados Date Picker: teclado, límites y selección del calendario', async ({ page }) => {
  await open(page, 'Date Picker')
  const trigger = page.getByRole('button', { name: /Abrir calendario/ })
  await trigger.click()
  const grid = page.getByRole('grid')
  await expectNoViolations(page)
  await expect(grid.locator('button[data-date="2026-10-14"]')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Fecha de entrega', { exact: true })).toHaveValue('2026-10-15')
  await expect(trigger).toBeFocused()
})
test('Avanzados Data Table: selección, ordenación y búsqueda', async ({ page }) => {
  await open(page, 'Data Table')
  await page.getByRole('button', { name: /Piezas/ }).click()
  await expect(page.getByRole('columnheader', { name: /Piezas/ })).toHaveAttribute(
    'aria-sort',
    'ascending',
  )
  await page.getByRole('checkbox', { name: 'Seleccionar esta página' }).check()
  await expect(page.getByRole('status')).toContainText('5 seleccionados')
  await page.getByRole('textbox', { name: 'Buscar en colecciones' }).fill('ninguna')
  await expect(page.getByRole('cell', { name: /No hay coincidencias/ })).toBeVisible()
})
test('Avanzados Sidebar: panel móvil y retorno de foco', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, 'Sidebar')
  const trigger = page.getByRole('button', { name: 'Abrir navegación del proyecto' })
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})
test('Avanzados Stepper: validación, borrador y completar', async ({ page }) => {
  await open(page, 'Stepper')
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Escribe')
  await page.getByRole('textbox', { name: 'Nombre de la colección' }).fill('Mi colección')
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
  await page.getByRole('button', { name: 'Anterior', exact: true }).click()
  await expect(page.getByRole('textbox')).toHaveValue('Mi colección')
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
  await page.getByRole('button', { name: 'Completar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Proceso completado' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Proceso completado' })).toBeFocused()
})
test('Avanzados Dropzone: acepta y rechaza archivos', async ({ page }) => {
  await open(page, 'Dropzone')
  await page.locator('input[type="file"]').setInputFiles([
    { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Notas') },
    { name: 'blocked.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('file') },
  ])
  await expect(page.getByRole('alert')).toContainText('formato no admitido')
  await page.getByRole('button', { name: 'Quitar notes.txt' }).click()
  await expect(page.getByText('notes.txt', { exact: true })).toHaveCount(0)
})
test('Avanzados Slider: teclado nativo y extremos', async ({ page }) => {
  await open(page, 'Slider')
  const slider = page.getByRole('slider')
  await slider.focus()
  await slider.press('ArrowRight')
  await expect(slider).toHaveValue('25')
  await slider.press('End')
  await expect(slider).toHaveValue('48')
  await slider.press('Home')
  await expect(slider).toHaveValue('14')
})
test('Avanzados Toggle Group: flechas y confirmación', async ({ page }) => {
  await open(page, 'Toggle Group')
  await page.getByRole('button', { name: 'Retícula' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('button', { name: 'Lista' })).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.getByRole('button', { name: 'Lista' })).toHaveAttribute('aria-pressed', 'true')
})
test('Avanzados Tree View: expandir y seleccionar', async ({ page }) => {
  await open(page, 'Tree View')
  await page.getByRole('treeitem', { name: 'Atlas', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('treeitem', { name: 'Portada', exact: true })).toBeFocused()
  await expect(page.getByRole('treeitem', { name: 'Portada', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('treeitem', { name: 'Atlas', exact: true })).toBeFocused()
})
test('Avanzados Split Pane: teclado del separador', async ({ page }) => {
  await open(page, 'Split Pane')
  const handle = page.getByRole('separator')
  await handle.focus()
  await handle.press('ArrowRight')
  await expect(handle).toHaveAttribute('aria-valuenow', '52')
  await handle.press('End')
  await expect(handle).toHaveAttribute('aria-valuenow', '80')
})
test('Avanzados Kanban: mover sin arrastre y restaurar foco', async ({ page }) => {
  await open(page, 'Kanban')
  await page.getByRole('combobox', { name: 'Mover Diseñar portada' }).selectOption('done')
  await expect(
    page.getByRole('region', { name: 'Completado' }).getByText('Diseñar portada', { exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Mover Diseñar portada' })).toBeFocused()
})
test('Avanzados Timeline: detalles nativos', async ({ page }) => {
  await open(page, 'Timeline')
  await page.getByText('Ver detalles de revisión de contenido', { exact: true }).click()
  await expect(
    page.getByText('Revisa el contenido largo en móvil y la navegación con teclado.'),
  ).toBeVisible()
})
test('Avanzados Empty State: acción real y volver', async ({ page }) => {
  await open(page, 'Empty State')
  await page.getByRole('button', { name: 'Crear colección' }).click()
  await expect(page.getByRole('status')).toContainText('preparada')
  await page.getByRole('button', { name: 'Volver al estado vacío' }).click()
  await expect(page.getByRole('button', { name: 'Crear colección' })).toBeVisible()
})
test('Avanzados Code Block: cambiar variante y copia', async ({ page }) => {
  await open(page, 'Code Block')
  await page.getByRole('radio', { name: 'HTML', exact: true }).check()
  await expect(page.getByRole('button', { name: 'Copiar HTML' })).toBeVisible()
  await page.getByRole('button', { name: 'Copiar HTML' }).click()
  await expect(page.getByRole('status')).toContainText(/Copiado|No se pudo copiar/)
})
test('Avanzados Image Viewer: navegación, zoom y foco', async ({ page }) => {
  await open(page, 'Image Viewer')
  const trigger = page.getByRole('button', {
    name: 'Ampliar Portada Atlas con una retícula y una letra A',
  })
  await trigger.click()
  await page.getByRole('button', { name: 'Imagen siguiente' }).click()
  await expect(
    page.getByRole('img', {
      name: 'Cuaderno con líneas de texto y una marca de lectura',
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Ampliar imagen', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})
test('Avanzados Inline Edit: error, borrador y reintento', async ({ page }) => {
  await open(page, 'Inline Edit')
  await page.getByRole('button', { name: 'Simular error al guardar' }).click()
  await page.getByRole('button', { name: /Editar nombre/ }).click()
  await page.getByRole('textbox').fill('Cuaderno')
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('se conserva')
  await page.getByRole('button', { name: 'Restablecer guardado' }).click()
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  await expect(page.getByRole('button', { name: /Editar nombre.*Cuaderno/ })).toBeVisible()
})
test('Avanzados Notifications: agrupar, progreso y cierre', async ({ page }) => {
  await open(page, 'Notifications')
  await page.getByRole('button', { name: 'Guardar y agrupar aviso' }).click()
  await page.getByRole('button', { name: 'Guardar y agrupar aviso' }).click()
  await expect(page.getByText('2 actualizaciones agrupadas.')).toBeVisible()
  await page.getByRole('button', { name: 'Iniciar operación de ejemplo' }).click()
  await page.getByRole('button', { name: /Avanzar progreso/ }).click()
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '25')
  await page.getByRole('button', { name: 'Cerrar avisos' }).click()
  await expect(page.getByRole('progressbar')).not.toBeVisible()
})
test('Avanzados Filter Toolbar: filtros combinados y reset', async ({ page }) => {
  await open(page, 'Filter Toolbar')
  await page.getByRole('combobox', { name: 'Estado', exact: true }).selectOption('done')
  await expect(page.getByRole('status')).toContainText('1 resultados')
  await page.getByRole('button', { name: 'Restablecer filtros' }).click()
  await expect(page.getByRole('status')).toContainText('3 resultados')
})

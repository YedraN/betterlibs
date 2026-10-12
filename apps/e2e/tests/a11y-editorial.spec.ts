import { expect, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, waitForStory } from './helpers'

const stories = [
  'componentes-acciones-button--variantes',
  'componentes-acciones-button--estados',
  'componentes-contenido-card--variantes',
  'componentes-formularios-field--estados',
  'componentes-contenido-interactivo-tabs--pastillas',
  'componentes-contenido-interactivo-tabs--acordeon',
  'componentes-overlays-dialog--basico',
  'componentes-navegación-header--playground',
  'componentes-tipografía-heading--bloque-de-texto',
]
const pageRules = [
  'region',
  'landmark-one-main',
  'page-has-heading-one',
  'heading-order',
  'landmark-unique',
]

test.use({ baseURL: STORYBOOK_URL })

for (const theme of ['light', 'dark'] as const) {
  for (const id of stories) {
    test(`editorial ${theme}: ${id}`, async ({ page }) => {
      await page.goto(
        `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};preset:editorial;a11y.manual:!true`,
      )
      await waitForStory(page)
      await expect(page.locator('html')).toHaveAttribute('data-preset', 'editorial')
      if (id === 'componentes-overlays-dialog--basico') {
        await page.getByRole('button', { name: 'Solicitar una demo' }).click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByRole('dialog')).toHaveCSS(
          'background-color',
          theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(34, 34, 34)',
        )
      }
      await expectNoViolations(page, { disableRules: pageRules })
    })
  }
}

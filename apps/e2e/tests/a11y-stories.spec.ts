import { test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { expectNoViolations, readStories, storyUrl, waitForStory } from './helpers'

const stories = readStories()

/**
 * Las stories muestran componentes sueltos, fuera de una página: no tienen `main`, `h1` ni
 * landmarks, y a menudo repiten variantes del mismo componente (varias `nav` con el mismo
 * nombre). Se desactivan las reglas que solo tienen sentido en una página completa; las
 * plantillas del playground sí las cumplen (`a11y-templates.spec.ts`).
 */
const PAGE_RULES = [
  'region',
  'landmark-one-main',
  'page-has-heading-one',
  'heading-order',
  'landmark-unique',
]

test.use({ baseURL: STORYBOOK_URL })

if (stories.length === 0) {
  test('hay build de Storybook', () => {
    throw new Error('No hay build de Storybook: ejecuta `pnpm build` antes de las pruebas')
  })
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`Stories en modo ${theme === 'light' ? 'claro' : 'oscuro'}`, () => {
    for (const story of stories) {
      test(`${story.title} › ${story.name}`, async ({ page }) => {
        await page.goto(storyUrl(story.id, theme))
        await waitForStory(page)
        await expectNoViolations(page, { disableRules: PAGE_RULES })
      })
    }
  })
}

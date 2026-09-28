import { existsSync } from 'node:fs'
import { expect, type Page, type TestInfo, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { ROUTES, readStories, storyUrl, waitForStory } from './helpers'

/**
 * Regresión visual. Las capturas dependen del sistema (fuentes, antialiasing), así que las
 * referencias se generan y comparan solo en Linux, dentro de la imagen oficial de Playwright
 * (workflow «Visual»: ejecútalo con `update` para crear o actualizar las referencias).
 */
test.skip(
  process.platform !== 'linux' && !process.env.VISUAL_ANY_OS,
  'Las referencias visuales se generan en Linux',
)

/** Sin referencia todavía (y sin `--update-snapshots`): se omite en lugar de fallar. */
function skipWithoutBaseline(testInfo: TestInfo, name: string) {
  const missing = !existsSync(testInfo.snapshotPath(name))
  test.skip(missing && testInfo.config.updateSnapshots === 'none', `Sin referencia: ${name}`)
}

async function dismissCookieBanner(page: Page) {
  // Se responde al aviso una vez: la elección queda guardada y no tapa las capturas.
  await page.goto('/')
  await page.getByRole('button', { name: 'Rechazar todas' }).click()
}

test.describe('Plantillas', () => {
  for (const viewport of [
    { name: 'escritorio', width: 1280, height: 800 },
    { name: 'movil', width: 390, height: 844 },
  ]) {
    for (const route of ROUTES) {
      test(`${route.name} (${viewport.name})`, async ({ page }, testInfo) => {
        const name = `${route.name}-${viewport.name}.png`
        skipWithoutBaseline(testInfo, name)
        await page.setViewportSize(viewport)
        await dismissCookieBanner(page)
        await page.goto(route.path)
        await page.locator('main h1').waitFor()
        await page.evaluate(() => document.fonts.ready)
        await expect(page).toHaveScreenshot(name, { fullPage: true })
      })
    }
  }
})

test.describe('Stories', () => {
  test.use({ baseURL: STORYBOOK_URL })

  for (const story of readStories()) {
    test(`${story.title} › ${story.name}`, async ({ page }, testInfo) => {
      const name = `${story.id}.png`
      skipWithoutBaseline(testInfo, name)
      await page.goto(storyUrl(story.id))
      await waitForStory(page)
      // Captura de la ventana (no del contenedor) para incluir diálogos y menús en portales.
      await expect(page).toHaveScreenshot(name)
    })
  }
})

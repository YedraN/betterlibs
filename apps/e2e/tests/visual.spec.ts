import { existsSync } from 'node:fs'
import { expect, type Page, type TestInfo, test } from '@playwright/test'
import { STORYBOOK_URL } from '../urls'
import { ROUTES, readStories, storyUrl, waitForStory } from './helpers'

/**
 * Regresión visual. Las capturas dependen del sistema (fuentes, antialiasing), así que las
 * referencias se generan y comparan solo en Linux, dentro de la imagen oficial de Playwright
 * (workflow «Visual»: ejecútalo con `update` para crear o actualizar las referencias).
 */
/** El cierre visual nunca convierte una referencia ausente en una prueba aprobada. */
function requireBaseline(testInfo: TestInfo, name: string) {
  if (process.platform !== 'linux' && process.env.VISUAL_ANY_OS !== '1') {
    throw new Error(
      'La regresión visual requiere Linux. VISUAL_ANY_OS=1 permite exploración local, no referencias de lanzamiento.',
    )
  }
  if (process.platform !== 'linux' && testInfo.config.updateSnapshots !== 'none') {
    throw new Error(
      'Las referencias de lanzamiento solo pueden generarse en Linux; el override local permite comparación, no actualización.',
    )
  }
  const missing = !existsSync(testInfo.snapshotPath(name))
  if (missing && testInfo.config.updateSnapshots === 'none') {
    throw new Error(
      `Falta la referencia ${name}. Genera y revisa las referencias en Linux antes del cierre.`,
    )
  }
}

async function dismissCookieBanner(page: Page) {
  // Se responde al aviso una vez: la elección queda guardada y no tapa las capturas.
  await page.goto('/plantillas/corporativa')
  await page.getByRole('button', { name: 'Rechazar todas' }).click()
}

test.describe('Plantillas', () => {
  for (const viewport of [
    { name: 'escritorio', width: 1280, height: 800 },
    { name: 'movil', width: 390, height: 844 },
  ]) {
    for (const theme of ['light', 'dark'] as const) {
      for (const route of ROUTES) {
        test(`${route.name} (${viewport.name}, ${theme})`, async ({ page }, testInfo) => {
          const name = `${route.name}-${viewport.name}-${theme}.png`
          requireBaseline(testInfo, name)
          await page.setViewportSize(viewport)
          await dismissCookieBanner(page)
          await page.goto(route.path)
          await page.evaluate((theme) => {
            document.documentElement.dataset.theme = theme
          }, theme)
          const control = page.getByRole('combobox', { name: 'Tema', exact: true })
          if (await control.count()) await control.selectOption(theme)
          await page.locator('main h1').waitFor()
          await page.evaluate(() => document.fonts.ready)
          await expect(page).toHaveScreenshot(name, { fullPage: true })
        })
      }
    }
  }
})

test.describe('Stories', () => {
  test.use({ baseURL: STORYBOOK_URL })

  for (const story of readStories()) {
    for (const theme of ['light', 'dark'] as const) {
      test(`${story.title} › ${story.name} (${theme})`, async ({ page }, testInfo) => {
        const name = `${story.id}-${theme}.png`
        requireBaseline(testInfo, name)
        await page.goto(storyUrl(story.id, theme))
        await waitForStory(page)
        // Captura de la ventana (no del contenedor) para incluir diálogos y menús en portales.
        await expect(page).toHaveScreenshot(name)
      })
    }
  }
})

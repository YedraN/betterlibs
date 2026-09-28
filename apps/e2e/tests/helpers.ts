import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/** Reglas de WCAG 2.0, 2.1 y 2.2 (niveles A y AA) más las buenas prácticas de axe. */
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

/** Rutas de las plantillas del playground. */
export const ROUTES = [
  { name: 'portada', path: '/' },
  { name: 'servicios', path: '/servicios' },
  { name: 'sobre-nosotros', path: '/sobre-nosotros' },
  { name: 'contacto', path: '/contacto' },
  { name: 'blog', path: '/blog' },
  { name: 'articulo', path: '/blog/iva-autonomos-2026' },
  { name: 'aviso-legal', path: '/aviso-legal' },
  { name: 'no-encontrada', path: '/no-existe' },
] as const

export interface StoryEntry {
  id: string
  title: string
  name: string
}

/**
 * Stories del build estático de Storybook (`index.json`). Se leen del disco al cargar el archivo
 * de pruebas para generar un test por story; si no hay build, devuelve una lista vacía.
 */
export function readStories(): StoryEntry[] {
  try {
    const url = new URL('../../storybook/storybook-static/index.json', import.meta.url)
    const index = JSON.parse(readFileSync(url, 'utf8')) as {
      entries: Record<string, StoryEntry & { type: string }>
    }
    return Object.values(index.entries)
      .filter((entry) => entry.type === 'story')
      .map(({ id, title, name }) => ({ id, title, name }))
  } catch {
    return []
  }
}

/** URL del iframe de una story con un tema concreto. */
export function storyUrl(id: string, theme: 'light' | 'dark' = 'light') {
  // `a11y.manual`: el addon de accesibilidad no lanza su propio axe (chocaría con el nuestro).
  return `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`
}

/** Espera a que la story se haya pintado y las fuentes estén cargadas. */
export async function waitForStory(page: Page) {
  await page.locator('#storybook-root > *').first().waitFor({ state: 'attached' })
  await page.evaluate(() => document.fonts.ready)
}

/** Pasa axe y falla con un resumen legible de cada infracción. */
export async function expectNoViolations(page: Page, options: { disableRules?: string[] } = {}) {
  const analyze = () =>
    new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .disableRules(options.disableRules ?? [])
      .analyze()
  // Si otra instancia de axe (la del addon de Storybook) sigue analizando, se espera y se repite.
  let results: Awaited<ReturnType<typeof analyze>> | undefined
  for (let attempt = 0; !results; attempt++) {
    try {
      results = await analyze()
    } catch (error) {
      if (attempt >= 4 || !String(error).includes('Axe is already running')) throw error
      await page.waitForTimeout(500)
    }
  }
  const summary = results.violations.map((violation) => ({
    regla: violation.id,
    impacto: violation.impact,
    ayuda: violation.help,
    nodos: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
  }))
  expect(summary, 'Infracciones de accesibilidad').toEqual([])
}

import { defineConfig, devices } from '@playwright/test'
import { PLAYGROUND_URL, STORYBOOK_URL } from './urls'

const ci = Boolean(process.env.CI)

/**
 * Pruebas de extremo a extremo sobre los builds de producción:
 * - `a11y`: axe (WCAG 2.2 AA) en todas las plantillas y en todas las stories, en claro y oscuro.
 * - `keyboard`: recorridos con teclado de los patrones críticos (menús, diálogos, formularios).
 * - `visual`: capturas de las plantillas y las stories. Las referencias se generan en Linux
 *   (workflow «Visual»), así que fuera de Linux estas pruebas se omiten.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}{ext}',
  // Sin `--update-snapshots` solo se compara; las capturas sin referencia se omiten.
  updateSnapshots: 'none',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: PLAYGROUND_URL,
    locale: 'es-ES',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide' },
  },
  projects: [
    { name: 'a11y', testMatch: /a11y.*\.spec\.ts/ },
    { name: 'keyboard', testMatch: /keyboard\.spec\.ts/ },
    { name: 'visual', testMatch: /visual\.spec\.ts/ },
  ],
  webServer: [
    {
      command: 'node serve.ts ../playground/dist 4173',
      url: PLAYGROUND_URL,
      reuseExistingServer: !ci,
    },
    {
      command: 'node serve.ts ../storybook/storybook-static 6007',
      url: STORYBOOK_URL,
      reuseExistingServer: !ci,
    },
  ],
})

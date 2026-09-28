// Lighthouse CI sobre el build de producción de las plantillas (playground).
// Umbral: ≥ 95 en rendimiento, accesibilidad, buenas prácticas y SEO en cada plantilla.
const { chromium } = require('@playwright/test')

const base = 'http://localhost:4173'
const paths = [
  '/',
  '/servicios',
  '/sobre-nosotros',
  '/contacto',
  '/blog',
  '/blog/iva-autonomos-2026',
  '/aviso-legal',
]

module.exports = {
  ci: {
    collect: {
      // Servidor con compresión y URLs limpias, como el hosting de producción.
      startServerCommand: 'node serve.ts ../playground/dist 4173',
      startServerReadyPattern: 'Sirviendo',
      url: paths.map((path) => base + path),
      numberOfRuns: 3,
      chromePath: process.env.CHROME_PATH || chromium.executablePath(),
      settings: { chromeFlags: '--headless=new --no-sandbox', locale: 'es' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}

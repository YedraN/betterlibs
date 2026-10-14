// Lighthouse CI sobre el build de producción de las plantillas (playground).
// Umbral: ≥ 95 en rendimiento, accesibilidad, buenas prácticas y SEO en cada plantilla.
const { chromium } = require('@playwright/test')

const port = process.env.BETTERLIBS_LIGHTHOUSE_PORT || '4181'
const base = `http://localhost:${port}`
const paths = process.env.BETTERLIBS_LIGHTHOUSE_ROUTES
  ? process.env.BETTERLIBS_LIGHTHOUSE_ROUTES.split(',')
  : [
      '/',
      '/plantillas/producto',
      '/plantillas/estudio',
      '/plantillas/articulo',
      '/plantillas/corporativa',
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
      startServerCommand: `node serve.ts ../playground/dist ${port}`,
      startServerReadyPattern: 'Sirviendo',
      url: paths.map((path) => base + path),
      numberOfRuns: 3,
      chromePath: process.env.CHROME_PATH || chromium.executablePath(),
      settings: {
        chromeFlags: '--headless=new --no-sandbox',
        locale: 'es',
        ...(process.env.BETTERLIBS_LIGHTHOUSE_DEBUG_PORT
          ? { port: Number(process.env.BETTERLIBS_LIGHTHOUSE_DEBUG_PORT) }
          : {}),
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:best-practices': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:seo': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
}

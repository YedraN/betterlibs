/**
 * Prerenderiza cada plantilla a HTML estático (SSG) después de `vite build`: la página se ve
 * y se indexa sin esperar al JavaScript, y el cliente la hidrata. También genera `404.html`.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'

const dist = new URL('../dist/', import.meta.url)
const serverDir = new URL('../dist-server/', import.meta.url)
const { render, routes } = (await import(new URL('entry-server.js', serverDir).href)) as {
  render: (pathname: string) => { html: string; title: string }
  routes: string[]
}

const fonts = (await readdir(new URL('assets/', dist))).filter((name) =>
  /^(inter|space-grotesk)-latin-wght-normal-.*\.woff2$/.test(name),
)
if (fonts.length !== 2) throw new Error('Faltan las dos fuentes críticas del playground')
const template = await readFile(new URL('index.html', dist), 'utf8')
const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const pages = [
  ...routes.map((route) => ({
    route,
    file: route === '/' ? 'index.html' : `${route.slice(1)}/index.html`,
  })),
  { route: '/404', file: '404.html' },
]

for (const { route, file } of pages) {
  const { html, title } = render(route)
  const editorial =
    route === '/' || (route.startsWith('/plantillas/') && route !== '/plantillas/corporativa')
  // Default pages only use Inter. Editorial pages also need Space Grotesk at first paint.
  const preloads = fonts
    .filter((name) => editorial || name.startsWith('inter-'))
    .map(
      (name) =>
        `<link rel="preload" href="/assets/${name}" as="font" type="font/woff2" crossorigin>`,
    )
    .join('\n')
  const page = template
    .replace('</head>', `${preloads}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  const target = new URL(file, dist)
  await mkdir(new URL('.', target), { recursive: true })
  await writeFile(target, page)
}

await rm(serverDir, { recursive: true, force: true })
console.log(`Prerenderizadas ${pages.length} páginas en dist/`)

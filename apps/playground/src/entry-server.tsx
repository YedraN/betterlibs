import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { articles } from './site/data'
import { setServerPathname } from './site/router'
import { consumePageTitle } from './site/SiteLayout'

/** Rutas que se generan como HTML estático en el build. */
export const routes = [
  '/',
  '/plantillas/corporativa',
  '/plantillas/producto',
  '/plantillas/estudio',
  '/plantillas/articulo',
  '/servicios',
  '/sobre-nosotros',
  '/contacto',
  '/blog',
  ...articles.map((article) => `/blog/${article.slug}`),
  '/aviso-legal',
]

/** Renderiza una ruta a HTML (el cliente la hidrata después). */
export function render(pathname: string) {
  setServerPathname(pathname)
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  return { html, title: consumePageTitle() }
}

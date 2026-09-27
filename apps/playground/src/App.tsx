import { useEffect, useRef } from 'react'
import { usePathname } from './site/router'
import { SiteLayout } from './site/SiteLayout'
import { AboutPage } from './templates/About'
import { ArticlePage } from './templates/Article'
import { BlogPage } from './templates/Blog'
import { ContactPage } from './templates/Contact'
import { HomePage } from './templates/Home'
import { LegalPage } from './templates/Legal'
import { NotFoundPage } from './templates/NotFound'
import { ServicesPage } from './templates/Services'

function route(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return <HomePage />
  if (path === '/servicios') return <ServicesPage />
  if (path === '/sobre-nosotros') return <AboutPage />
  if (path === '/contacto') return <ContactPage />
  if (path === '/blog') return <BlogPage />
  if (path.startsWith('/blog/')) return <ArticlePage slug={path.slice('/blog/'.length)} />
  if (path === '/aviso-legal') return <LegalPage />
  return <NotFoundPage />
}

/**
 * Al cambiar de página sin recargar: vuelve arriba (o al ancla) y lleva el foco al `h1`, para que
 * los lectores de pantalla anuncien la página nueva y el teclado empiece desde el principio.
 */
function useRouteFocus(pathname: string) {
  const first = useRef(true)
  // biome-ignore lint/correctness/useExhaustiveDependencies: se ejecuta en cada cambio de ruta
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const hash = window.location.hash.slice(1)
    const target = hash ? document.getElementById(decodeURIComponent(hash)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    const heading = document.querySelector<HTMLElement>('main h1')
    if (heading) {
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
    }
  }, [pathname])
}

export function App() {
  const pathname = usePathname()
  useRouteFocus(pathname)
  return <SiteLayout pathname={pathname}>{route(pathname)}</SiteLayout>
}

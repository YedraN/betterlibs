import { useLocation, useRouteNavigation } from './site/router'
import { SiteLayout } from './site/SiteLayout'
import { AboutPage } from './templates/About'
import { ArticlePage } from './templates/Article'
import { BlogPage } from './templates/Blog'
import { ContactPage } from './templates/Contact'
import { CorporateHomePage } from './templates/CorporateHome'
import { EditorialArticle } from './templates/editorial/EditorialArticle'
import { EditorialTemplate } from './templates/editorial/EditorialTemplate'
import { ProductPage } from './templates/editorial/ProductPage'
import { StudioPage } from './templates/editorial/StudioPage'
import { HomePage } from './templates/Home'
import { LegalPage } from './templates/Legal'
import { NotFoundPage } from './templates/NotFound'
import { ServicesPage } from './templates/Services'

function route(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return <HomePage />
  if (path === '/plantillas/corporativa') return <CorporateHomePage />
  if (path === '/servicios') return <ServicesPage />
  if (path === '/sobre-nosotros') return <AboutPage />
  if (path === '/contacto') return <ContactPage />
  if (path === '/blog') return <BlogPage />
  if (path.startsWith('/blog/')) return <ArticlePage slug={path.slice('/blog/'.length)} />
  if (path === '/aviso-legal') return <LegalPage />
  return <NotFoundPage />
}

export function App() {
  const location = useLocation()
  const pathname = location.split(/[?#]/)[0] ?? '/'
  useRouteNavigation(location)
  if (pathname === '/') return <HomePage />
  if (pathname === '/plantillas/producto')
    return (
      <EditorialTemplate pathname={pathname}>
        <ProductPage />
      </EditorialTemplate>
    )
  if (pathname === '/plantillas/estudio')
    return (
      <EditorialTemplate pathname={pathname}>
        <StudioPage />
      </EditorialTemplate>
    )
  if (pathname === '/plantillas/articulo')
    return (
      <EditorialTemplate pathname={pathname}>
        <EditorialArticle />
      </EditorialTemplate>
    )
  return <SiteLayout pathname={pathname}>{route(pathname)}</SiteLayout>
}

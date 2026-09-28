import { CalendarIcon } from '@betterlibs/icons'
import {
  AnnouncementBar,
  Button,
  CookieConsent,
  cookieConsent,
  Footer,
  Header,
  SkipLink,
  Stack,
  Text,
  Toaster,
} from '@betterlibs/react'
import { type ReactNode, useEffect } from 'react'
import { company, footerColumns, legalLinks, navigation, social } from './data'
import { RouterLink } from './router'

const logo = (
  <RouterLink href="/" aria-label={`${company.name}, ir a la portada`}>
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--bl-color-accent)" />
      <path d="M9 23V9l14 14V9" stroke="var(--bl-color-on-accent)" strokeWidth="3" fill="none" />
    </svg>
    <span>{company.name}</span>
  </RouterLink>
)

let serverTitle = ''

/** Título de la última página prerenderizada (lo lee `entry-server.tsx`). */
export function consumePageTitle() {
  const title = serverTitle
  serverTitle = ''
  return title
}

/** Pone el título de la pestaña: «Página · Empresa». */
export function usePageTitle(title: string) {
  if (typeof window === 'undefined') serverTitle = `${title} · ${company.name}`
  useEffect(() => {
    document.title = `${title} · ${company.name}`
  }, [title])
}

export function SiteLayout({ pathname, children }: { pathname: string; children: ReactNode }) {
  return (
    <>
      {/* El enlace de salto va antes que el aviso de cookies: debe ser lo primero enfocable. */}
      <SkipLink />
      <CookieConsent policyHref="/aviso-legal#cookies" version="2026-09" />
      <AnnouncementBar
        dismissible
        storageKey="norte-aviso-jornada-2026"
        icon={<CalendarIcon />}
        action={<RouterLink href="/contacto">Reserva tu plaza</RouterLink>}
      >
        Jornada «Cierre fiscal 2026»: 12 de noviembre en Madrid.
      </AnnouncementBar>
      <Header
        logo={logo}
        navigation={navigation}
        currentHref={pathname}
        linkAs={RouterLink}
        hideOnScroll
        skipLink={false}
        actions={
          <Button asChild size="sm">
            <RouterLink href="/contacto">Solicitar propuesta</RouterLink>
          </Button>
        }
      />
      <main id="main">{children}</main>
      <Footer
        logo={logo}
        description="Consultoría financiera para empresas que quieren crecer con orden desde 2006."
        social={social}
        columns={footerColumns}
        legal={legalLinks}
        linkAs={RouterLink}
        copyright={`© 2026 ${company.legalName}`}
      >
        <Stack gap="2">
          <Text size="sm" weight="semibold">
            ¿Hablamos?
          </Text>
          <Text size="sm" tone="muted">
            <a href={company.phoneHref}>{company.phone}</a> ·{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </Text>
          <div>
            <Button size="sm" variant="outline" onClick={cookieConsent.open}>
              Configurar cookies
            </Button>
          </div>
        </Stack>
      </Footer>
      <Toaster />
    </>
  )
}

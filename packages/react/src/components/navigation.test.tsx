import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { AnnouncementBar } from './AnnouncementBar/AnnouncementBar'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import { MobileNav } from './NavigationMenu/MobileNav'
import { NavigationMenu } from './NavigationMenu/NavigationMenu'
import { isCurrentLink, type NavItem } from './NavigationMenu/types'
import { SocialLinks } from './SocialLinks/SocialLinks'

const items: NavItem[] = [
  {
    label: 'Servicios',
    groups: [
      {
        label: 'Empresas',
        links: [
          { label: 'Consultoría', href: '/servicios/consultoria', description: 'Plan a 3 años.' },
          { label: 'Auditoría', href: '/servicios/auditoria' },
        ],
      },
    ],
    overview: { label: 'Ver todos los servicios', href: '/servicios' },
  },
  { label: 'Blog', href: '/blog' },
]

const logo = <a href="/">Norte Consultores</a>

describe('NavigationMenu', () => {
  it('abre la sección y marca la página actual', async () => {
    render(<NavigationMenu items={items} currentHref="/servicios/auditoria/" />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    const trigger = within(nav).getByRole('button', { name: 'Servicios' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.hasAttribute('data-current')).toBe(true)
    await userEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('link', { name: 'Auditoría' }).getAttribute('aria-current')).toBe(
      'page',
    )
    expect(screen.getByRole('link', { name: /Consultoría/ }).textContent).toContain(
      'Plan a 3 años.',
    )
    expect(screen.getByRole('list', { name: 'Empresas' })).toBeTruthy()
  })

  it('compara URLs sin barra final, query ni ancla', () => {
    expect(isCurrentLink({ label: 'Blog', href: '/blog/' }, '/blog?pagina=2')).toBe(true)
    expect(isCurrentLink({ label: 'Inicio', href: '/' }, '/blog')).toBe(false)
    expect(isCurrentLink({ label: 'Blog', href: '/blog', current: false }, '/blog')).toBe(false)
  })
})

describe('MobileNav', () => {
  it('abre de inicio la sección actual y alterna las demás', async () => {
    const onNavigate = vi.fn()
    render(<MobileNav items={items} currentHref="/servicios/auditoria" onNavigate={onNavigate} />)
    const toggle = screen.getByRole('button', { name: 'Servicios' })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    const current = screen.getByRole('link', { name: 'Auditoría' })
    expect(current.getAttribute('aria-current')).toBe('page')
    await userEvent.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('link', { name: 'Auditoría' })).toBeNull()
    await userEvent.click(screen.getByRole('link', { name: 'Blog' }))
    expect(onNavigate).toHaveBeenCalledOnce()
  })
})

describe('Header', () => {
  it('incluye salto al contenido, marca y navegación', () => {
    render(<Header logo={logo} navigation={items} />)
    const skip = screen.getByRole('link', { name: 'Saltar al contenido principal' })
    expect(skip.getAttribute('href')).toBe('#main')
    const banner = screen.getByRole('banner')
    expect(skip.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(banner).getByRole('link', { name: 'Norte Consultores' })).toBeTruthy()
    expect(within(banner).getByRole('navigation', { name: 'Principal' })).toBeTruthy()
  })

  it('el menú móvil se abre en un panel y se cierra al navegar', async () => {
    render(<Header logo={logo} navigation={items} actions={<a href="/contacto">Contacto</a>} />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menú' }))
    const dialog = screen.getByRole('dialog', { name: 'Menú' })
    expect(within(dialog).getByRole('link', { name: 'Contacto' })).toBeTruthy()
    await userEvent.click(within(dialog).getByRole('link', { name: 'Blog' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('permite quitar el enlace de salto', () => {
    render(<Header logo={logo} skipLink={false} />)
    expect(screen.queryByRole('link', { name: /Saltar/ })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Abrir menú' })).toBeNull()
  })
})

describe('Footer y SocialLinks', () => {
  it('organiza columnas, redes y enlaces legales', () => {
    render(
      <Footer
        logo={logo}
        description="Consultoría financiera."
        social={[{ network: 'linkedin', href: 'https://linkedin.com' }]}
        columns={[{ title: 'Empresa', links: [{ label: 'Equipo', href: '/equipo' }] }]}
        legal={[{ label: 'Privacidad', href: '/privacidad' }]}
        copyright="© 2026 Norte"
      />,
    )
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('heading', { level: 2, name: 'Empresa' })).toBeTruthy()
    expect(within(footer).getByRole('navigation', { name: 'Pie de página' })).toBeTruthy()
    expect(within(footer).getByRole('navigation', { name: 'Información legal' })).toBeTruthy()
    expect(within(footer).getByRole('link', { name: 'LinkedIn' })).toBeTruthy()
    expect(within(footer).getByText('© 2026 Norte')).toBeTruthy()
  })

  it('SocialLinks anuncia que se abre en otra pestaña', () => {
    render(<SocialLinks links={[{ network: 'youtube', href: 'https://youtube.com' }]} newTab />)
    const link = screen.getByRole('link', { name: 'YouTube (se abre en una pestaña nueva)' })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })
})

describe('AnnouncementBar', () => {
  it('es una región con nombre que se puede cerrar y recordar', async () => {
    const { unmount } = render(
      <AnnouncementBar dismissible storageKey="aviso-test">
        Nuevo informe 2026.
      </AnnouncementBar>,
    )
    expect(screen.getByRole('region', { name: 'Anuncio' })).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar anuncio' }))
    expect(screen.queryByRole('region', { name: 'Anuncio' })).toBeNull()
    unmount()
    render(
      <AnnouncementBar dismissible storageKey="aviso-test">
        Nuevo informe 2026.
      </AnnouncementBar>,
    )
    expect(screen.queryByRole('region', { name: 'Anuncio' })).toBeNull()
    window.localStorage.removeItem('aviso-test')
  })
})

describe('Accesibilidad', () => {
  it('cabecera, anuncio y pie pasan axe', async () => {
    const { container } = render(
      <>
        <AnnouncementBar dismissible action={<a href="/informe">Descárgalo</a>}>
          Nuevo informe.
        </AnnouncementBar>
        <Header
          logo={logo}
          navigation={items}
          currentHref="/blog"
          actions={<a href="/contacto">Contacto</a>}
        />
        <main id="main">Contenido</main>
        <Footer
          logo={logo}
          social={[{ network: 'x', href: 'https://x.com' }]}
          columns={[{ title: 'Empresa', links: [{ label: 'Equipo', href: '/equipo' }] }]}
          legal={[{ label: 'Cookies', href: '/cookies' }]}
          copyright="© 2026 Norte"
        />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})

import type { ReactNode } from 'react'

/** Enlace de navegación. */
export type NavLink = {
  label: ReactNode
  href: string
  /** Texto breve bajo el enlace en los desplegables («Asesoría para pymes y autónomos»). */
  description?: ReactNode
  /** Icono decorativo en los desplegables. */
  icon?: ReactNode
  /** Marca la página actual (`aria-current="page"`). Alternativa a `currentHref`. */
  current?: boolean
}

/** Columna con título de un mega menú. */
export type NavGroup = {
  label: ReactNode
  links: NavLink[]
}

/** Sección con desplegable: una lista simple (`links`) o un mega menú (`groups`). */
export type NavSection = {
  label: ReactNode
  /** Desplegable simple. */
  links?: NavLink[]
  /** Mega menú: columnas con título. */
  groups?: NavGroup[]
  /** Bloque destacado a un lado del mega menú (un caso de éxito, un evento…). */
  featured?: ReactNode
  /** Enlace a la página general de la sección («Ver todos los servicios»). */
  overview?: NavLink
  current?: boolean
}

export type NavItem = NavLink | NavSection

export function isSection(item: NavItem): item is NavSection {
  return !('href' in item)
}

const normalize = (href: string) => href.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/'

/** ¿Es este enlace la página actual? */
export function isCurrentLink(link: NavLink, currentHref?: string): boolean {
  if (link.current !== undefined) return link.current
  return currentHref !== undefined && normalize(link.href) === normalize(currentHref)
}

/** Enlaces de una sección (incluido el de «ver todo»). */
export function sectionLinks(section: NavSection): NavLink[] {
  return [
    ...(section.overview ? [section.overview] : []),
    ...(section.links ?? []),
    ...(section.groups?.flatMap((group) => group.links) ?? []),
  ]
}

/** ¿La página actual está dentro de esta sección? */
export function isCurrentSection(section: NavSection, currentHref?: string): boolean {
  if (section.current !== undefined) return section.current
  return sectionLinks(section).some((link) => isCurrentLink(link, currentHref))
}

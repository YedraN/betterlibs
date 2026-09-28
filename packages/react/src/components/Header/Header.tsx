'use client'

import { MenuIcon } from '@betterlibs/icons'
import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/merge-refs'
import { Container, type ContainerOwnProps } from '../Container/Container'
import { Drawer, DrawerContent, DrawerTrigger } from '../Drawer/Drawer'
import { IconButton } from '../IconButton/IconButton'
import { MobileNav } from '../NavigationMenu/MobileNav'
import { NavigationMenu } from '../NavigationMenu/NavigationMenu'
import type { NavItem } from '../NavigationMenu/types'
import { SkipLink } from '../SkipLink/SkipLink'
import styles from './Header.module.css'

export type HeaderProps = Omit<ComponentPropsWithRef<'header'>, 'children'> & {
  /**
   * Logo enlazado a la portada. El texto alternativo debe nombrar la empresa:
   * `<a href="/"><img src="/logo.svg" alt="Empresa, ir a la portada" /></a>`.
   */
  logo: ReactNode
  /** Menú principal: enlaces, desplegables y mega menús. */
  navigation?: NavItem[]
  /** Llamadas a la acción a la derecha («Contacto», «Área de clientes»). */
  actions?: ReactNode
  /** Acciones al pie del menú móvil. Por defecto, las mismas que `actions`. */
  mobileActions?: ReactNode
  /** URL de la página actual, para marcarla en el menú. */
  currentHref?: string
  /** Componente de enlace de tu router (p. ej. `Link` de Next.js). @default 'a' */
  linkAs?: ElementType
  /** Se queda fija arriba al hacer scroll. @default true */
  sticky?: boolean
  /** Se oculta al bajar y reaparece al subir (solo con `sticky`). @default false */
  hideOnScroll?: boolean
  /** Por debajo de este ancho se muestra el botón de menú móvil. @default 'lg' */
  collapseBelow?: 'md' | 'lg' | 'xl'
  /** Ancho del contenido. @default 'xl' */
  containerSize?: ContainerOwnProps['size']
  /**
   * Destino del enlace «Saltar al contenido principal» (primer elemento enfocable).
   * `false` si ya pones tu propio `SkipLink`. @default '#main'
   */
  skipLink?: string | false
  /** @default 'Saltar al contenido principal' */
  skipLinkLabel?: string
  /** Nombre del menú principal. @default 'Principal' */
  navigationLabel?: string
  /** Título del panel del menú móvil. @default 'Menú' */
  menuLabel?: string
  /** Nombre del botón que abre el menú móvil. @default 'Abrir menú' */
  openMenuLabel?: string
}

/** Lleva el foco al `h1` del contenido principal (o al propio contenedor si no tiene). */
function focusMainHeading(target: string) {
  const main = target.startsWith('#') ? document.getElementById(target.slice(1)) : null
  const heading = main?.querySelector<HTMLElement>('h1') ?? main
  if (!heading) return
  if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1
  heading.focus()
}

/**
 * Cabecera del sitio: logo, navegación principal con desplegables o mega menús, acciones y menú
 * móvil en un panel lateral. Incluye el enlace para saltar al contenido.
 *
 * @example
 * <Header
 *   logo={<a href="/"><img src="/logo.svg" alt="Empresa, ir a la portada" /></a>}
 *   navigation={[
 *     { label: 'Servicios', links: [{ label: 'Consultoría', href: '/servicios/consultoria' }] },
 *     { label: 'Sobre nosotros', href: '/sobre-nosotros' },
 *   ]}
 *   actions={<Button asChild><a href="/contacto">Contacto</a></Button>}
 *   currentHref="/sobre-nosotros"
 * />
 */
export function Header({
  logo,
  navigation,
  actions,
  mobileActions,
  currentHref,
  linkAs,
  sticky = true,
  hideOnScroll = false,
  collapseBelow = 'lg',
  containerSize = 'xl',
  skipLink = '#main',
  skipLinkLabel = 'Saltar al contenido principal',
  navigationLabel = 'Principal',
  menuLabel = 'Menú',
  openMenuLabel = 'Abrir menú',
  className,
  ref,
  onFocus,
  ...props
}: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigatedRef = useRef(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!sticky) return
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      const y = window.scrollY
      setScrolled(y > 0)
      if (hideOnScroll) {
        const header = headerRef.current
        const threshold = header?.offsetHeight ?? 64
        const busy = menuOpen || Boolean(header?.contains(document.activeElement))
        if (y > lastY && y > threshold && !busy) setHidden(true)
        else if (y < lastY || y <= threshold) setHidden(false)
      }
      lastY = y
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sticky, hideOnScroll, menuOpen])

  const drawerActions = mobileActions ?? actions

  return (
    <>
      {skipLink !== false && <SkipLink href={skipLink}>{skipLinkLabel}</SkipLink>}
      <header
        ref={mergeRefs(headerRef, ref)}
        className={cx(styles.root, className)}
        data-sticky={sticky || undefined}
        data-scrolled={scrolled || undefined}
        data-hidden={(hidden && !menuOpen) || undefined}
        data-collapse={collapseBelow}
        // Si el foco llega a la cabecera oculta (con Tab o Shift+Tab), vuelve a mostrarse.
        onFocus={(event) => {
          setHidden(false)
          onFocus?.(event)
        }}
        {...props}
      >
        <Container size={containerSize} className={styles.bar}>
          <div className={styles.brand}>{logo}</div>
          {navigation && (
            <NavigationMenu
              className={styles.desktopNav}
              items={navigation}
              label={navigationLabel}
              currentHref={currentHref}
              linkAs={linkAs}
            />
          )}
          {actions && <div className={styles.actions}>{actions}</div>}
          {navigation && (
            <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
              <DrawerTrigger asChild>
                <IconButton label={openMenuLabel} className={styles.menuButton}>
                  <MenuIcon />
                </IconButton>
              </DrawerTrigger>
              <DrawerContent
                // Al cerrar tras elegir un enlace, el foco no vuelve al botón del menú (la página
                // ha cambiado): va al título del contenido principal, como al navegar.
                onCloseAutoFocus={(event) => {
                  if (!navigatedRef.current) return
                  navigatedRef.current = false
                  event.preventDefault()
                  requestAnimationFrame(() => focusMainHeading(skipLink || '#main'))
                }}
                title={menuLabel}
                side="right"
                size="sm"
                footer={
                  drawerActions ? (
                    <div className={styles.drawerActions}>{drawerActions}</div>
                  ) : undefined
                }
              >
                <MobileNav
                  items={navigation}
                  label={navigationLabel}
                  currentHref={currentHref}
                  linkAs={linkAs}
                  onNavigate={() => {
                    navigatedRef.current = true
                    setMenuOpen(false)
                  }}
                />
              </DrawerContent>
            </Drawer>
          )}
        </Container>
      </header>
    </>
  )
}

'use client'

import { ArrowRightIcon, ChevronDownIcon } from '@betterlibs/icons'
import * as NavPrimitive from '@radix-ui/react-navigation-menu'
import { type ElementType, useId } from 'react'
import { cx } from '../../utils/cx'
import styles from './NavigationMenu.module.css'
import {
  isCurrentLink,
  isCurrentSection,
  isSection,
  type NavItem,
  type NavLink,
  type NavSection,
} from './types'

export type NavigationMenuProps = Omit<NavPrimitive.NavigationMenuProps, 'children'> & {
  /** Estructura del menú: enlaces directos, desplegables (`links`) o mega menús (`groups`). */
  items: NavItem[]
  /** Nombre de la navegación. @default 'Principal' */
  label?: string
  /** URL de la página actual, para marcar el enlace y su sección con `aria-current`. */
  currentHref?: string
  /** Componente de enlace de tu router (p. ej. `Link` de Next.js). @default 'a' */
  linkAs?: ElementType
}

function MenuLink({
  link,
  currentHref,
  linkAs: LinkComponent,
  variant,
}: {
  link: NavLink
  currentHref?: string
  linkAs: ElementType
  variant: 'panel' | 'overview'
}) {
  return (
    <NavPrimitive.Link asChild active={isCurrentLink(link, currentHref)}>
      <LinkComponent
        href={link.href}
        className={variant === 'overview' ? styles.overview : styles.panelLink}
      >
        {link.icon && variant === 'panel' && (
          <span className={styles.linkIcon} aria-hidden="true">
            {link.icon}
          </span>
        )}
        <span className={styles.linkText}>
          <span className={styles.linkLabel}>{link.label}</span>
          {link.description && variant === 'panel' && (
            <span className={styles.linkDescription}>{link.description}</span>
          )}
        </span>
        {variant === 'overview' && <ArrowRightIcon aria-hidden="true" />}
      </LinkComponent>
    </NavPrimitive.Link>
  )
}

function SectionPanel({
  section,
  currentHref,
  linkAs,
}: {
  section: NavSection
  currentHref?: string
  linkAs: ElementType
}) {
  const id = useId()
  const link = (item: NavLink, index: number) => (
    <li key={index}>
      <MenuLink link={item} currentHref={currentHref} linkAs={linkAs} variant="panel" />
    </li>
  )
  return (
    <>
      {section.groups ? (
        <div className={styles.mega}>
          <div className={styles.groups}>
            {section.groups.map((group, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
              <div key={index} className={styles.group}>
                <p id={`${id}-${index}`} className={styles.groupTitle}>
                  {group.label}
                </p>
                <ul className={styles.links} aria-labelledby={`${id}-${index}`}>
                  {group.links.map(link)}
                </ul>
              </div>
            ))}
          </div>
          {section.featured && <div className={styles.featured}>{section.featured}</div>}
        </div>
      ) : (
        <ul className={styles.links}>{section.links?.map(link)}</ul>
      )}
      {section.overview && (
        <div className={styles.overviewRow}>
          <MenuLink
            link={section.overview}
            currentHref={currentHref}
            linkAs={linkAs}
            variant="overview"
          />
        </div>
      )}
    </>
  )
}

/**
 * Navegación principal de escritorio con desplegables y mega menús (Radix NavigationMenu).
 * Se abre al pasar el ratón o con Enter/Espacio; Tab entra en el panel, Escape lo cierra y
 * las flechas se mueven entre secciones. En `Header` se combina con el menú móvil.
 *
 * Los mega menús ocupan el ancho del contenedor posicionado más cercano (en `Header`, la barra).
 */
export function NavigationMenu({
  items,
  label = 'Principal',
  currentHref,
  linkAs: LinkComponent = 'a',
  className,
  delayDuration = 150,
  ...props
}: NavigationMenuProps) {
  return (
    <NavPrimitive.Root
      className={cx(styles.root, className)}
      aria-label={label}
      delayDuration={delayDuration}
      {...props}
    >
      <NavPrimitive.List className={styles.list}>
        {items.map((item, index) =>
          isSection(item) ? (
            <NavPrimitive.Item
              // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
              key={index}
              className={styles.item}
              data-mega={item.groups ? '' : undefined}
            >
              <NavPrimitive.Trigger
                className={styles.trigger}
                data-current={isCurrentSection(item, currentHref) || undefined}
              >
                {item.label}
                <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
              </NavPrimitive.Trigger>
              <NavPrimitive.Content
                className={styles.content}
                data-mega={item.groups ? '' : undefined}
              >
                <SectionPanel section={item} currentHref={currentHref} linkAs={LinkComponent} />
              </NavPrimitive.Content>
            </NavPrimitive.Item>
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
            <NavPrimitive.Item key={index} className={styles.item}>
              <NavPrimitive.Link asChild active={isCurrentLink(item, currentHref)}>
                <LinkComponent href={item.href} className={styles.trigger}>
                  {item.label}
                </LinkComponent>
              </NavPrimitive.Link>
            </NavPrimitive.Item>
          ),
        )}
      </NavPrimitive.List>
    </NavPrimitive.Root>
  )
}

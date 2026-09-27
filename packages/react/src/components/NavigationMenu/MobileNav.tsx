'use client'

import { ChevronDownIcon } from '@betterlibs/icons'
import { type ComponentPropsWithRef, type ElementType, useId, useState } from 'react'
import { cx } from '../../utils/cx'
import styles from './MobileNav.module.css'
import {
  isCurrentLink,
  isCurrentSection,
  isSection,
  type NavItem,
  type NavLink,
  type NavSection,
} from './types'

export type MobileNavProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  /** La misma estructura que `NavigationMenu`. */
  items: NavItem[]
  /** Nombre de la navegación. @default 'Principal' */
  label?: string
  currentHref?: string
  /** Componente de enlace de tu router. @default 'a' */
  linkAs?: ElementType
  /** Se llama al pulsar un enlace (p. ej. para cerrar el panel del menú). */
  onNavigate?: () => void
}

type LinkProps = {
  link: NavLink
  currentHref?: string
  linkAs: ElementType
  onNavigate?: () => void
  nested?: boolean
}

function MobileLink({ link, currentHref, linkAs: LinkComponent, onNavigate, nested }: LinkProps) {
  const current = isCurrentLink(link, currentHref)
  return (
    <li>
      <LinkComponent
        href={link.href}
        className={styles.link}
        data-nested={nested || undefined}
        aria-current={current ? 'page' : undefined}
        onClick={onNavigate}
      >
        {link.label}
      </LinkComponent>
    </li>
  )
}

function MobileSection({
  section,
  ...linkProps
}: Omit<LinkProps, 'link' | 'nested'> & { section: NavSection }) {
  const id = useId()
  const current = isCurrentSection(section, linkProps.currentHref)
  // La sección de la página actual empieza abierta: se ve dónde se está.
  const [open, setOpen] = useState(current)
  return (
    <li>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={id}
        data-current={current || undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {section.label}
        <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
      </button>
      <div id={id} className={styles.panel} hidden={!open}>
        <ul className={styles.sublist}>
          {section.overview && <MobileLink link={section.overview} nested {...linkProps} />}
          {section.links?.map((link, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
            <MobileLink key={index} link={link} nested {...linkProps} />
          ))}
        </ul>
        {section.groups?.map((group, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
          <div key={index} className={styles.group}>
            <p id={`${id}-${index}`} className={styles.groupTitle}>
              {group.label}
            </p>
            <ul className={styles.sublist} aria-labelledby={`${id}-${index}`}>
              {group.links.map((link, linkIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
                <MobileLink key={linkIndex} link={link} nested {...linkProps} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </li>
  )
}

/**
 * Navegación para móvil: lista vertical con secciones desplegables (botones con
 * `aria-expanded`). `Header` la muestra dentro de un `Drawer`; úsala suelta si montas tu propia
 * cabecera.
 */
export function MobileNav({
  items,
  label = 'Principal',
  currentHref,
  linkAs = 'a',
  onNavigate,
  className,
  ...props
}: MobileNavProps) {
  const linkProps = { currentHref, linkAs, onNavigate }
  return (
    <nav className={cx(styles.root, className)} aria-label={label} {...props}>
      <ul className={styles.list}>
        {items.map((item, index) =>
          isSection(item) ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
            <MobileSection key={index} section={item} {...linkProps} />
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: el menú es estático
            <MobileLink key={index} link={item} {...linkProps} />
          ),
        )}
      </ul>
    </nav>
  )
}

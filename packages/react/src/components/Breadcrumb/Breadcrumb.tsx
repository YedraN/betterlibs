import { ChevronRightIcon } from '@betterlibs/icons'
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Breadcrumb.module.css'

export type BreadcrumbItem = {
  label: ReactNode
  /** Sin `href` (o en el último elemento) se muestra como texto. */
  href?: string
}

export type BreadcrumbProps = ComponentPropsWithRef<'nav'> & {
  /** Ruta desde la portada hasta la página actual (el último elemento). */
  items: BreadcrumbItem[]
  /** Nombre de la navegación. @default 'Ruta de navegación' */
  label?: string
  /** Separador decorativo. @default <ChevronRightIcon /> */
  separator?: ReactNode
  /** Componente de enlace de tu router (p. ej. `Link` de Next.js). @default 'a' */
  linkAs?: ElementType
  /**
   * URL base del sitio (`https://empresa.com`). Si la indicas, se añaden los datos estructurados
   * `BreadcrumbList` de schema.org para que Google muestre la ruta en los resultados.
   */
  schemaBaseUrl?: string
}

function textOf(node: ReactNode): string | undefined {
  return typeof node === 'string' || typeof node === 'number' ? String(node) : undefined
}

/**
 * Migas de pan: muestran dónde está la página dentro del sitio y permiten subir de nivel.
 * La página actual lleva `aria-current="page"` y no es un enlace.
 *
 * @example
 * <Breadcrumb items={[
 *   { label: 'Inicio', href: '/' },
 *   { label: 'Servicios', href: '/servicios' },
 *   { label: 'Consultoría fiscal' },
 * ]} />
 */
export function Breadcrumb({
  items,
  label = 'Ruta de navegación',
  separator = <ChevronRightIcon />,
  linkAs: LinkComponent = 'a',
  schemaBaseUrl,
  className,
  ...props
}: BreadcrumbProps) {
  const schema = schemaBaseUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: textOf(item.label),
          ...(item.href ? { item: new URL(item.href, schemaBaseUrl).toString() } : {}),
        })),
      }
    : undefined

  return (
    <nav className={cx(styles.root, className)} aria-label={label} {...props}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: la ruta no se reordena
            <li key={index} className={styles.item}>
              {last || !item.href ? (
                <span className={styles.current} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <LinkComponent href={item.href} className={styles.link}>
                  {item.label}
                </LinkComponent>
              )}
              {!last && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {schema && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado y escapado
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      )}
    </nav>
  )
}

import { ChevronLeftIcon, ChevronRightIcon } from '@betterlibs/icons'
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Pagination.module.css'

export type PaginationProps = Omit<ComponentPropsWithRef<'nav'>, 'onChange'> & {
  /** Página actual (desde 1). */
  page: number
  totalPages: number
  /** URL de cada página. Con ella se generan enlaces (lo recomendable: indexables y compartibles). */
  getHref?: (page: number) => string
  /** Alternativa sin URL: botones que avisan del cambio. */
  onPageChange?: (page: number) => void
  /** Páginas visibles a cada lado de la actual. @default 1 */
  siblings?: number
  /** Componente de enlace de tu router (p. ej. `Link` de Next.js). @default 'a' */
  linkAs?: ElementType
  /** Nombre de la navegación. @default 'Paginación' */
  label?: string
  /** @default 'Anterior' */
  previousLabel?: string
  /** @default 'Siguiente' */
  nextLabel?: string
  /** Nombre accesible de cada número. @default (n) => `Página ${n}` */
  pageLabel?: (page: number) => string
  /** Texto en móvil, donde se ocultan los números. @default (n, total) => `Página ${n} de ${total}` */
  summaryLabel?: (page: number, total: number) => string
}

type Item = number | 'start-ellipsis' | 'end-ellipsis'

/** Números visibles: siempre la primera, la última y las vecinas de la actual. */
export function paginationRange(page: number, total: number, siblings = 1): Item[] {
  const range = (from: number, to: number) =>
    Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i)
  const slots = siblings * 2 + 5
  if (total <= slots) return range(1, total)
  const left = Math.max(page - siblings, 2)
  const right = Math.min(page + siblings, total - 1)
  const showStart = left > 3
  const showEnd = right < total - 2
  if (!showStart) return [...range(1, 3 + siblings * 2), 'end-ellipsis', total]
  if (!showEnd) return [1, 'start-ellipsis', ...range(total - 2 - siblings * 2, total)]
  return [1, 'start-ellipsis', ...range(left, right), 'end-ellipsis', total]
}

/**
 * Paginación para listados (blog, noticias, casos de éxito). Con `getHref` genera enlaces
 * normales; la página actual lleva `aria-current="page"`. En móvil se resume en
 * «Página 3 de 12» con Anterior/Siguiente.
 */
export function Pagination({
  page,
  totalPages,
  getHref,
  onPageChange,
  siblings = 1,
  linkAs: LinkComponent = 'a',
  label = 'Paginación',
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  pageLabel = (n) => `Página ${n}`,
  summaryLabel = (n, total) => `Página ${n} de ${total}`,
  className,
  ...props
}: PaginationProps) {
  if (totalPages <= 1) return null
  const current = Math.min(Math.max(page, 1), totalPages)

  const renderControl = (
    target: number,
    content: ReactNode,
    extra: { className?: string; 'aria-label'?: string; 'aria-current'?: 'page' },
  ) =>
    getHref ? (
      <LinkComponent href={getHref(target)} {...extra}>
        {content}
      </LinkComponent>
    ) : (
      <button type="button" onClick={() => onPageChange?.(target)} {...extra}>
        {content}
      </button>
    )

  const edge = (target: number, text: string, icon: ReactNode, side: 'previous' | 'next') => {
    const disabled = side === 'previous' ? current <= 1 : current >= totalPages
    const content = (
      <>
        {side === 'previous' && icon}
        <span>{text}</span>
        {side === 'next' && icon}
      </>
    )
    return (
      <li className={styles.edge} data-side={side}>
        {disabled ? (
          // Se mantiene visible (sin saltos de diseño) pero fuera del teclado y del árbol accesible.
          <span className={styles.link} data-disabled="" aria-hidden="true">
            {content}
          </span>
        ) : (
          renderControl(target, content, { className: styles.link })
        )}
      </li>
    )
  }

  return (
    <nav className={cx(styles.root, className)} aria-label={label} {...props}>
      <ul className={styles.list}>
        {edge(
          current - 1,
          previousLabel,
          <ChevronLeftIcon className={styles.icon} aria-hidden="true" />,
          'previous',
        )}
        {paginationRange(current, totalPages, siblings).map((item) =>
          typeof item === 'number' ? (
            <li key={item} className={styles.page}>
              {renderControl(item, item, {
                className: styles.link,
                'aria-label': pageLabel(item),
                'aria-current': item === current ? 'page' : undefined,
              })}
            </li>
          ) : (
            <li key={item} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ),
        )}
        <li className={styles.summary}>{summaryLabel(current, totalPages)}</li>
        {edge(
          current + 1,
          nextLabel,
          <ChevronRightIcon className={styles.icon} aria-hidden="true" />,
          'next',
        )}
      </ul>
    </nav>
  )
}

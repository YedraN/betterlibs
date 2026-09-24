import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars, PolymorphicProps, Responsive, Space } from '../../utils/types'
import { responsiveVars, spaceVar } from '../../utils/types'
import styles from './Grid.module.css'

export type GridOwnProps = {
  /**
   * Número de columnas, fijo o por breakpoint: `{ base: 1, md: 2, lg: 3 }`.
   * Mobile-first: `base` aplica en todas las pantallas y cada breakpoint sobrescribe hacia arriba.
   * @default 1
   */
  columns?: Responsive<number>
  /**
   * Ancho mínimo de cada elemento (`'16rem'`). Si lo indicas, la rejilla calcula sola
   * cuántas columnas caben e ignora `columns`.
   */
  minItemWidth?: string
  /** Separación entre celdas. @default '6' */
  gap?: Space
  /** Separación vertical, si debe ser distinta de `gap`. */
  rowGap?: Space
  /** Alineación vertical de las celdas. */
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export type GridProps<E extends ElementType = 'div'> = PolymorphicProps<E, GridOwnProps>

/** Rejilla responsive para tarjetas, características, logos o equipos. */
export function Grid<E extends ElementType = 'div'>({
  as,
  columns = 1,
  minItemWidth,
  gap = '6',
  rowGap,
  align,
  className,
  style,
  ...props
}: GridProps<E>) {
  const Component: ElementType = as ?? 'div'
  const cols = responsiveVars('bl-grid-cols', columns, (v) => v)
  return (
    <Component
      className={cx(styles.root, className)}
      data-auto={minItemWidth ? '' : undefined}
      data-align={align}
      {...(minItemWidth ? {} : cols.data)}
      style={
        {
          ...(minItemWidth ? { '--_min': minItemWidth } : cols.style),
          '--_gap': spaceVar(gap),
          '--_row-gap': spaceVar(rowGap ?? gap),
          ...style,
        } as CSSVars
      }
      {...props}
    />
  )
}

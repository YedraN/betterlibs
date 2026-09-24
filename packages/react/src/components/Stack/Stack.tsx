import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { Breakpoint, CSSVars, PolymorphicProps, Space } from '../../utils/types'
import { spaceVar } from '../../utils/types'
import styles from './Stack.module.css'

export type StackOwnProps = {
  /** @default 'column' */
  direction?: 'column' | 'row'
  /** Separación entre elementos (escala `--bl-space-*`). @default '4' */
  gap?: Space
  /** Alineación en el eje transversal. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** Distribución en el eje principal. */
  justify?: 'start' | 'center' | 'end' | 'between'
  /** Permite que los elementos pasen a la siguiente línea si no caben. */
  wrap?: boolean
  /**
   * En `direction="row"`, apila en columna por debajo de este breakpoint.
   * Ideal para grupos de botones o columnas de texto + imagen en móvil.
   */
  stackBelow?: Breakpoint
}

export type StackProps<E extends ElementType = 'div'> = PolymorphicProps<E, StackOwnProps>

/** Organiza elementos en una fila o columna con una separación uniforme. */
export function Stack<E extends ElementType = 'div'>({
  as,
  direction = 'column',
  gap = '4',
  align,
  justify,
  wrap = false,
  stackBelow,
  className,
  style,
  ...props
}: StackProps<E>) {
  const Component: ElementType = as ?? 'div'
  return (
    <Component
      className={cx(styles.root, className)}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      data-stack-below={stackBelow}
      style={{ '--_gap': spaceVar(gap), ...style } as CSSVars}
      {...props}
    />
  )
}

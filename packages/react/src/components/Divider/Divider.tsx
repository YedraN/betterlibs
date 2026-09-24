import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars, Space } from '../../utils/types'
import { spaceVar } from '../../utils/types'
import styles from './Divider.module.css'

export type DividerProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Texto en el centro de la línea, p. ej. «o». Solo en horizontal. */
  label?: ReactNode
  /** Margen a ambos lados de la línea. */
  spacing?: Space
  /**
   * Si es `true` (por defecto), la línea es solo visual y se oculta a lectores de pantalla.
   * Usa `false` cuando separa grupos de contenido con significado distinto.
   */
  decorative?: boolean
}

/** Línea divisoria entre bloques de contenido. */
export function Divider({
  orientation = 'horizontal',
  label,
  spacing,
  decorative = true,
  className,
  style,
  ...props
}: DividerProps) {
  const semantics = decorative
    ? { role: 'none' as const }
    : { role: 'separator' as const, 'aria-orientation': orientation }
  return (
    <div
      className={cx(styles.root, className)}
      data-orientation={orientation}
      data-labelled={label ? '' : undefined}
      style={{ '--_spacing': spaceVar(spacing), ...style } as CSSVars}
      {...(label ? {} : semantics)}
      {...props}
    >
      {label && orientation === 'horizontal' ? <span className={styles.label}>{label}</span> : null}
    </div>
  )
}

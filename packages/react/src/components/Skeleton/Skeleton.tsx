import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars } from '../../utils/types'
import styles from './Skeleton.module.css'

export type SkeletonProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** @default 'text' */
  variant?: 'text' | 'rect' | 'circle'
  /** Ancho (CSS). En `text`, la última línea se acorta sola para parecer un párrafo real. */
  width?: string
  /** Alto (CSS). */
  height?: string
  /** Número de líneas en `variant="text"`. @default 1 */
  lines?: number
}

/**
 * Marcador de posición mientras carga el contenido. Imita su forma para evitar saltos.
 * Es decorativo: marca el contenedor que carga con `aria-busy="true"`.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
  style,
  ...props
}: SkeletonProps) {
  const vars = { '--_w': width, '--_h': height, ...style } as CSSVars
  if (variant === 'text' && lines > 1) {
    return (
      <span className={cx(styles.lines, className)} style={vars} aria-hidden="true" {...props}>
        {Array.from({ length: lines }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: líneas estáticas sin identidad propia.
          <span key={i} className={styles.root} data-variant="text" />
        ))}
      </span>
    )
  }
  return (
    <span
      className={cx(styles.root, className)}
      data-variant={variant}
      style={vars}
      aria-hidden="true"
      {...props}
    />
  )
}

import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars, PolymorphicProps, Space } from '../../utils/types'
import { spaceVar } from '../../utils/types'
import styles from './Box.module.css'

export type BoxOwnProps = {
  /** Relleno interior (escala `--bl-space-*`). */
  padding?: Space
  /** Fondo. `raised` se usa para tarjetas sobre fondos `subtle`. */
  tone?: 'default' | 'subtle' | 'muted' | 'raised' | 'accent'
  /** Radio de las esquinas. */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Añade un borde sutil. */
  bordered?: boolean
  /** Sombra de elevación. Úsala con moderación. */
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
}

export type BoxProps<E extends ElementType = 'div'> = PolymorphicProps<E, BoxOwnProps>

/**
 * Contenedor genérico con relleno, fondo, borde y sombra a partir de tokens.
 * Es la pieza base para tarjetas y paneles.
 */
export function Box<E extends ElementType = 'div'>({
  as,
  padding,
  tone,
  radius,
  bordered = false,
  shadow,
  className,
  style,
  ...props
}: BoxProps<E>) {
  const Component: ElementType = as ?? 'div'
  return (
    <Component
      className={cx(styles.root, className)}
      data-tone={tone}
      data-bordered={bordered || undefined}
      style={
        {
          '--_padding': spaceVar(padding),
          '--_radius': radius ? `var(--bl-radius-${radius})` : undefined,
          '--_shadow': shadow && shadow !== 'none' ? `var(--bl-shadow-${shadow})` : undefined,
          ...style,
        } as CSSVars
      }
      {...props}
    />
  )
}

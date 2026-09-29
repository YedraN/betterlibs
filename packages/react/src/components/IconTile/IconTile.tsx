import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import styles from './IconTile.module.css'

export type IconTileProps = ComponentPropsWithRef<'span'> & {
  /**
   * `accent`: degradado suave de la marca. `solid`: degradado intenso con brillo.
   * `neutral`: superficie elevada gris.
   * @default 'accent'
   */
  tone?: 'accent' | 'solid' | 'neutral'
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Baldosa para el icono de una tarjeta o característica: da presencia al icono sin competir con
 * el título. Es decorativa (`aria-hidden`): el texto de al lado debe explicar el contenido.
 */
export function IconTile({ tone = 'accent', size = 'md', className, ...props }: IconTileProps) {
  return (
    <span
      className={cx(styles.root, className)}
      data-tone={tone}
      data-size={size}
      aria-hidden="true"
      {...props}
    />
  )
}

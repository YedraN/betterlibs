import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import type { Tone } from '../../utils/types'
import styles from './Badge.module.css'

export type BadgeProps = ComponentPropsWithRef<'span'> & {
  /** Significado del color. No comuniques el estado solo con color: el texto debe bastar. */
  tone?: Tone
  /** @default 'subtle' */
  variant?: 'subtle' | 'solid' | 'outline'
  /** @default 'md' */
  size?: 'sm' | 'md'
  /** Icono decorativo antes del texto. */
  icon?: ReactNode
  /** Punto de color antes del texto (estado «en línea», «nuevo»…). */
  dot?: boolean
}

/** Etiqueta corta de estado o categoría: «Nuevo», «Beta», «Agotado». No es interactiva. */
export function Badge({
  tone = 'neutral',
  variant = 'subtle',
  size = 'md',
  icon,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(styles.root, className)}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

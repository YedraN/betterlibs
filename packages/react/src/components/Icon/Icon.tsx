import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Icon.module.css'

export type IconProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** El icono (de `@betterlibs/icons` o de cualquier librería que use `1em`/`currentColor`). */
  children: ReactNode
  /** @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tone?: 'inherit' | 'muted' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  /**
   * Texto accesible. Sin él, el icono es decorativo y se oculta a lectores de pantalla.
   * Indícalo solo si el icono transmite información que no está en el texto cercano.
   */
  label?: string
  /** Muestra el icono dentro de un círculo de color (listas de características, pasos). */
  contained?: boolean
}

/** Da tamaño, color y accesibilidad coherentes a cualquier icono. */
export function Icon({
  size = 'md',
  tone = 'inherit',
  label,
  contained = false,
  className,
  children,
  ...props
}: IconProps) {
  return (
    <span
      className={cx(styles.root, className)}
      data-size={size}
      data-tone={tone}
      data-contained={contained || undefined}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...props}
    >
      {children}
    </span>
  )
}

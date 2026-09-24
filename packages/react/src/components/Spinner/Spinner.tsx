import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './Spinner.module.css'

export type SpinnerProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Texto anunciado a lectores de pantalla. @default 'Cargando…' */
  label?: string
  /**
   * Oculta el spinner a lectores de pantalla. Úsalo cuando otro elemento ya comunica
   * la carga (p. ej. un botón con `aria-busy`).
   */
  decorative?: boolean
}

/** Indicador de carga indeterminada. Para cargas de contenido, prefiere `Skeleton`. */
export function Spinner({
  size = 'md',
  label = 'Cargando…',
  decorative = false,
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      className={cx(styles.root, className)}
      data-size={size}
      {...(decorative ? { 'aria-hidden': true } : { role: 'status' })}
      {...props}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle className={styles.track} cx="12" cy="12" r="9.5" strokeWidth="3" />
        <circle className={styles.arc} cx="12" cy="12" r="9.5" strokeWidth="3" />
      </svg>
      {!decorative && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  )
}

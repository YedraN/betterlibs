import { Slot, Slottable } from '@radix-ui/react-slot'
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Spinner } from '../Spinner/Spinner'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  /**
   * Jerarquía visual. Usa un solo `primary` por bloque: es la acción principal.
   * @default 'primary'
   */
  variant?: ButtonVariant
  /** `md` mide 44px de alto, el mínimo recomendado para pantallas táctiles. @default 'md' */
  size?: ButtonSize
  /** Ocupa todo el ancho disponible. */
  fullWidth?: boolean
  /** Icono antes del texto. */
  iconStart?: ReactNode
  /** Icono después del texto (p. ej. una flecha en CTAs). */
  iconEnd?: ReactNode
  /**
   * Muestra un spinner y bloquea la acción sin perder el foco ni cambiar el ancho.
   * No soportado con `asChild`.
   */
  loading?: boolean
  /** Texto anunciado mientras carga. @default 'Cargando…' */
  loadingLabel?: string
  /**
   * Renderiza el hijo (p. ej. un `<a>` o el `Link` de tu router) con los estilos del botón.
   * @example <Button asChild><a href="/contacto">Contactar</a></Button>
   */
  asChild?: boolean
}

/**
 * Botón para acciones. Para navegar a otra página usa `asChild` con un enlace:
 * así se mantiene la semántica correcta (los enlaces navegan, los botones actúan).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconStart,
  iconEnd,
  loading = false,
  loadingLabel = 'Cargando…',
  asChild = false,
  type,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const shared = {
    className: cx(styles.root, className),
    'data-variant': variant,
    'data-size': size,
    'data-full-width': fullWidth || undefined,
  }

  if (asChild) {
    return (
      <Slot {...shared} onClick={onClick} {...props}>
        {iconStart && (
          <span className={styles.icon} aria-hidden="true">
            {iconStart}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {iconEnd && (
          <span className={styles.icon} aria-hidden="true">
            {iconEnd}
          </span>
        )}
      </Slot>
    )
  }

  const handleClick =
    loading && onClick ? (event: MouseEvent<HTMLButtonElement>) => event.preventDefault() : onClick

  return (
    <button
      type={type ?? 'button'}
      {...shared}
      data-loading={loading || undefined}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...props}
    >
      <span className={styles.content}>
        {iconStart && (
          <span className={styles.icon} aria-hidden="true">
            {iconStart}
          </span>
        )}
        {children}
        {iconEnd && (
          <span className={styles.icon} aria-hidden="true">
            {iconEnd}
          </span>
        )}
      </span>
      {loading && (
        <span className={styles.loader}>
          <Spinner size="sm" decorative />
          <VisuallyHidden>{loadingLabel}</VisuallyHidden>
        </span>
      )}
    </button>
  )
}

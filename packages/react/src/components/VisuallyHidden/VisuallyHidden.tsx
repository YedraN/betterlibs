import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { PolymorphicProps } from '../../utils/types'
import styles from './VisuallyHidden.module.css'

export type VisuallyHiddenOwnProps = {
  /** Se hace visible al recibir el foco (útil para enlaces de salto). */
  focusable?: boolean
}

export type VisuallyHiddenProps<E extends ElementType = 'span'> = PolymorphicProps<
  E,
  VisuallyHiddenOwnProps
>

/**
 * Oculta contenido a la vista pero lo mantiene para lectores de pantalla.
 * Úsalo para dar contexto extra: «Leer más <VisuallyHidden>sobre auditoría</VisuallyHidden>».
 */
export function VisuallyHidden<E extends ElementType = 'span'>({
  as,
  focusable = false,
  className,
  ...props
}: VisuallyHiddenProps<E>) {
  const Component: ElementType = as ?? 'span'
  return (
    <Component
      className={cx(styles.root, className)}
      data-focusable={focusable || undefined}
      {...props}
    />
  )
}

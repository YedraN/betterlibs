import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { PolymorphicProps } from '../../utils/types'
import styles from './Container.module.css'

export type ContainerOwnProps = {
  /**
   * Ancho máximo del contenido. `prose` (~65 caracteres) es ideal para artículos y textos legales.
   * @default 'xl'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'prose' | 'full'
  /** Quita el margen lateral (útil para contenido que ya gestiona su propio espacio). */
  flush?: boolean
}

export type ContainerProps<E extends ElementType = 'div'> = PolymorphicProps<E, ContainerOwnProps>

/**
 * Centra el contenido con un ancho máximo y un margen lateral fluido.
 * Es la base de cualquier sección de página.
 */
export function Container<E extends ElementType = 'div'>({
  as,
  size = 'xl',
  flush = false,
  className,
  ...props
}: ContainerProps<E>) {
  const Component: ElementType = as ?? 'div'
  return (
    <Component
      className={cx(styles.root, className)}
      data-size={size}
      data-flush={flush || undefined}
      {...props}
    />
  )
}

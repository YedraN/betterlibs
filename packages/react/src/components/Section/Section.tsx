import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { PolymorphicProps } from '../../utils/types'
import styles from './Section.module.css'

export type SectionOwnProps = {
  /**
   * Espacio vertical (fluido: menor en móvil, mayor en escritorio).
   * @default 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Fondo de la sección. Alternar `default` y `subtle` ayuda a separar bloques sin líneas.
   * `dark` y `light` fuerzan un modo de color: todo lo que haya dentro se adapta solo.
   * @default 'default'
   */
  tone?: 'default' | 'subtle' | 'muted' | 'brand' | 'dark' | 'light'
}

export type SectionProps<E extends ElementType = 'section'> = PolymorphicProps<E, SectionOwnProps>

/**
 * Bloque vertical de una página con ritmo de espaciado consistente y fondo opcional.
 * Combínalo con `Container` para limitar el ancho del contenido.
 *
 * Accesibilidad: si la sección tiene título, enlázalo con `aria-labelledby` para que
 * aparezca como región navegable en lectores de pantalla.
 */
export function Section<E extends ElementType = 'section'>({
  as,
  spacing = 'md',
  tone = 'default',
  className,
  ...props
}: SectionProps<E>) {
  const Component: ElementType = as ?? 'section'
  const theme = tone === 'dark' || tone === 'light' ? tone : undefined
  return (
    <Component
      className={cx(styles.root, className)}
      data-spacing={spacing}
      data-tone={tone}
      data-theme={theme}
      {...props}
    />
  )
}

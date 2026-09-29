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
  /**
   * Fondo decorativo que se difumina hacia los bordes. Es solo decoración: no afecta al
   * contraste del texto porque se queda por detrás con muy poca intensidad.
   * - `grid` y `dots`: patrones finos, para secciones técnicas o de producto.
   * - `glow`: resplandor del color de marca desde arriba, ideal tras un título.
   * - `mesh`: varios resplandores de color, para portadas y llamadas a la acción.
   * - `noise`: grano sutil que da textura a fondos planos.
   * @default 'none'
   */
  background?: SectionBackground
}

export type SectionBackground = 'none' | 'grid' | 'dots' | 'glow' | 'mesh' | 'noise'

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
  background = 'none',
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
      data-background={background === 'none' ? undefined : background}
      data-theme={theme}
      {...props}
    />
  )
}

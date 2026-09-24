import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars, PolymorphicProps } from '../../utils/types'
import styles from './Text.module.css'

export type TextOwnProps = {
  /**
   * Estilo predefinido:
   * - `body`: párrafo normal.
   * - `lead`: entradilla bajo un titular, más grande y en tono secundario.
   * - `eyebrow`: antetítulo corto en mayúsculas sobre un titular («SERVICIOS»).
   * - `caption`: pies de foto y notas.
   * - `label`: etiquetas de datos y metadatos.
   * @default 'body'
   */
  variant?: 'body' | 'lead' | 'eyebrow' | 'caption' | 'label'
  /** Sobrescribe el tamaño del `variant`. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tone?: 'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'warning' | 'danger'
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
  align?: 'start' | 'center' | 'end'
  /** Corta el texto a N líneas con puntos suspensivos. */
  lines?: number
}

export type TextProps<E extends ElementType = 'p'> = PolymorphicProps<E, TextOwnProps>

/** Texto con estilos tipográficos del sistema. Renderiza un `<p>` por defecto. */
export function Text<E extends ElementType = 'p'>({
  as,
  variant = 'body',
  size,
  tone,
  weight,
  align,
  lines,
  className,
  style,
  ...props
}: TextProps<E>) {
  const Component: ElementType = as ?? 'p'
  return (
    <Component
      className={cx(styles.root, className)}
      data-variant={variant}
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-align={align}
      data-clamp={lines ? '' : undefined}
      style={lines ? ({ '--_lines': lines, ...style } as CSSVars) : style}
      {...props}
    />
  )
}

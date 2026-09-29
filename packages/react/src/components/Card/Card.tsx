import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars, PolymorphicProps, Space } from '../../utils/types'
import { spaceVar } from '../../utils/types'
import styles from './Card.module.css'

export type CardVariant = 'elevated' | 'outline' | 'glass' | 'gradient' | 'glow'

export type CardOwnProps = {
  /**
   * Estilo de la superficie:
   * - `elevated`: superficie en capas con filo de luz y sombra suave.
   * - `outline`: solo borde, para listas densas o fondos con color.
   * - `glass`: translúcida con desenfoque, para ir sobre imágenes o fondos decorativos.
   * - `gradient`: borde degradado que toma el color de marca al pasar el ratón.
   * - `glow`: borde y halo del color de marca, para destacar un elemento (plan recomendado).
   * @default 'elevated'
   */
  variant?: CardVariant
  /** Relleno interior (escala `--bl-space-*`). @default '6' */
  padding?: Space
  /** Radio de las esquinas. @default 'xl' */
  radius?: 'md' | 'lg' | 'xl' | '2xl'
  /**
   * Reacciona al ratón y al foco (se eleva y resalta). Úsalo cuando la tarjeta entera lleva a
   * otra página: pon un único enlace dentro con la clase `bl-card-link` y toda la superficie
   * será clicable sin anidar elementos interactivos.
   */
  interactive?: boolean
}

export type CardProps<E extends ElementType = 'div'> = PolymorphicProps<E, CardOwnProps>

/**
 * Superficie para agrupar contenido relacionado: servicios, artículos, planes, casos de éxito.
 * Es la pieza que da la «profundidad» característica de la librería.
 *
 * @example
 * <Card interactive>
 *   <IconTile><ChartIcon /></IconTile>
 *   <Heading level={3}><a className="bl-card-link" href="/analitica">Analítica</a></Heading>
 *   <Text tone="muted">Cuadros de mando que se entienden.</Text>
 * </Card>
 */
export function Card<E extends ElementType = 'div'>({
  as,
  variant = 'elevated',
  padding = '6',
  radius = 'xl',
  interactive = false,
  className,
  style,
  ...props
}: CardProps<E>) {
  const Component: ElementType = as ?? 'div'
  return (
    <Component
      className={cx(styles.root, className)}
      data-variant={variant}
      data-interactive={interactive || undefined}
      style={
        {
          '--_padding': spaceVar(padding),
          '--_radius': `var(--bl-radius-${radius})`,
          ...style,
        } as CSSVars
      }
      {...props}
    />
  )
}

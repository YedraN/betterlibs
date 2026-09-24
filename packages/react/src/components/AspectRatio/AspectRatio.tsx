import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars } from '../../utils/types'
import styles from './AspectRatio.module.css'

export type AspectRatioProps = ComponentPropsWithRef<'div'> & {
  /** Proporción ancho / alto, p. ej. `16 / 9`, `4 / 3` o `1`. @default 16 / 9 */
  ratio?: number
}

/**
 * Reserva el espacio de imágenes, vídeos o mapas antes de que carguen,
 * evitando saltos de contenido (CLS). El hijo ocupa todo el área.
 */
export function AspectRatio({ ratio = 16 / 9, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      className={cx(styles.root, className)}
      style={{ '--_ratio': ratio, ...style } as CSSVars}
      {...props}
    />
  )
}

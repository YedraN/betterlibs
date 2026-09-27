import type { ReactNode } from 'react'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './LogoCloud.module.css'

export type LogoItem = {
  /** Nombre de la empresa: texto alternativo del logo. */
  name: string
  src?: string
  /** Logo como elemento (SVG en línea, `next/image`…). Alternativa a `src`. */
  logo?: ReactNode
  href?: string
  width?: number
  height?: number
}

export type LogoCloudProps = BlockBaseProps & {
  logos: LogoItem[]
  /**
   * - `row`: una fila que se reparte y salta de línea si no cabe.
   * - `grid`: rejilla de celdas con fondo.
   * @default 'row'
   */
  variant?: 'row' | 'grid'
  /** Logos en gris que recuperan el color al pasar el ratón. @default true */
  grayscale?: boolean
}

/**
 * Logos de clientes, socios o certificaciones. Cada logo lleva el nombre de la empresa como texto
 * alternativo. El título suele ser breve («Más de 500 empresas confían en nosotros»).
 */
export function LogoCloud({
  logos,
  variant = 'row',
  grayscale = true,
  align = 'center',
  ...block
}: LogoCloudProps) {
  return (
    <BlockSection {...block} align={align} titleSize="lg" gap="md">
      <ul
        className={styles.list}
        data-variant={variant}
        data-grayscale={grayscale || undefined}
        data-align={align}
      >
        {logos.map((item) => {
          const image = item.logo ?? (
            <img
              src={item.src}
              alt={item.name}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
            />
          )
          return (
            <li key={item.name} className={styles.item}>
              {item.href ? (
                <a
                  href={item.href}
                  className={styles.link}
                  aria-label={item.logo ? item.name : undefined}
                >
                  {image}
                </a>
              ) : (
                image
              )}
            </li>
          )
        })}
      </ul>
    </BlockSection>
  )
}

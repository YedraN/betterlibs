import type { ReactNode } from 'react'
import { Grid } from '../../components/Grid/Grid'
import type { Responsive } from '../../utils/types'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './Stats.module.css'

export type StatItem = {
  /** La cifra: «500+», «98 %», «24 h». */
  value: ReactNode
  /** Qué mide: «Clientes activos». */
  label: ReactNode
  /** Contexto opcional: «Desde 2004». */
  description?: ReactNode
}

export type StatsProps = BlockBaseProps & {
  stats: StatItem[]
  /**
   * - `plain`: cifras grandes sin caja.
   * - `cards`: cada cifra en una tarjeta.
   * - `divided`: separadas por líneas verticales.
   * @default 'plain'
   */
  variant?: 'plain' | 'cards' | 'divided'
  /** @default { base: 2, lg: número de cifras (máx. 4) } */
  columns?: Responsive<number>
}

/**
 * Cifras destacadas (clientes, años, satisfacción). Es una lista de definiciones: los lectores de
 * pantalla leen «Clientes activos: 500+», aunque visualmente la cifra va primero.
 */
export function Stats({ stats, variant = 'plain', columns, ...block }: StatsProps) {
  return (
    <BlockSection {...block} gap="md">
      <Grid
        as="dl"
        className={styles.list}
        data-variant={variant}
        columns={columns ?? { base: 2, lg: Math.min(Math.max(stats.length, 1), 4) }}
        gap={variant === 'cards' ? '4' : '8'}
      >
        {stats.map((stat, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
          <div key={index} className={styles.item} data-variant={variant}>
            <dt className={styles.label}>{stat.label}</dt>
            <dd className={styles.value}>{stat.value}</dd>
            {stat.description && <dd className={styles.description}>{stat.description}</dd>}
          </div>
        ))}
      </Grid>
    </BlockSection>
  )
}

import { ArrowRightIcon } from '@betterlibs/icons'
import type { ElementType, ReactNode } from 'react'
import { Grid } from '../../components/Grid/Grid'
import { cx } from '../../utils/cx'
import type { Responsive } from '../../utils/types'
import blockStyles from '../Block.module.css'
import { type BlockBaseProps, BlockSection, itemHeadingLevel } from '../shared'
import styles from './FeatureGrid.module.css'

export type Feature = {
  /** Icono decorativo. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Convierte la tarjeta entera en un enlace (el título es el enlace). */
  href?: string
}

export type FeatureGridProps = BlockBaseProps & {
  features: Feature[]
  /**
   * - `cards`: cada característica en una tarjeta con borde.
   * - `plain`: icono y texto, sin caja.
   * - `list`: icono a la izquierda y texto a la derecha, en dos columnas.
   * @default 'cards'
   */
  variant?: 'cards' | 'plain' | 'list'
  /** @default { base: 1, md: 2, lg: 3 } (o { base: 1, md: 2 } en `list`) */
  columns?: Responsive<number>
  /** Texto visual de las tarjetas enlazadas. @default 'Saber más' */
  moreLabel?: ReactNode
  /** Componente de enlace de tu router. @default 'a' */
  linkAs?: ElementType
}

/** Ventajas, servicios o características en rejilla, con icono, título y texto breve. */
export function FeatureGrid({
  features,
  variant = 'cards',
  columns,
  moreLabel = 'Saber más',
  linkAs: LinkComponent = 'a',
  headingLevel = 2,
  ...block
}: FeatureGridProps) {
  const Title = `h${itemHeadingLevel(headingLevel)}` as const
  return (
    <BlockSection {...block} headingLevel={headingLevel} data={{ 'data-variant': variant }}>
      <Grid
        as="ul"
        role="list"
        className={styles.grid}
        data-variant={variant}
        columns={columns ?? (variant === 'list' ? { base: 1, md: 2 } : { base: 1, md: 2, lg: 3 })}
        gap={variant === 'cards' ? '6' : '10'}
      >
        {features.map((feature, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
            key={index}
            className={cx(styles.item, feature.href && blockStyles.linkedCard)}
            data-variant={variant}
          >
            {feature.icon && (
              <span className={styles.icon} aria-hidden="true">
                {feature.icon}
              </span>
            )}
            <div className={styles.body}>
              <Title className={styles.title}>
                {feature.href ? (
                  <LinkComponent href={feature.href} className={blockStyles.cardLink}>
                    {feature.title}
                  </LinkComponent>
                ) : (
                  feature.title
                )}
              </Title>
              {feature.description && (
                <div className={styles.description}>{feature.description}</div>
              )}
              {feature.href && (
                <span className={blockStyles.more} aria-hidden="true">
                  {moreLabel} <ArrowRightIcon />
                </span>
              )}
            </div>
          </li>
        ))}
      </Grid>
    </BlockSection>
  )
}

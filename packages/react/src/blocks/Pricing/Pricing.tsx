'use client'

import { CheckIcon, MinusIcon } from '@betterlibs/icons'
import { isValidElement, type ReactNode, useId, useState } from 'react'
import { Grid } from '../../components/Grid/Grid'
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden'
import type { Responsive } from '../../utils/types'
import { type BlockBaseProps, BlockSection, itemHeadingLevel } from '../shared'
import styles from './Pricing.module.css'

/** Valor fijo o uno por periodo de facturación (`{ mensual: '49 €', anual: '470 €' }`). */
export type PerPeriod = ReactNode | Record<string, ReactNode>

export type PricingFeature = ReactNode | { label: ReactNode; included: boolean }

export type PricingPlan = {
  name: ReactNode
  description?: ReactNode
  /** Precio («49 €», «Desde 1.200 €», «A medida»). */
  price: PerPeriod
  /** Periodo junto al precio («/mes», «/año»). */
  period?: PerPeriod
  /** Nota bajo el precio («IVA no incluido», «Facturación anual»). */
  note?: PerPeriod
  features: PricingFeature[]
  /** Botón o enlace de contratación. */
  action: ReactNode
  /** Plan recomendado: borde de acento y etiqueta. */
  highlighted?: boolean
  /** Etiqueta del plan recomendado. @default 'Recomendado' */
  badge?: ReactNode
}

export type BillingPeriod = { value: string; label: ReactNode }

export type PricingProps = BlockBaseProps & {
  plans: PricingPlan[]
  /** Periodos de facturación: muestra un selector y cada precio puede variar por periodo. */
  billingPeriods?: BillingPeriod[]
  defaultBillingPeriod?: string
  /** Nombre accesible del selector de periodo. @default 'Periodo de facturación' */
  billingLabel?: string
  /** @default 'No incluido' */
  excludedLabel?: string
  /** @default { base: 1, md: 2, lg: número de planes (máx. 4) } */
  columns?: Responsive<number>
}

function isRecord(value: unknown): value is Record<string, ReactNode> {
  return (
    typeof value === 'object' && value !== null && !Array.isArray(value) && !isValidElement(value)
  )
}

function resolve(value: PerPeriod, period?: string): ReactNode {
  if (!isRecord(value)) return value
  return period ? value[period] : Object.values(value)[0]
}

/**
 * Tabla de planes en tarjetas, con plan recomendado y selector de periodo de facturación
 * (grupo de radios nativo: flechas para cambiar). Cada plan es un `<article>` con su título.
 */
export function Pricing({
  plans,
  billingPeriods,
  defaultBillingPeriod,
  billingLabel = 'Periodo de facturación',
  excludedLabel = 'No incluido',
  columns,
  headingLevel = 2,
  align = 'center',
  ...block
}: PricingProps) {
  const id = useId()
  const [period, setPeriod] = useState(defaultBillingPeriod ?? billingPeriods?.[0]?.value)
  const Title = `h${itemHeadingLevel(headingLevel)}` as const

  return (
    <BlockSection {...block} align={align} headingLevel={headingLevel}>
      {billingPeriods && billingPeriods.length > 1 && (
        <div className={styles.toggle} role="radiogroup" aria-label={billingLabel}>
          {billingPeriods.map((option) => (
            <label key={option.value} className={styles.option}>
              <input
                type="radio"
                name={`${id}-period`}
                value={option.value}
                checked={period === option.value}
                onChange={() => setPeriod(option.value)}
                className={styles.optionInput}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )}
      <Grid
        as="ul"
        role="list"
        className={styles.list}
        columns={columns ?? { base: 1, md: 2, lg: Math.min(Math.max(plans.length, 1), 4) }}
        gap="6"
        align="stretch"
      >
        {plans.map((plan, index) => {
          const titleId = `${id}-plan-${index}`
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: planes estáticos
            <li key={index}>
              <article
                className={styles.plan}
                data-highlighted={plan.highlighted || undefined}
                aria-labelledby={titleId}
              >
                {plan.highlighted && <p className={styles.badge}>{plan.badge ?? 'Recomendado'}</p>}
                <Title id={titleId} className={styles.name}>
                  {plan.name}
                </Title>
                {plan.description && <div className={styles.description}>{plan.description}</div>}
                <p className={styles.price} aria-live="polite">
                  <span className={styles.amount}>{resolve(plan.price, period)}</span>
                  {plan.period && (
                    <span className={styles.period}>{resolve(plan.period, period)}</span>
                  )}
                </p>
                {plan.note && <p className={styles.note}>{resolve(plan.note, period)}</p>}
                <div className={styles.action}>{plan.action}</div>
                <ul className={styles.features}>
                  {plan.features.map((feature, featureIndex) => {
                    const detailed =
                      isRecord(feature) && 'included' in feature
                        ? (feature as { label: ReactNode; included: boolean })
                        : undefined
                    const included = detailed ? detailed.included : true
                    return (
                      // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
                      <li key={featureIndex} className={styles.feature} data-included={included}>
                        {included ? (
                          <CheckIcon className={styles.featureIcon} aria-hidden="true" />
                        ) : (
                          <MinusIcon className={styles.featureIcon} aria-hidden="true" />
                        )}
                        <span>
                          {!included && <VisuallyHidden>{`${excludedLabel}: `}</VisuallyHidden>}
                          {detailed ? detailed.label : (feature as ReactNode)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            </li>
          )
        })}
      </Grid>
    </BlockSection>
  )
}

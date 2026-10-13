import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Heading } from '../../components/Heading/Heading'
import { cx } from '../../utils/cx'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './BentoFeatures.module.css'

export type BentoFeaturesProps = Omit<BlockBaseProps, 'headingLevel'> & {
  /** Nivel del título de sección; configura los títulos de las tarjetas con BentoFeature.headingLevel. @default 2 */
  headingLevel?: 2 | 3
  /** Tarjetas o wrappers Reveal con tarjetas dentro; no introduce una lista. */
  children: ReactNode
}

/** Retícula asimétrica de doce columnas y una columna en móvil. No importa un motor. */
export function BentoFeatures({ children, ...props }: BentoFeaturesProps) {
  return (
    <BlockSection {...props}>
      <div className={styles.grid}>{children}</div>
    </BlockSection>
  )
}

export type BentoFeatureProps = Omit<ComponentPropsWithRef<'article'>, 'title'> & {
  title: ReactNode
  description?: ReactNode
  /** Imagen, ilustración o demostración. Proporciona su semántica y textos alternativos. */
  media?: ReactNode
  actions?: ReactNode
  /** @default 3 */
  headingLevel?: 2 | 3 | 4
  /** @default 'default' */
  tone?: 'default' | 'brand' | 'inverse'
}

export function BentoFeature({
  title,
  description,
  media,
  actions,
  headingLevel = 3,
  tone = 'default',
  className,
  children,
  ...props
}: BentoFeatureProps) {
  return (
    <article {...props} className={cx(styles.card, className)} data-tone={tone}>
      {media && <div className={styles.media}>{media}</div>}
      <div className={styles.copy}>
        <Heading level={headingLevel} size="2xl" className={styles.title}>
          {title}
        </Heading>
        {description && <div className={styles.description}>{description}</div>}
        {children}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </article>
  )
}

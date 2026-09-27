import { ArrowRightIcon } from '@betterlibs/icons'
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import blockStyles from '../Block.module.css'
import styles from './CaseStudyCard.module.css'

export type CaseStudyMetric = { value: ReactNode; label: ReactNode }

export type CaseStudyCardProps = Omit<ComponentPropsWithRef<'article'>, 'title'> & {
  title: ReactNode
  href: string
  /** Cliente: nombre o logo (si es logo, que tenga texto alternativo). */
  client?: ReactNode
  summary?: ReactNode
  /** Imagen decorativa. */
  image?: { src: string; alt?: string }
  /** Resultados («-50 %» «tiempo de cierre»). Máximo 3. */
  metrics?: CaseStudyMetric[]
  /** Sector o servicio («Industria», «Auditoría»). */
  tags?: ReactNode[]
  /** @default 3 */
  headingLevel?: 2 | 3 | 4
  /** Texto visual del enlace. @default 'Leer el caso' */
  moreLabel?: ReactNode
  /** Componente de enlace de tu router. @default 'a' */
  linkAs?: ElementType
}

/**
 * Caso de éxito: cliente, reto resumido y resultados medibles. Tarjeta enteramente clicable con el
 * título como único enlace.
 */
export function CaseStudyCard({
  title,
  href,
  client,
  summary,
  image,
  metrics,
  tags,
  headingLevel = 3,
  moreLabel = 'Leer el caso',
  linkAs: LinkComponent = 'a',
  className,
  ...props
}: CaseStudyCardProps) {
  const Title = `h${headingLevel}` as const
  return (
    <article className={cx(styles.card, blockStyles.linkedCard, className)} {...props}>
      {image && (
        <div className={styles.image}>
          <img src={image.src} alt={image.alt ?? ''} loading="lazy" decoding="async" />
        </div>
      )}
      <div className={styles.body}>
        {(client || tags?.length) && (
          <div className={styles.top}>
            {client && <div className={styles.client}>{client}</div>}
            {tags && tags.length > 0 && (
              <ul className={styles.tags}>
                {tags.map((tag, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
                  <li key={index} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <Title className={styles.title}>
          <LinkComponent href={href} className={blockStyles.cardLink}>
            {title}
          </LinkComponent>
        </Title>
        {summary && <div className={styles.summary}>{summary}</div>}
        {metrics && metrics.length > 0 && (
          <dl className={styles.metrics}>
            {metrics.slice(0, 3).map((metric, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
              <div key={index} className={styles.metric}>
                <dt className={styles.metricLabel}>{metric.label}</dt>
                <dd className={styles.metricValue}>{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <span className={blockStyles.more} aria-hidden="true">
          {moreLabel} <ArrowRightIcon />
        </span>
      </div>
    </article>
  )
}

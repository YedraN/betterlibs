import type { ReactNode } from 'react'
import { type BlockBaseProps, BlockSection, itemHeadingLevel } from '../shared'
import styles from './Timeline.module.css'

export type TimelineItem = {
  /** Fecha o etiqueta del paso («2004», «Semana 1»). En `steps` se numera solo si falta. */
  label?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Icono decorativo en lugar del punto o del número. */
  icon?: ReactNode
}

export type TimelineProps = BlockBaseProps & {
  items: TimelineItem[]
  /**
   * - `vertical`: línea temporal con puntos (historia de la empresa, hitos).
   * - `steps`: pasos numerados en fila (cómo trabajamos); en móvil se apilan.
   * @default 'vertical'
   */
  variant?: 'vertical' | 'steps'
}

/** Historia, hitos o proceso de trabajo como lista ordenada. */
export function Timeline({
  items,
  variant = 'vertical',
  headingLevel = 2,
  ...block
}: TimelineProps) {
  const Title = `h${itemHeadingLevel(headingLevel)}` as const
  return (
    <BlockSection {...block} headingLevel={headingLevel}>
      <ol className={styles.list} data-variant={variant}>
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
          <li key={index} className={styles.item}>
            <span className={styles.marker} aria-hidden="true">
              {item.icon ?? (variant === 'steps' ? index + 1 : null)}
            </span>
            <div className={styles.body}>
              {item.label && <p className={styles.label}>{item.label}</p>}
              <Title className={styles.title}>{item.title}</Title>
              {item.description && <div className={styles.description}>{item.description}</div>}
            </div>
          </li>
        ))}
      </ol>
    </BlockSection>
  )
}

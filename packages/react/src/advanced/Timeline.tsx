import type { ReactNode } from 'react'
import styles from './ActivityTimeline.module.css'

export type TimelineItem = {
  id: string
  title: string
  description?: string
  date?: string
  dateLabel?: string
  status?: 'complete' | 'current' | 'pending'
  details?: ReactNode
}
export type TimelineProps = { label: string; items: TimelineItem[]; emptyText?: string }

/** Historial semántico; el estado siempre tiene texto además de color. Los detalles son nativos. */
export function Timeline({
  label,
  items,
  emptyText = 'La actividad aparecerá aquí cuando haya cambios.',
}: TimelineProps) {
  const names = { complete: 'Completado', current: 'En curso', pending: 'Pendiente' }
  return (
    <section aria-label={label}>
      {items.length ? (
        <ol className={styles.root}>
          {items.map((item) => (
            <li key={item.id} data-status={item.status}>
              <span aria-hidden="true" className={styles.marker} />
              <div className={styles.content}>
                <div className={styles.meta}>
                  {item.date && <time dateTime={item.date}>{item.dateLabel ?? item.date}</time>}
                  {item.status && <span>{names[item.status]}</span>}
                </div>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                {item.details && (
                  <details>
                    <summary>Ver detalles de {item.title.toLowerCase()}</summary>
                    {item.details}
                  </details>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p>{emptyText}</p>
      )}
    </section>
  )
}

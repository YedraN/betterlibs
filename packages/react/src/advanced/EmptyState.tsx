import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

export type EmptyStateProps = {
  title: string
  description: string
  icon?: ReactNode
  actions?: ReactNode
  compact?: boolean
}

/** Explica qué falta y cómo continuar; las acciones son controles reales de la aplicación. */
export function EmptyState({ title, description, icon, actions, compact }: EmptyStateProps) {
  return (
    <div className={styles.root} data-compact={compact || undefined}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}

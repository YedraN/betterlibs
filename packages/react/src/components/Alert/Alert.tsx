import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '@betterlibs/icons'
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Alert.module.css'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export type AlertProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  /** Significado del mensaje. @default 'info' */
  tone?: AlertTone
  /** Título corto en negrita. */
  title?: ReactNode
  /** Icono propio; `false` para no mostrar ninguno. Por defecto, el del tono. */
  icon?: ReactNode | false
  /** Acciones bajo el texto (p. ej. un `Button` o un `Link`). */
  actions?: ReactNode
  /** Muestra un botón para cerrar el aviso. */
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void
  /** Nombre accesible del botón de cerrar. @default 'Cerrar aviso' */
  dismissLabel?: string
}

const icons = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
} satisfies Record<AlertTone, unknown>

/**
 * Mensaje destacado dentro de la página: confirmaciones («Hemos recibido tu mensaje»), avisos
 * o errores generales. Es estático; si aparece como respuesta a una acción, añade
 * `role="status"` (o `role="alert"` si es urgente) para que se anuncie.
 */
export function Alert({
  tone = 'info',
  title,
  icon,
  actions,
  onDismiss,
  dismissLabel = 'Cerrar aviso',
  className,
  children,
  ...props
}: AlertProps) {
  const ToneIcon = icons[tone]
  return (
    <div className={cx(styles.root, className)} data-tone={tone} {...props}>
      {icon !== false && (
        <span className={styles.icon} aria-hidden="true">
          {icon ?? <ToneIcon />}
        </span>
      )}
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.content}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <CloseIcon aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

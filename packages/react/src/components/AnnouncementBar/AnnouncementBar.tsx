'use client'

import { CloseIcon } from '@betterlibs/icons'
import { type ComponentPropsWithRef, type ReactNode, useEffect, useState } from 'react'
import { cx } from '../../utils/cx'
import styles from './AnnouncementBar.module.css'

export type AnnouncementBarProps = ComponentPropsWithRef<'div'> & {
  /**
   * `brand`: color de marca. `neutral`: gris suave. `dark`: fondo oscuro.
   * `info`/`warning`: avisos de servicio (horarios, incidencias).
   * @default 'brand'
   */
  tone?: 'brand' | 'neutral' | 'dark' | 'info' | 'warning'
  /** Icono decorativo antes del texto. */
  icon?: ReactNode
  /** Enlace o botón al final del mensaje («Descárgalo gratis»). */
  action?: ReactNode
  /** Muestra un botón para cerrar la barra. */
  dismissible?: boolean
  /**
   * Recuerda el cierre en `localStorage` con esta clave (cámbiala para cada anuncio nuevo). Sin
   * ella, la barra vuelve a aparecer al recargar.
   */
  storageKey?: string
  onDismiss?: () => void
  /** @default 'Cerrar anuncio' */
  dismissLabel?: string
  /** Nombre de la región para lectores de pantalla. @default 'Anuncio' */
  label?: string
}

function readDismissed(key?: string) {
  if (!key) return false
  try {
    return window.localStorage.getItem(key) === 'dismissed'
  } catch {
    return false
  }
}

/**
 * Franja sobre la cabecera para un anuncio breve: un lanzamiento, un evento, un cambio de
 * horario. Un solo mensaje, corto, con un enlace como mucho. No se anuncia de forma intrusiva:
 * es una región con nombre que se encuentra al navegar por regiones.
 */
export function AnnouncementBar({
  tone = 'brand',
  icon,
  action,
  dismissible = false,
  storageKey,
  onDismiss,
  dismissLabel = 'Cerrar anuncio',
  label = 'Anuncio',
  className,
  children,
  ...props
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (readDismissed(storageKey)) setDismissed(true)
  }, [storageKey])

  if (dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, 'dismissed')
      } catch {
        // Sin almacenamiento (modo privado): solo se oculta en esta visita.
      }
    }
    onDismiss?.()
  }

  return (
    <div
      role="region"
      aria-label={label}
      className={cx(styles.root, className)}
      data-tone={tone}
      data-theme={tone === 'dark' ? 'dark' : undefined}
      {...props}
    >
      <div className={styles.inner}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <p className={styles.message}>
          {children}
          {action && <span className={styles.action}>{action}</span>}
        </p>
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={dismissLabel}
          onClick={dismiss}
        >
          <CloseIcon aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

'use client'

import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '@betterlibs/icons'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'
import { usePortalContainer } from '../Portal/Portal'
import { getServerSnapshot, getSnapshot, subscribe, type ToastTone, toast } from './store'
import styles from './Toast.module.css'

export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type ToasterProps = {
  /** @default 'bottom-right' */
  position?: ToasterPosition
  /** Duración por defecto en ms. @default 6000 */
  duration?: number
  /**
   * Nombre de la región de notificaciones para lectores de pantalla. F8 lleva el foco a ella.
   * @default 'Notificaciones'
   */
  label?: string
  /** Nombre accesible del botón de cerrar. @default 'Cerrar notificación' */
  closeLabel?: string
}

const icons = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
} satisfies Record<ToastTone, unknown>

function swipeDirection(position: ToasterPosition) {
  if (position.endsWith('left')) return 'left'
  if (position.endsWith('right')) return 'right'
  return position.startsWith('top') ? 'up' : 'down'
}

/**
 * Región donde aparecen las notificaciones de `toast()`. Móntala una vez, al final del layout.
 * Las notificaciones se anuncian a los lectores de pantalla (las de error, de forma inmediata),
 * se pausan al pasar el ratón o enfocarlas y se pueden descartar deslizando.
 */
export function Toaster({
  position = 'bottom-right',
  duration = 6000,
  label = 'Notificaciones',
  closeLabel = 'Cerrar notificación',
}: ToasterProps) {
  const records = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const container = usePortalContainer()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const viewport = (
    <ToastPrimitive.Viewport
      className={styles.viewport}
      data-position={position}
      label={`${label} ({hotkey})`}
    />
  )

  return (
    <ToastPrimitive.Provider
      label={label}
      duration={duration}
      swipeDirection={swipeDirection(position)}
    >
      {records.map((record) => {
        const Icon = icons[record.tone]
        return (
          <ToastPrimitive.Root
            key={record.id}
            className={styles.toast}
            data-tone={record.tone}
            open={record.open}
            inert={!record.open || undefined}
            aria-hidden={!record.open || undefined}
            onOpenChange={(open) => {
              if (!open) toast.dismiss(record.id)
            }}
            duration={
              record.persistent
                ? Number.POSITIVE_INFINITY
                : (record.duration ??
                  (record.action ||
                  record.actions?.length ||
                  (record.progress !== undefined && record.progress < 100)
                    ? Number.POSITIVE_INFINITY
                    : undefined))
            }
            type={record.tone === 'danger' ? 'foreground' : 'background'}
          >
            <Icon className={styles.icon} aria-hidden="true" />
            <div className={styles.body}>
              <ToastPrimitive.Title className={styles.title}>{record.title}</ToastPrimitive.Title>
              {(record.description || (record.count && record.count > 1)) && (
                <ToastPrimitive.Description className={styles.description}>
                  {record.description}
                  {record.count && record.count > 1 && (
                    <span> {record.count} actualizaciones agrupadas.</span>
                  )}
                </ToastPrimitive.Description>
              )}
              {record.progress !== undefined && (
                <progress
                  className={styles.progress}
                  aria-label="Progreso de la operación"
                  max={100}
                  value={Math.max(0, Math.min(100, record.progress))}
                />
              )}
              {[...(record.action ? [record.action] : []), ...(record.actions ?? [])].map(
                (action) => (
                  <ToastPrimitive.Action
                    key={action.label}
                    altText={action.altText ?? action.label}
                    asChild
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className={styles.action}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  </ToastPrimitive.Action>
                ),
              )}
            </div>
            <ToastPrimitive.Close asChild>
              <IconButton label={closeLabel} size="sm" className={styles.close}>
                <CloseIcon />
              </IconButton>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        )
      })}
      {mounted && createPortal(viewport, container ?? document.body)}
    </ToastPrimitive.Provider>
  )
}

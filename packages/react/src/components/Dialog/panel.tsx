'use client'

import { CloseIcon } from '@betterlibs/icons'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { IconButton } from '../IconButton/IconButton'
import { usePortalContainer } from '../Portal/Portal'
import vhStyles from '../VisuallyHidden/VisuallyHidden.module.css'
import styles from './Dialog.module.css'

export type PanelOwnProps = {
  /** Título del panel. Obligatorio: da nombre al diálogo para los lectores de pantalla. */
  title: ReactNode
  /** Texto bajo el título; se anuncia al abrir. */
  description?: ReactNode
  /** Oculta el título a la vista (se sigue anunciando). */
  hideTitle?: boolean
  /** Acciones al pie (p. ej. «Cancelar» y «Confirmar»). */
  footer?: ReactNode
  /** Nombre accesible del botón de cerrar. @default 'Cerrar' */
  closeLabel?: string
  /** Oculta el botón de cerrar (Escape y el clic fuera siguen cerrando). */
  hideCloseButton?: boolean
}

export type PanelProps = Omit<DialogPrimitive.DialogContentProps, 'title'> &
  PanelOwnProps & {
    kind: 'dialog' | 'drawer'
    side?: 'right' | 'left' | 'bottom' | 'top'
    size?: string
  }

/**
 * Panel modal común de `Dialog` y `Drawer`: portal, capa de fondo, título, descripción, cuerpo con
 * scroll y pie. El botón de cerrar va al final del DOM (arriba a la derecha en pantalla) para que
 * el foco inicial caiga en el contenido y no en «Cerrar».
 */
export function Panel({
  kind,
  side,
  size,
  title,
  description,
  hideTitle = false,
  footer,
  closeLabel = 'Cerrar',
  hideCloseButton = false,
  className,
  children,
  ...props
}: PanelProps) {
  const container = usePortalContainer()
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className={styles.overlay} />
      <DialogPrimitive.Content
        className={cx(styles.content, className)}
        data-kind={kind}
        data-side={side}
        data-size={size}
        // Sin descripción, se indica explícitamente para que Radix no avise en consola.
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...props}
      >
        <div className={styles.header}>
          <DialogPrimitive.Title className={cx(styles.title, hideTitle && vhStyles.root)}>
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className={styles.description}>
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
        {!hideCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton label={closeLabel} size="sm" className={styles.close}>
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

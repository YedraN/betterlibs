'use client'

import { CloseIcon } from '@betterlibs/icons'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { type ReactNode, useId } from 'react'
import { cx } from '../../utils/cx'
import { IconButton } from '../IconButton/IconButton'
import { usePortalContainer } from '../Portal/Portal'
import floating from './Floating.module.css'
import styles from './Popover.module.css'

export type PopoverProps = PopoverPrimitive.PopoverProps

/**
 * Contenido flotante junto a un botón: información ampliada, un pequeño formulario, opciones de
 * compartir… No atrapa el foco ni bloquea la página; se cierra con Escape o al hacer clic fuera.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild><Button variant="outline">Horario</Button></PopoverTrigger>
 *   <PopoverContent title="Horario de atención">L-V de 9 a 18 h.</PopoverContent>
 * </Popover>
 */
export function Popover(props: PopoverProps) {
  return <PopoverPrimitive.Root {...props} />
}

/** Botón que abre el popover. Usa `asChild` con un `Button`. */
export const PopoverTrigger = PopoverPrimitive.Trigger

/** Elemento junto al que se coloca el popover, si no es el propio disparador. */
export const PopoverAnchor = PopoverPrimitive.Anchor

/** Cierra el popover al pulsarlo. */
export const PopoverClose = PopoverPrimitive.Close

export type PopoverContentProps = Omit<PopoverPrimitive.PopoverContentProps, 'title'> & {
  /** Título en negrita; también da nombre accesible al popover. */
  title?: ReactNode
  /** Muestra la flecha que apunta al disparador. @default true */
  arrow?: boolean
  /** Muestra un botón de cerrar (recomendado si el contenido es interactivo). */
  closeButton?: boolean
  /** Nombre accesible del botón de cerrar. @default 'Cerrar' */
  closeLabel?: string
  /** Ancho: `sm` (16rem), `md` (20rem), `lg` (26rem) o `auto`. @default 'md' */
  width?: 'sm' | 'md' | 'lg' | 'auto'
}

/** Contenido del popover. Por defecto aparece debajo, a 8px del disparador. */
export function PopoverContent({
  title,
  arrow = true,
  closeButton = false,
  closeLabel = 'Cerrar',
  width = 'md',
  sideOffset = 8,
  collisionPadding = 16,
  className,
  children,
  ...props
}: PopoverContentProps) {
  const container = usePortalContainer()
  const titleId = useId()
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        className={cx(floating.content, styles.content, className)}
        data-width={width}
        data-close={closeButton || undefined}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        {title && (
          <p id={titleId} className={styles.title}>
            {title}
          </p>
        )}
        {children}
        {closeButton && (
          <PopoverPrimitive.Close asChild>
            <IconButton label={closeLabel} size="sm" className={styles.close}>
              <CloseIcon />
            </IconButton>
          </PopoverPrimitive.Close>
        )}
        {arrow && <PopoverPrimitive.Arrow className={floating.arrow} width={14} height={7} />}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

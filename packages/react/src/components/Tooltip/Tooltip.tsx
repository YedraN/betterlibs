'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import floating from '../Popover/Floating.module.css'
import { usePortalContainer } from '../Portal/Portal'
import styles from './Tooltip.module.css'

export type TooltipProps = Omit<TooltipPrimitive.TooltipContentProps, 'content' | 'children'> & {
  /** Texto del tooltip: corto, sin enlaces ni botones (no se puede llegar a ellos). */
  content: ReactNode
  /** Elemento que lo activa. Debe poder recibir el foco (un botón, un enlace). */
  children: ReactElement
  /** Espera antes de mostrarse al pasar el ratón, en ms. @default 300 */
  delay?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Etiqueta breve que aparece al pasar el ratón o enfocar con el teclado (se cierra con Escape y
 * se puede pasar el ratón por encima sin que desaparezca, WCAG 1.4.13). Se anuncia como
 * descripción del elemento.
 *
 * No aparece en pantallas táctiles: nunca pongas en un tooltip información imprescindible. En un
 * `IconButton`, el nombre accesible ya lo da `label`; el tooltip solo lo hace visible.
 *
 * @example
 * <Tooltip content="Descargar en PDF">
 *   <IconButton label="Descargar"><DownloadIcon /></IconButton>
 * </Tooltip>
 */
export function Tooltip({
  content,
  children,
  delay = 300,
  open,
  defaultOpen,
  onOpenChange,
  sideOffset = 6,
  collisionPadding = 8,
  className,
  ...props
}: TooltipProps) {
  const container = usePortalContainer()
  return (
    <TooltipPrimitive.Provider delayDuration={delay} skipDelayDuration={300}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={container}>
          <TooltipPrimitive.Content
            className={cx(floating.content, styles.content, className)}
            sideOffset={sideOffset}
            collisionPadding={collisionPadding}
            {...props}
          >
            {content}
            <TooltipPrimitive.Arrow className={styles.arrow} width={10} height={5} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Panel, type PanelOwnProps } from '../Dialog/panel'

export type DrawerProps = DialogPrimitive.DialogProps

/**
 * Panel lateral modal: filtros, carrito, detalle de un elemento o navegación en móvil.
 * Mismo comportamiento que `Dialog` (foco atrapado, scroll bloqueado, Escape).
 *
 * @example
 * <Drawer>
 *   <DrawerTrigger asChild><Button variant="outline">Filtros</Button></DrawerTrigger>
 *   <DrawerContent title="Filtros" side="right">…</DrawerContent>
 * </Drawer>
 */
export function Drawer(props: DrawerProps) {
  return <DialogPrimitive.Root {...props} />
}

/** Botón que abre el panel. Usa `asChild` con un `Button`. */
export const DrawerTrigger = DialogPrimitive.Trigger

/** Cierra el panel al pulsarlo. */
export const DrawerClose = DialogPrimitive.Close

export type DrawerContentProps = Omit<DialogPrimitive.DialogContentProps, 'title'> &
  PanelOwnProps & {
    /** Lado desde el que aparece. @default 'right' */
    side?: 'right' | 'left' | 'bottom' | 'top'
    /**
     * Ancho (o alto, en `top`/`bottom`): `sm` (20rem), `md` (28rem), `lg` (36rem) o `full`.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg' | 'full'
  }

/** Contenido del panel lateral. */
export function DrawerContent({ side = 'right', size = 'md', ...props }: DrawerContentProps) {
  return <Panel kind="drawer" side={side} size={size} {...props} />
}

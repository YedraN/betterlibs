'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Panel, type PanelOwnProps } from './panel'

export type DialogProps = DialogPrimitive.DialogProps
export type DialogTriggerProps = DialogPrimitive.DialogTriggerProps
export type DialogCloseProps = DialogPrimitive.DialogCloseProps

/**
 * Ventana modal. Atrapa el foco, bloquea el scroll de la página, se cierra con Escape y devuelve
 * el foco al botón que la abrió.
 *
 * Úsala con moderación: interrumpe. Para información secundaria, un `Popover`; para contenido
 * largo o navegación lateral, un `Drawer`.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild><Button>Solicitar demo</Button></DialogTrigger>
 *   <DialogContent title="Solicitar demo" description="Te llamamos en 24 horas.">…</DialogContent>
 * </Dialog>
 */
export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root {...props} />
}

/** Botón que abre el diálogo. Usa `asChild` con un `Button`. */
export const DialogTrigger = DialogPrimitive.Trigger

/** Cierra el diálogo al pulsarlo. Usa `asChild` con un `Button` («Cancelar»). */
export const DialogClose = DialogPrimitive.Close

export type DialogContentProps = Omit<DialogPrimitive.DialogContentProps, 'title'> &
  PanelOwnProps & {
    /**
     * Ancho máximo: `sm` (24rem, confirmaciones), `md` (32rem), `lg` (44rem, formularios),
     * `xl` (60rem) o `full` (casi toda la pantalla).
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }

/** Contenido del diálogo: título, descripción, cuerpo con scroll y pie de acciones. */
export function DialogContent({ size = 'md', ...props }: DialogContentProps) {
  return <Panel kind="dialog" size={size} {...props} />
}

import type { ReactNode } from 'react'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export type ToastAction = {
  /** Texto del botón («Deshacer», «Ver»). */
  label: string
  onClick: () => void
  /**
   * Cómo hacer lo mismo sin la notificación, para lectores de pantalla: la notificación puede
   * desaparecer antes de llegar al botón. @default label
   */
  altText?: string
}

export type ToastOptions = {
  title: ReactNode
  description?: ReactNode
  /** @default 'info' */
  tone?: ToastTone
  /**
   * Milisegundos antes de cerrarse. Por defecto, el del `Toaster` (6 s) o sin límite si tiene
   * acción. Se pausa al pasar el ratón, al enfocarla o si la ventana pierde el foco.
   */
  duration?: number
  action?: ToastAction
  /** Identificador propio para actualizar o cerrar una notificación concreta. */
  id?: string
}

export type ToastRecord = ToastOptions & { id: string; tone: ToastTone; open: boolean }

const MAX_VISIBLE = 4
const EXIT_DELAY = 400
const empty: ToastRecord[] = []

let records: ToastRecord[] = empty
let counter = 0
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getSnapshot = () => records
export const getServerSnapshot = () => empty

function dismiss(id?: string) {
  const closing = records.filter((record) => record.open && (id === undefined || record.id === id))
  if (closing.length === 0) return
  records = records.map((record) =>
    closing.includes(record) ? { ...record, open: false } : record,
  )
  emit()
  // Se retira del estado cuando ha terminado la animación de salida.
  setTimeout(() => {
    records = records.filter((record) => !closing.some((item) => item.id === record.id))
    emit()
  }, EXIT_DELAY)
}

function show(options: ToastOptions | string): string {
  const normalized = typeof options === 'string' ? { title: options } : options
  const id = normalized.id ?? `bl-toast-${++counter}`
  const record: ToastRecord = { tone: 'info', ...normalized, id, open: true }
  const exists = records.some((item) => item.id === id)
  records = exists ? records.map((item) => (item.id === id ? record : item)) : [...records, record]
  emit()
  const open = records.filter((item) => item.open)
  if (open.length > MAX_VISIBLE) dismiss(open[0]?.id)
  return id
}

type ShortcutOptions = Omit<ToastOptions, 'title' | 'tone'>

/**
 * Muestra una notificación temporal. Requiere un `<Toaster />` montado una vez en la app.
 *
 * @example
 * toast.success('Cambios guardados')
 * toast({ title: 'Artículo archivado', action: { label: 'Deshacer', onClick: restaurar } })
 * const id = toast('Subiendo archivo…'); toast.dismiss(id)
 */
export const toast = Object.assign(show, {
  info: (title: ReactNode, options?: ShortcutOptions) => show({ ...options, title, tone: 'info' }),
  success: (title: ReactNode, options?: ShortcutOptions) =>
    show({ ...options, title, tone: 'success' }),
  warning: (title: ReactNode, options?: ShortcutOptions) =>
    show({ ...options, title, tone: 'warning' }),
  error: (title: ReactNode, options?: ShortcutOptions) =>
    show({ ...options, title, tone: 'danger' }),
  /** Cierra una notificación por su `id`, o todas si no se indica. */
  dismiss,
})

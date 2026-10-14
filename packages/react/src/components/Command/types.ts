import type { ComponentPropsWithRef, ReactNode } from 'react'

export type CommandItem = {
  /** Identificador único y estable de la acción. */
  id: string
  /** Nombre visible y accesible de la acción. */
  label: string
  /** Contexto breve que se anuncia junto al nombre. */
  description?: string
  /** Términos adicionales para encontrar la acción. */
  keywords?: string[]
  /** Agrupa acciones relacionadas. */
  group?: string
  /** Mantiene la acción visible sin permitir ejecutarla. */
  disabled?: boolean
  /** Icono decorativo. */
  icon?: ReactNode
  /** Ayuda visual; no registra un atajo de teclado. */
  shortcut?: string
}

export type CommandProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'onSelect'> & {
  /** Acciones disponibles, con identificadores únicos. No admite contenido interactivo anidado. */
  items: CommandItem[]
  /** Ejecuta la acción elegida mediante Enter o puntero. El consumidor gestiona su resultado. */
  onSelect: (item: CommandItem) => void
  /** Nombre accesible del buscador. @default 'Buscar acciones' */
  label?: string
  /** Texto del campo vacío. @default 'Escribe una acción…' */
  placeholder?: string
  /** Búsqueda controlada; si se omite, el componente conserva su búsqueda. */
  query?: string
  /** Notifica cambios de búsqueda; útil para consultar resultados remotos. */
  onQueryChange?: (query: string) => void
  /** Suspende la navegación y ejecución mientras llegan las acciones. @default false */
  loading?: boolean
  /** Mensaje de carga. @default 'Buscando acciones…' */
  loadingText?: string
  /** Mensaje cuando no hay coincidencias. @default 'No hay acciones que coincidan. Prueba otra búsqueda.' */
  emptyText?: string
  /** Filtra por nombre, descripción, grupo y keywords, sin distinguir tildes. @default true */
  filter?: boolean
  /** Identificadores de acciones recientes, en orden; aparecen al abrir sin búsqueda. */
  recentIds?: string[]
  /** Nombre del grupo de acciones recientes. @default 'Recientes' */
  recentLabel?: string
  /** Mensaje de error. Suspende la ejecución de resultados obsoletos. */
  error?: string
  /** Reintenta la búsqueda fallida. */
  onRetry?: () => void
  /** Texto de reintento. @default 'Volver a intentar' */
  retryLabel?: string
  /** Ayuda de teclado personalizable. */
  hint?: string
}

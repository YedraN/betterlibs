import { CloseIcon } from '@betterlibs/icons'
import { Slot, Slottable } from '@radix-ui/react-slot'
import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { cx } from '../../utils/cx'
import styles from './Tag.module.css'

export type TagProps = ComponentPropsWithRef<'span'> & {
  /** @default 'md' */
  size?: 'sm' | 'md'
  /** Marca la etiqueta como seleccionada (filtros activos). */
  selected?: boolean
  /** Muestra un botón para quitar la etiqueta (p. ej. filtros aplicados). */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  /**
   * Nombre accesible del botón de quitar. Por defecto «Quitar {texto}» si el contenido es texto.
   */
  removeLabel?: string
  /**
   * Convierte la etiqueta en un enlace o botón (categorías de un blog, filtros).
   * @example <Tag asChild><a href="/blog/fiscalidad">Fiscalidad</a></Tag>
   */
  asChild?: boolean
}

/** Etiqueta de categoría o palabra clave. Puede ser enlace (`asChild`) o eliminable (`onRemove`). */
export function Tag({
  size = 'md',
  selected = false,
  onRemove,
  removeLabel,
  asChild = false,
  className,
  children,
  ...props
}: TagProps) {
  const Component = asChild ? Slot : 'span'
  const label = removeLabel ?? (typeof children === 'string' ? `Quitar ${children}` : 'Quitar')
  return (
    <Component
      className={cx(styles.root, className)}
      data-size={size}
      data-selected={selected || undefined}
      data-removable={onRemove ? '' : undefined}
      {...props}
    >
      <Slottable>{children}</Slottable>
      {onRemove && (
        <button type="button" className={styles.remove} aria-label={label} onClick={onRemove}>
          <CloseIcon aria-hidden="true" />
        </button>
      )}
    </Component>
  )
}

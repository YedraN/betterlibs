'use client'

import { type ChangeEvent, type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { cx } from '../../utils/cx'
import { FieldDescription, hasContent, joinIds } from '../Field/parts'
import styles from './Switch.module.css'

export type SwitchProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'role'> & {
  /** Qué se activa: «Recibir el boletín mensual». */
  label: ReactNode
  /** Ayuda bajo el texto. */
  description?: ReactNode
  /** @default 'md' */
  size?: 'sm' | 'md'
  /** Etiqueta antes (`start`, típico en listas de ajustes) o después del interruptor. @default 'end' */
  labelPosition?: 'start' | 'end'
  /** Callback con el nuevo estado. */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Interruptor para activar o desactivar algo con efecto inmediato (preferencias, cookies).
 * Si el cambio solo se aplica al enviar un formulario, usa un `Checkbox`.
 * Es un `<input type="checkbox" role="switch">`: funciona en formularios nativos.
 */
export function Switch({
  label,
  description,
  size = 'md',
  labelPosition = 'end',
  onCheckedChange,
  onChange,
  className,
  style,
  id,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = hasContent(description) ? `${inputId}-description` : undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    onCheckedChange?.(event.target.checked)
  }

  return (
    <div
      className={cx(styles.root, className)}
      style={style}
      data-size={size}
      data-label-position={labelPosition}
      data-disabled={disabled || undefined}
    >
      <span className={styles.control}>
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          disabled={disabled}
          className={styles.input}
          aria-describedby={joinIds(descriptionId, ariaDescribedBy)}
          onChange={handleChange}
          {...props}
        />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      <span className={styles.body}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        {descriptionId && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      </span>
    </div>
  )
}

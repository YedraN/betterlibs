'use client'

import { type ChangeEvent, type ComponentPropsWithRef, useEffect, useId, useState } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars } from '../../utils/types'
import controlStyles from '../Field/Control.module.css'
import { joinIds } from '../Field/parts'
import { useFieldControl } from '../Field/use-field-control'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './Textarea.module.css'

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  /** Marca el campo con error. Dentro de un `Field` se deduce de su `error`. */
  invalid?: boolean
  /** Filas visibles. Ajústalas a la respuesta esperada: el tamaño sugiere cuánto escribir. @default 4 */
  rows?: number
  /** @default 'vertical' */
  resize?: 'vertical' | 'none'
  /** Crece con el contenido (en navegadores con `field-sizing`). */
  autoResize?: boolean
  /** Muestra un contador de caracteres. Requiere `maxLength`. */
  showCount?: boolean
  /** Texto accesible del límite. @default (max) => `Máximo ${max} caracteres.` */
  maxLengthLabel?: (max: number) => string
  /** Aviso para lectores de pantalla al acercarse al límite. @default (n) => `Te quedan ${n} caracteres.` */
  remainingLabel?: (remaining: number) => string
}

const ANNOUNCE_DELAY = 1000
const ANNOUNCE_FROM = 0.8

/**
 * Campo de texto de varias líneas. Con `showCount` y `maxLength` muestra un contador y avisa a
 * los lectores de pantalla (solo al acercarse al límite y cuando se deja de escribir).
 */
export function Textarea({
  invalid: invalidProp,
  rows = 4,
  resize = 'vertical',
  autoResize = false,
  showCount = false,
  maxLengthLabel = (max) => `Máximo ${max} caracteres.`,
  remainingLabel = (n) => `Te quedan ${n} caracteres.`,
  maxLength,
  value,
  defaultValue,
  onChange,
  className,
  style,
  id,
  name,
  required,
  disabled,
  readOnly,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextareaProps) {
  const countId = useId()
  const counting = showCount && maxLength !== undefined
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? '').length,
  )
  const length = value !== undefined ? String(value).length : uncontrolledLength
  const [announcement, setAnnouncement] = useState('')

  const { invalid, success, controlProps } = useFieldControl({
    id,
    name,
    required,
    disabled,
    readOnly,
    invalid: invalidProp,
    'aria-describedby': joinIds(ariaDescribedBy, counting && `${countId}-hint`),
    'aria-invalid': ariaInvalid,
  })

  // Anuncia lo que queda solo cuando se deja de escribir y cerca del límite, para no saturar.
  useEffect(() => {
    if (!counting || maxLength === undefined) return
    if (length < maxLength * ANNOUNCE_FROM) {
      setAnnouncement('')
      return
    }
    const timer = setTimeout(
      () => setAnnouncement(remainingLabel(Math.max(maxLength - length, 0))),
      ANNOUNCE_DELAY,
    )
    return () => clearTimeout(timer)
  }, [counting, length, maxLength, remainingLabel])

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUncontrolledLength(event.target.value.length)
    onChange?.(event)
  }

  const textarea = (
    <textarea
      rows={rows}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={cx(controlStyles.box, styles.textarea, !counting && className)}
      style={{
        ...(autoResize ? ({ '--_rows': rows } as CSSVars) : {}),
        ...(counting ? {} : style),
      }}
      data-resize={resize}
      data-auto-resize={autoResize || undefined}
      data-invalid={invalid || undefined}
      data-success={success || undefined}
      data-disabled={controlProps.disabled || undefined}
      data-readonly={controlProps.readOnly || undefined}
      {...controlProps}
      {...props}
    />
  )

  if (!counting || maxLength === undefined) return textarea

  return (
    <div className={cx(styles.root, className)} style={style}>
      {textarea}
      <div
        className={styles.count}
        data-limit={length >= maxLength || undefined}
        aria-hidden="true"
      >
        {length}/{maxLength}
      </div>
      <VisuallyHidden id={`${countId}-hint`}>{maxLengthLabel(maxLength)}</VisuallyHidden>
      <VisuallyHidden aria-live="polite">{announcement}</VisuallyHidden>
    </div>
  )
}

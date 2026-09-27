'use client'

import { ChevronDownIcon } from '@betterlibs/icons'
import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import controlStyles from '../Field/Control.module.css'
import { useFieldControl } from '../Field/use-field-control'
import styles from './Select.module.css'

export type SelectOption = { value: string; label: string; disabled?: boolean }
export type SelectOptionGroup = { label: string; options: SelectOption[] }

export type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'size'> & {
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Marca el campo con error. Dentro de un `Field` se deduce de su `error`. */
  invalid?: boolean
  /**
   * Primera opción vacía («Selecciona una opción»). En campos obligatorios no se puede volver
   * a elegir y hace que la validación exija una opción real.
   */
  placeholder?: string
  /** Opciones como datos. Alternativa a pasar `<option>` como hijos. */
  options?: (SelectOption | SelectOptionGroup)[]
  /** Atributo `size` nativo (filas visibles). */
  htmlSize?: number
}

/**
 * Desplegable nativo con estilos del sistema. Lo nativo es la opción más accesible y la que
 * mejor funciona en móvil. Si hay menos de 5 opciones, considera un `RadioGroup`: se ven todas
 * sin abrir nada.
 */
export function Select({
  size = 'md',
  invalid: invalidProp,
  placeholder,
  options,
  htmlSize,
  className,
  style,
  children,
  value,
  defaultValue,
  multiple,
  id,
  name,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: SelectProps) {
  const { invalid, success, controlProps } = useFieldControl({
    id,
    name,
    required,
    disabled,
    invalid: invalidProp,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  })
  const showPlaceholder = placeholder !== undefined && !multiple
  // Sin valor inicial, el marcador queda seleccionado en vez de la primera opción real.
  const initialValue =
    value === undefined && defaultValue === undefined && showPlaceholder ? '' : defaultValue

  return (
    <div
      className={cx(controlStyles.box, styles.root, className)}
      style={style}
      data-size={size}
      data-multiple={multiple || undefined}
      data-invalid={invalid || undefined}
      data-success={success || undefined}
      data-disabled={controlProps.disabled || undefined}
    >
      <select
        className={cx(controlStyles.field, styles.select)}
        value={value}
        defaultValue={initialValue}
        multiple={multiple}
        size={htmlSize}
        {...controlProps}
        {...props}
      >
        {showPlaceholder && (
          <option value="" disabled={Boolean(controlProps.required)}>
            {placeholder}
          </option>
        )}
        {options?.map((option) =>
          'options' in option ? (
            <optgroup key={option.label} label={option.label}>
              {option.options.map((item) => (
                <option key={item.value} value={item.value} disabled={item.disabled}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ),
        )}
        {children}
      </select>
      {!multiple && <ChevronDownIcon className={styles.chevron} aria-hidden="true" />}
    </div>
  )
}

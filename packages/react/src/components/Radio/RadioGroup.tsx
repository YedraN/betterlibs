'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  createContext,
  type ReactNode,
  useContext,
  useId,
} from 'react'
import { cx } from '../../utils/cx'
import type { ChoiceVariant } from '../Checkbox/Checkbox'
import styles from '../Checkbox/Choice.module.css'
import { FormContext } from '../Field/context'
import { FieldDescription, hasContent, joinIds } from '../Field/parts'
import { Fieldset, type FieldsetProps } from '../Fieldset/Fieldset'

type RadioGroupContextValue = {
  name: string
  value?: string
  defaultValue?: string
  required?: boolean
  invalid: boolean
  variant: ChoiceVariant
  onValueChange?: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export type RadioGroupProps = Omit<FieldsetProps, 'legend' | 'onChange' | 'defaultValue'> & {
  /** Pregunta del grupo: «¿Cómo prefieres que te contactemos?». */
  label: ReactNode
  /** `name` de los radios. Por defecto se genera uno. */
  name?: string
  /** Valor seleccionado (controlado). */
  value?: string
  /** Valor inicial (no controlado). */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Exige elegir una opción. */
  required?: boolean
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal'
  /** `card`: cada opción en una tarjeta clicable (planes, tipos de consulta). @default 'default' */
  variant?: ChoiceVariant
}

/**
 * Grupo de opciones excluyentes. Las flechas del teclado cambian la selección dentro del grupo
 * (comportamiento nativo). Para más de 6-7 opciones, usa un `Select`.
 *
 * @example
 * <RadioGroup label="¿Cómo prefieres que te contactemos?" name="canal" defaultValue="email">
 *   <Radio value="email" label="Por email" />
 *   <Radio value="telefono" label="Por teléfono" />
 * </RadioGroup>
 */
export function RadioGroup({
  label,
  name,
  value,
  defaultValue,
  onValueChange,
  error,
  required,
  orientation = 'vertical',
  variant = 'default',
  children,
  ...props
}: RadioGroupProps) {
  const form = useContext(FormContext)
  const generatedName = useId()
  const resolvedName = name ?? generatedName
  const errorMessage = hasContent(error) ? error : name ? form?.errors[name] : undefined
  const invalid = hasContent(errorMessage)
  return (
    <Fieldset
      legend={label}
      error={errorMessage}
      required={required}
      role="radiogroup"
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      data-bl-group="radio"
      {...props}
    >
      <RadioGroupContext.Provider
        value={{
          name: resolvedName,
          value,
          defaultValue,
          required,
          invalid,
          variant,
          onValueChange,
        }}
      >
        <div className={styles.options} data-orientation={orientation} data-variant={variant}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    </Fieldset>
  )
}

export type RadioProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'size' | 'name' | 'checked' | 'defaultChecked'
> & {
  value: string
  label: ReactNode
  /** Ayuda bajo el texto de la opción. */
  description?: ReactNode
}

/** Opción de un `RadioGroup`. */
export function Radio({
  value,
  label,
  description,
  className,
  style,
  id,
  disabled,
  onChange,
  'aria-describedby': ariaDescribedBy,
  ...props
}: RadioProps) {
  const group = useContext(RadioGroupContext)
  if (!group) throw new Error('<Radio> debe usarse dentro de un <RadioGroup>.')
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = hasContent(description) ? `${inputId}-description` : undefined
  const controlled = group.value !== undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    if (event.target.checked) group.onValueChange?.(value)
  }

  return (
    <div
      className={cx(styles.root, className)}
      style={style}
      data-variant={group.variant}
      data-invalid={group.invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <span className={styles.control}>
        <input
          type="radio"
          id={inputId}
          name={group.name}
          value={value}
          required={group.required}
          disabled={disabled}
          className={styles.input}
          aria-describedby={joinIds(descriptionId, ariaDescribedBy)}
          {...(controlled
            ? { checked: group.value === value }
            : { defaultChecked: group.defaultValue === value })}
          onChange={handleChange}
          {...props}
        />
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

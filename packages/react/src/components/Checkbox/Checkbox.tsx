'use client'

import { CheckIcon, MinusIcon } from '@betterlibs/icons'
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
} from 'react'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/merge-refs'
import { type FieldIndicator, FormContext } from '../Field/context'
import {
  FieldDescription,
  FieldMessage,
  hasContent,
  joinIds,
  LabelText,
  useIndicator,
} from '../Field/parts'
import { Fieldset, type FieldsetProps } from '../Fieldset/Fieldset'
import styles from './Choice.module.css'

export type ChoiceVariant = 'default' | 'card'

type CheckboxGroupContextValue = {
  name?: string
  invalid: boolean
  variant: ChoiceVariant
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
  /** Texto de la casilla. Puede incluir enlaces («Acepto la <a>política de privacidad</a>»). */
  label: ReactNode
  /** Ayuda bajo el texto. */
  description?: ReactNode
  /** Mensaje de error (casillas sueltas, como aceptar condiciones). */
  error?: ReactNode
  /** Marca el control con error sin mensaje. */
  invalid?: boolean
  /** Estado mixto («algunos seleccionados»), p. ej. en «Seleccionar todo». */
  indeterminate?: boolean
  /** Callback con el nuevo estado. */
  onCheckedChange?: (checked: boolean) => void
  /** `card`: opción dentro de una tarjeta clicable. Por defecto, la del grupo. */
  variant?: ChoiceVariant
  indicator?: FieldIndicator
}

/**
 * Casilla de verificación con etiqueta clicable. Suelta, para confirmaciones («Acepto…»);
 * dentro de un `CheckboxGroup`, para elegir varias opciones de una lista.
 */
export function Checkbox({
  label,
  description,
  error,
  invalid: invalidProp,
  indeterminate = false,
  onCheckedChange,
  onChange,
  variant: variantProp,
  indicator: indicatorProp,
  className,
  style,
  ref,
  id,
  name,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const group = useContext(CheckboxGroupContext)
  const form = useContext(FormContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const { indicator, optionalLabel } = useIndicator(indicatorProp)
  const inputId = id ?? generatedId
  const resolvedName = name ?? group?.name
  // En un grupo, el error es del grupo; suelta, la casilla busca el suyo en el `Form`.
  const formError = !group && resolvedName ? form?.errors[resolvedName] : undefined
  const errorMessage = hasContent(error) ? error : formError
  const hasError = hasContent(errorMessage)
  const invalid = invalidProp ?? (hasError || Boolean(group?.invalid))
  const descriptionId = hasContent(description) ? `${inputId}-description` : undefined
  const errorId = hasError ? `${inputId}-error` : undefined

  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    onCheckedChange?.(event.target.checked)
  }

  return (
    <div
      className={cx(styles.root, className)}
      style={style}
      data-variant={variantProp ?? group?.variant ?? 'default'}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
    >
      <span className={styles.control}>
        <input
          ref={mergeRefs(inputRef, ref)}
          type="checkbox"
          id={inputId}
          name={resolvedName}
          required={required}
          disabled={disabled}
          className={styles.input}
          aria-describedby={joinIds(descriptionId, errorId, ariaDescribedBy)}
          aria-invalid={(!group && invalid) || undefined}
          onChange={handleChange}
          {...props}
        />
        <CheckIcon className={styles.check} aria-hidden="true" />
        <MinusIcon className={styles.dash} aria-hidden="true" />
      </span>
      <span className={styles.body}>
        <label htmlFor={inputId} className={styles.label}>
          <LabelText
            required={!group && required}
            indicator={group ? 'none' : indicator}
            optionalLabel={optionalLabel}
          >
            {label}
          </LabelText>
        </label>
        {descriptionId && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
        {errorId && (
          <FieldMessage id={errorId} tone="error">
            {errorMessage}
          </FieldMessage>
        )}
      </span>
    </div>
  )
}

export type CheckboxGroupProps = Omit<FieldsetProps, 'legend'> & {
  /** Pregunta o título del grupo. */
  label: ReactNode
  /** `name` compartido por todas las casillas: el valor llega como lista (`formData.getAll`). */
  name?: string
  /**
   * Exige al menos una opción marcada. El `Form` lo valida; las casillas no llevan `required`
   * individual (obligaría a marcarlas todas).
   */
  required?: boolean
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal'
  /** `card`: cada opción en una tarjeta clicable. @default 'default' */
  variant?: ChoiceVariant
}

/**
 * Grupo de casillas con leyenda común (`<fieldset>`), para elegir varias opciones.
 * @example
 * <CheckboxGroup label="¿Qué servicios te interesan?" name="servicios">
 *   <Checkbox value="web" label="Diseño web" />
 *   <Checkbox value="seo" label="Posicionamiento SEO" />
 * </CheckboxGroup>
 */
export function CheckboxGroup({
  label,
  name,
  error,
  required,
  orientation = 'vertical',
  variant = 'default',
  children,
  ...props
}: CheckboxGroupProps) {
  const form = useContext(FormContext)
  const errorMessage = hasContent(error) ? error : name ? form?.errors[name] : undefined
  const invalid = hasContent(errorMessage)
  return (
    <Fieldset
      legend={label}
      error={errorMessage}
      required={required}
      data-bl-group="checkbox"
      data-bl-name={name}
      data-required={required || undefined}
      {...props}
    >
      <CheckboxGroupContext.Provider value={{ name, invalid, variant }}>
        <div className={styles.options} data-orientation={orientation} data-variant={variant}>
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    </Fieldset>
  )
}

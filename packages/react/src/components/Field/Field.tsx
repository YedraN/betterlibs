'use client'

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import vhStyles from '../VisuallyHidden/VisuallyHidden.module.css'
import { FieldContext, type FieldContextValue, type FieldIndicator, FormContext } from './context'
import styles from './Field.module.css'
import { FieldDescription, FieldMessage, hasContent, LabelText, useIndicator } from './parts'

export type FieldProps = Omit<ComponentPropsWithRef<'div'>, 'id' | 'children'> & {
  /** Etiqueta visible. Describe el dato que se pide: «Email de trabajo», no «Introduce aquí». */
  label: ReactNode
  /** Ayuda bajo la etiqueta: formato esperado, para qué se usa el dato… */
  description?: ReactNode
  /**
   * Mensaje de error. Explica cómo corregirlo: «Introduce un email, como nombre@empresa.com».
   * Dentro de un `Form` se rellena solo con la validación.
   */
  error?: ReactNode
  /** Mensaje de confirmación (p. ej. «Código válido»). Se ignora si hay error. */
  success?: ReactNode
  /** `name` del control. Se pasa al control y sirve para encontrar su error en el `Form`. */
  name?: string
  /** `id` del control. Por defecto se genera uno. */
  id?: string
  /** Marca el control como obligatorio (`required`). */
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  /** Marca de obligatorio/opcional. Por defecto, la del `Form` o `'required'`. */
  indicator?: FieldIndicator
  /** Texto para los campos opcionales. @default '(opcional)' */
  optionalLabel?: string
  /**
   * Oculta la etiqueta a la vista pero la mantiene para lectores de pantalla. Solo para casos
   * en los que el contexto es evidente (un buscador con botón «Buscar»).
   */
  hideLabel?: boolean
  /** El control: `Input`, `Textarea`, `Select`, `FileInput` o uno propio con `useFieldControl`. */
  children: ReactNode
}

/**
 * Envuelve un control con su etiqueta, ayuda y mensaje de error, y los enlaza con
 * `htmlFor` y `aria-describedby` para que los lectores de pantalla lo anuncien todo junto.
 *
 * @example
 * <Field label="Email" name="email" description="Te responderemos aquí." required>
 *   <Input type="email" autoComplete="email" />
 * </Field>
 */
export function Field({
  label,
  description,
  error,
  success,
  name,
  id,
  required,
  disabled,
  readOnly,
  indicator: indicatorProp,
  optionalLabel: optionalLabelProp,
  hideLabel = false,
  className,
  children,
  ...props
}: FieldProps) {
  const form = useContext(FormContext)
  const generatedId = useId()
  const controlId = id ?? `${generatedId}-control`
  const [controlName, setControlName] = useState<string>()
  const registerName = useCallback((value: string | undefined) => setControlName(value), [])
  const { indicator, optionalLabel } = useIndicator(indicatorProp, optionalLabelProp)

  const resolvedName = name ?? controlName
  const formError = resolvedName ? form?.errors[resolvedName] : undefined
  const errorMessage = hasContent(error) ? error : formError
  const invalid = hasContent(errorMessage)
  const showSuccess = !invalid && hasContent(success)
  const descriptionId = hasContent(description) ? `${generatedId}-description` : undefined
  const messageId = invalid || showSuccess ? `${generatedId}-message` : undefined

  const context = useMemo<FieldContextValue>(
    () => ({
      id: controlId,
      name,
      descriptionId,
      messageId,
      invalid,
      success: showSuccess,
      required,
      disabled,
      readOnly,
      registerName,
    }),
    [
      controlId,
      name,
      descriptionId,
      messageId,
      invalid,
      showSuccess,
      required,
      disabled,
      readOnly,
      registerName,
    ],
  )

  return (
    <div
      className={cx(styles.root, className)}
      data-bl-field=""
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      {...props}
    >
      <label htmlFor={controlId} className={cx(styles.label, hideLabel && vhStyles.root)}>
        <LabelText required={required} indicator={indicator} optionalLabel={optionalLabel}>
          {label}
        </LabelText>
      </label>
      {descriptionId && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {invalid && (
        <FieldMessage id={messageId} tone="error">
          {errorMessage}
        </FieldMessage>
      )}
      {showSuccess && (
        <FieldMessage id={messageId} tone="success">
          {success}
        </FieldMessage>
      )}
      <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
    </div>
  )
}

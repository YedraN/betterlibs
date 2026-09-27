'use client'

import { type AriaAttributes, useContext, useEffect, useId } from 'react'
import { FieldContext, FormContext } from './context'
import { joinIds } from './parts'

export type FieldControlOptions = {
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  /** Fuerza el estado de error del control. */
  invalid?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

/**
 * Conecta un control con el `Field` que lo rodea (y con el `Form`): `id`, `name`, `required`,
 * `aria-describedby` con la ayuda y el error, `aria-invalid`…
 *
 * Úsalo para integrar controles propios o de terceros (un selector de fechas, por ejemplo)
 * con la misma accesibilidad que `Input`.
 *
 * @example
 * function DatePicker(props) {
 *   const { controlProps } = useFieldControl(props)
 *   return <ThirdPartyDatePicker {...props} {...controlProps} />
 * }
 */
export function useFieldControl(options: FieldControlOptions) {
  const field = useContext(FieldContext)
  const form = useContext(FormContext)
  const fallbackId = useId()
  const name = options.name ?? field?.name
  const registerName = field?.registerName

  useEffect(() => {
    registerName?.(options.name)
  }, [registerName, options.name])

  // Dentro de un `Field` el error lo pinta el campo; fuera, el control solo se marca en rojo.
  const formError = !field && name ? form?.errors[name] : undefined
  const ariaInvalid = options['aria-invalid']
  const invalid =
    options.invalid ??
    Boolean(
      ariaInvalid === true ||
        ariaInvalid === 'true' ||
        field?.invalid ||
        (formError !== undefined && formError !== null && formError !== false),
    )

  return {
    invalid,
    success: !invalid && Boolean(field?.success),
    controlProps: {
      id: options.id ?? field?.id ?? fallbackId,
      name,
      required: options.required ?? field?.required,
      disabled: options.disabled ?? field?.disabled,
      readOnly: options.readOnly ?? field?.readOnly,
      'aria-describedby': joinIds(
        field?.descriptionId,
        field?.messageId,
        options['aria-describedby'],
      ),
      'aria-invalid': invalid || undefined,
    },
  }
}

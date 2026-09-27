'use client'

import { createContext, type ReactNode } from 'react'

/**
 * Qué campos llevan marca en la etiqueta:
 * - `required`: los obligatorios muestran un asterisco (los lectores de pantalla ya anuncian
 *   «obligatorio» gracias al atributo `required`).
 * - `optional`: los opcionales muestran «(opcional)». Recomendado cuando casi todo es obligatorio.
 * - `none`: sin marcas.
 */
export type FieldIndicator = 'required' | 'optional' | 'none'

export type FieldContextValue = {
  /** `id` del control; la etiqueta apunta a él con `htmlFor`. */
  id: string
  name?: string
  descriptionId?: string
  /** `id` del mensaje de error o de éxito visible. */
  messageId?: string
  invalid: boolean
  success: boolean
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  /** El control informa de su `name` para que el campo encuentre su error en el `Form`. */
  registerName: (name: string | undefined) => void
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export type FormContextValue = {
  /** Errores visibles por `name` (validación del navegador, `validate` y errores del servidor). */
  errors: Record<string, ReactNode>
  indicator: FieldIndicator
  optionalLabel: string
  errorPrefix: string
}

export const FormContext = createContext<FormContextValue | null>(null)

export const defaultIndicator: FieldIndicator = 'required'
export const defaultOptionalLabel = '(opcional)'
export const defaultErrorPrefix = 'Error:'

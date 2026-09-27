import type { ReactNode } from 'react'

/** Errores por `name` del campo. `undefined`, `null`, `false` o `''` significan «sin error». */
export type FormErrors = Record<string, ReactNode>

export type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

type MessageFn = (element: FormControl) => string

/** Mensajes de la validación nativa. Cada uno recibe el control para personalizar el texto. */
export type ValidationMessages = {
  valueMissing: MessageFn
  typeMismatch: MessageFn
  tooShort: MessageFn
  tooLong: MessageFn
  patternMismatch: MessageFn
  rangeUnderflow: MessageFn
  rangeOverflow: MessageFn
  stepMismatch: MessageFn
  badInput: MessageFn
  /** Grupo de casillas obligatorio sin ninguna marcada. */
  groupMissing: () => string
}

const attr = (element: FormControl, name: string) => element.getAttribute(name) ?? ''

/**
 * Mensajes por defecto, en español y orientados a la solución («Introduce…», «Selecciona…»)
 * en vez de al problema («Campo inválido»).
 */
export const defaultValidationMessages: ValidationMessages = {
  valueMissing: (element) => {
    if (element instanceof HTMLSelectElement) return 'Selecciona una opción'
    switch (element.type) {
      case 'checkbox':
        return 'Marca esta casilla para continuar'
      case 'radio':
        return 'Selecciona una opción'
      case 'file':
        return 'Selecciona un archivo'
      case 'email':
        return 'Introduce tu email'
      case 'tel':
        return 'Introduce un número de teléfono'
      default:
        return 'Este campo es obligatorio'
    }
  },
  typeMismatch: (element) => {
    if (element.type === 'email') return 'Introduce un email válido, como nombre@empresa.com'
    if (element.type === 'url')
      return 'Introduce una dirección web válida, como https://empresa.com'
    return 'El formato no es válido'
  },
  tooShort: (element) => `Escribe al menos ${attr(element, 'minlength')} caracteres`,
  tooLong: (element) => `Escribe como máximo ${attr(element, 'maxlength')} caracteres`,
  patternMismatch: (element) => element.title || 'El formato no es válido',
  rangeUnderflow: (element) => `Introduce un valor igual o superior a ${attr(element, 'min')}`,
  rangeOverflow: (element) => `Introduce un valor igual o inferior a ${attr(element, 'max')}`,
  stepMismatch: () => 'Introduce un valor válido',
  badInput: (element) => {
    if (element.type === 'number') return 'Introduce un número'
    if (element.type === 'date') return 'Introduce una fecha válida'
    return 'El valor no es válido'
  },
  groupMissing: () => 'Selecciona al menos una opción',
}

const validityKeys = [
  'valueMissing',
  'typeMismatch',
  'badInput',
  'tooShort',
  'tooLong',
  'patternMismatch',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
] as const

export function isFormControl(element: unknown): element is FormControl {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  )
}

function isValidatable(element: Element): element is FormControl {
  return (
    isFormControl(element) &&
    Boolean(element.name) &&
    !element.disabled &&
    element.willValidate &&
    !['submit', 'button', 'reset', 'image', 'hidden'].includes(element.type)
  )
}

/** Mensaje de error de un control según su `validity`, o `undefined` si es válido. */
export function getValidationMessage(
  element: FormControl,
  messages: ValidationMessages,
): string | undefined {
  const { validity } = element
  if (validity.valid) return undefined
  if (validity.customError) return element.validationMessage
  for (const key of validityKeys) {
    if (validity[key]) return messages[key](element)
  }
  return element.validationMessage || undefined
}

/** Controles del formulario (en orden del DOM) que comparten `name`. */
export function getControlsByName(form: HTMLFormElement, name: string): FormControl[] {
  return Array.from(form.elements).filter(
    (element): element is FormControl => isFormControl(element) && element.name === name,
  )
}

function requiredCheckboxGroups(form: HTMLFormElement) {
  return Array.from(
    form.querySelectorAll<HTMLFieldSetElement>('[data-bl-group="checkbox"][data-required]'),
  ).filter((group) => !group.disabled && group.dataset.blName)
}

function checkboxGroupError(form: HTMLFormElement, name: string, messages: ValidationMessages) {
  const group = requiredCheckboxGroups(form).find((item) => item.dataset.blName === name)
  if (!group) return undefined
  const checked = getControlsByName(form, name).some(
    (element) => element instanceof HTMLInputElement && element.checked,
  )
  return checked ? undefined : messages.groupMissing()
}

/** Valida un campo (todos los controles con ese `name`). */
export function validateName(
  form: HTMLFormElement,
  name: string,
  messages: ValidationMessages,
): string | undefined {
  for (const element of getControlsByName(form, name)) {
    if (!isValidatable(element)) continue
    const message = getValidationMessage(element, messages)
    if (message) return message
  }
  return checkboxGroupError(form, name, messages)
}

/** Valida todo el formulario con la API de validación nativa. Un error por `name`. */
export function validateForm(form: HTMLFormElement, messages: ValidationMessages): FormErrors {
  const errors: FormErrors = {}
  for (const element of Array.from(form.elements)) {
    if (!isValidatable(element) || element.name in errors) continue
    const message = getValidationMessage(element, messages)
    if (message) errors[element.name] = message
  }
  for (const group of requiredCheckboxGroups(form)) {
    const name = group.dataset.blName
    if (!name || name in errors) continue
    const message = checkboxGroupError(form, name, messages)
    if (message) errors[name] = message
  }
  return errors
}

/** Quita las entradas vacías (`undefined`, `null`, `false`, `''`). */
export function compactErrors(errors: FormErrors | null | undefined): FormErrors {
  const result: FormErrors = {}
  if (!errors) return result
  for (const [name, message] of Object.entries(errors)) {
    if (message !== undefined && message !== null && message !== false && message !== '') {
      result[name] = message
    }
  }
  return result
}

/** Texto de la etiqueta de un control (o de la leyenda de su grupo), sin marcas de obligatorio. */
export function getControlLabel(element: FormControl): string | undefined {
  const group =
    element.type === 'radio' || element.closest('[data-bl-group]')
      ? element.closest('fieldset')
      : null
  const source = group ? group.querySelector('legend') : element.labels?.[0]
  if (!source) return element.getAttribute('aria-label') ?? undefined
  const text = source.querySelector('[data-bl-label-text]') ?? source
  return text.textContent?.trim() || undefined
}

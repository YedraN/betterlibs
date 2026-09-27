'use client'

import { AlertCircleIcon, CheckCircleIcon } from '@betterlibs/icons'
import { type ReactNode, useContext } from 'react'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import {
  defaultErrorPrefix,
  defaultIndicator,
  defaultOptionalLabel,
  type FieldIndicator,
  FormContext,
} from './context'
import styles from './Field.module.css'

/** Une `id`s para `aria-describedby` ignorando los vacíos. */
export function joinIds(...ids: (string | false | null | undefined)[]): string | undefined {
  const result = ids.filter(Boolean).join(' ')
  return result || undefined
}

/** Resuelve la marca de obligatorio/opcional: prop del campo → `Form` → valor por defecto. */
export function useIndicator(indicator?: FieldIndicator, optionalLabel?: string) {
  const form = useContext(FormContext)
  return {
    indicator: indicator ?? form?.indicator ?? defaultIndicator,
    optionalLabel: optionalLabel ?? form?.optionalLabel ?? defaultOptionalLabel,
  }
}

/**
 * Texto de una etiqueta o leyenda con su marca de obligatorio u opcional.
 * `data-bl-label-text` permite al `Form` leer la etiqueta limpia para el resumen de errores.
 */
export function LabelText({
  children,
  required,
  indicator,
  optionalLabel,
}: {
  children: ReactNode
  required?: boolean
  indicator: FieldIndicator
  optionalLabel: string
}) {
  return (
    <>
      <span data-bl-label-text="">{children}</span>
      {required && indicator === 'required' && (
        <>
          {' '}
          <span className={styles.indicator} data-required="" aria-hidden="true">
            *
          </span>
        </>
      )}
      {!required && indicator === 'optional' && (
        <>
          {' '}
          <span className={styles.indicator}>{optionalLabel}</span>
        </>
      )}
    </>
  )
}

/** Mensaje de error o de éxito de un campo, con icono y prefijo para lectores de pantalla. */
export function FieldMessage({
  id,
  tone,
  children,
}: {
  id?: string
  tone: 'error' | 'success'
  children: ReactNode
}) {
  const form = useContext(FormContext)
  const Icon = tone === 'error' ? AlertCircleIcon : CheckCircleIcon
  return (
    <div id={id} className={styles.message} data-tone={tone}>
      <Icon className={styles.messageIcon} aria-hidden="true" />
      <span>
        {tone === 'error' && (
          <VisuallyHidden>{`${form?.errorPrefix ?? defaultErrorPrefix} `}</VisuallyHidden>
        )}
        {children}
      </span>
    </div>
  )
}

/** Texto de ayuda bajo la etiqueta. */
export function FieldDescription({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div id={id} className={styles.description}>
      {children}
    </div>
  )
}

/** `true` si hay algo que mostrar (evita pintar mensajes vacíos con `false`, `null` o `''`). */
export function hasContent(node: ReactNode): boolean {
  return node !== undefined && node !== null && node !== false && node !== ''
}

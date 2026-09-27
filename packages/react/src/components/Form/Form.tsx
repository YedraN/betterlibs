'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/merge-refs'
import { ErrorSummary, type ErrorSummaryItem, focusControl } from '../ErrorSummary/ErrorSummary'
import {
  defaultErrorPrefix,
  defaultIndicator,
  defaultOptionalLabel,
  type FieldIndicator,
  FormContext,
  type FormContextValue,
} from '../Field/context'
import styles from './Form.module.css'
import {
  compactErrors,
  defaultValidationMessages,
  type FormErrors,
  getControlLabel,
  getControlsByName,
  isFormControl,
  type ValidationMessages,
  validateForm,
  validateName,
} from './validation'

export type FormProps = Omit<ComponentPropsWithRef<'form'>, 'onSubmit'> & {
  /** Se llama solo si el formulario es válido. Si hay errores, el envío se cancela. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  /** Se llama cuando el envío se cancela por errores. */
  onInvalidSubmit?: (errors: FormErrors) => void
  /**
   * Validación propia, además de la nativa (`required`, `type="email"`, `minLength`…).
   * Devuelve los errores por `name`; lo que no tenga error puede omitirse.
   * @example validate={(data) => ({ telefono: data.get('telefono') ? undefined : 'Déjanos un teléfono' })}
   */
  validate?: (data: FormData) => FormErrors | null | undefined
  /** Errores que vienen del servidor, por `name`. Se muestran igual que los del navegador. */
  errors?: FormErrors
  /** Sustituye los mensajes de la validación nativa. */
  messages?: Partial<ValidationMessages>
  /** Muestra el resumen de errores al principio del formulario. @default true */
  errorSummary?: boolean
  /** @default 'Revisa los siguientes campos' */
  errorSummaryTitle?: ReactNode
  /**
   * Adónde va el foco al enviar con errores:
   * - `summary`: al resumen, que se lee entero y enlaza a cada campo (patrón GOV.UK).
   * - `field`: directamente al primer campo con error.
   * @default 'summary' (o 'field' sin resumen)
   */
  focusOnError?: 'summary' | 'field'
  /** Marca de obligatorio/opcional para todos los campos. @default 'required' */
  indicator?: FieldIndicator
  /** Texto de los campos opcionales. @default '(opcional)' */
  optionalLabel?: string
  /**
   * Nota al principio que explica el asterisco. Solo aparece con `indicator="required"` y si hay
   * campos obligatorios. `false` para ocultarla.
   * @default 'Los campos marcados con * son obligatorios.'
   */
  requiredHint?: ReactNode | false
  /** Prefijo que los lectores de pantalla leen antes de cada error. @default 'Error:' */
  errorPrefix?: string
}

type SummaryState = { source: FormErrors | null; items: ErrorSummaryItem[] }

function sameErrors(a: FormErrors, b: FormErrors) {
  const keys = Object.keys(a)
  return keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]))
}

function buildSummary(form: HTMLFormElement | null, errors: FormErrors): ErrorSummaryItem[] {
  const names = Object.keys(errors)
  if (!form) return names.map((name) => ({ message: errors[name] }))
  const positioned = names.map((name) => {
    const [control] = getControlsByName(form, name)
    return {
      control,
      item: {
        id: control?.id || undefined,
        label: control ? getControlLabel(control) : undefined,
        message: errors[name],
      },
    }
  })
  // Mismo orden que en pantalla; los errores sin campo (generales) van al final.
  positioned.sort((a, b) => {
    if (!a.control) return b.control ? 1 : 0
    if (!b.control) return -1
    return a.control.compareDocumentPosition(b.control) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  })
  return positioned.map(({ item }) => item)
}

/**
 * Formulario con validación accesible:
 * - Valida al enviar con las reglas nativas (`required`, `type`, `minLength`, `pattern`…) y con
 *   `validate`, mostrando mensajes claros en español bajo cada etiqueta.
 * - Si hay errores, cancela el envío, muestra un resumen enlazado y mueve el foco a él.
 * - Los errores se revisan de nuevo al salir de cada campo, para quitarlos en cuanto se corrigen.
 *
 * Funciona con `onSubmit`, con `action` (React 19) y con envíos nativos.
 */
export function Form({
  onSubmit,
  onInvalidSubmit,
  validate,
  errors: serverErrors,
  messages: messagesProp,
  errorSummary = true,
  errorSummaryTitle,
  focusOnError,
  indicator = defaultIndicator,
  optionalLabel = defaultOptionalLabel,
  requiredHint,
  errorPrefix = defaultErrorPrefix,
  noValidate = true,
  className,
  children,
  ref,
  onChange,
  onBlur,
  onReset,
  ...props
}: FormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const messages = { ...defaultValidationMessages, ...messagesProp }
  const [clientErrors, setClientErrors] = useState<FormErrors>({})
  // Copia estable de `errors`: un objeto literal nuevo en cada render no debe relanzar nada.
  const [server, setServer] = useState(() => compactErrors(serverErrors))
  const nextServer = compactErrors(serverErrors)
  if (!sameErrors(server, nextServer)) setServer(nextServer)
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(() => new Set())
  const [summary, setSummary] = useState<SummaryState>({ source: null, items: [] })
  const [focusToken, setFocusToken] = useState(0)
  const handledFocus = useRef(0)
  const [hasRequired, setHasRequired] = useState(false)

  const visibleErrors = useMemo(() => {
    const visible = { ...server }
    for (const name of dismissed) delete visible[name]
    return { ...visible, ...clientErrors }
  }, [server, dismissed, clientErrors])

  // Errores nuevos del servidor: se muestran todos y se lleva el foco al resumen.
  useEffect(() => {
    setDismissed((current) => (current.size > 0 ? new Set() : current))
    if (Object.keys(server).length > 0) setFocusToken((token) => token + 1)
  }, [server])

  // El resumen necesita el DOM para ordenar los errores y leer las etiquetas.
  useLayoutEffect(() => {
    setSummary({ source: visibleErrors, items: buildSummary(formRef.current, visibleErrors) })
  }, [visibleErrors])

  useLayoutEffect(() => {
    setHasRequired(
      Boolean(formRef.current?.querySelector('[required], [data-bl-group][data-required]')),
    )
  })

  const target = focusOnError ?? (errorSummary ? 'summary' : 'field')
  useEffect(() => {
    if (focusToken === handledFocus.current) return
    if (summary.source !== visibleErrors || summary.items.length === 0) return
    handledFocus.current = focusToken
    if (target === 'summary' && summaryRef.current) {
      summaryRef.current.focus()
      return
    }
    const first = summary.items.find((item) => item.id)
    if (first?.id) focusControl(first.id)
  }, [focusToken, summary, visibleErrors, target])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const custom = compactErrors(validate?.(new FormData(form)))
    const next = { ...custom, ...validateForm(form, messages) }
    setClientErrors(next)
    if (Object.keys(next).length > 0) {
      event.preventDefault()
      setFocusToken((token) => token + 1)
      onInvalidSubmit?.(next)
      return
    }
    onSubmit?.(event)
  }

  // Revisa de nuevo un campo que ya tenía error, para quitarlo en cuanto se corrige.
  const revalidate = (element: EventTarget) => {
    const form = formRef.current
    if (!form || !isFormControl(element) || element.form !== form || !element.name) return
    const { name } = element
    if (!(name in clientErrors)) return
    const message =
      validateName(form, name, messages) ??
      compactErrors(validate?.(new FormData(form)))[name] ??
      undefined
    setClientErrors((current) => {
      const next = { ...current }
      if (message === undefined) delete next[name]
      else next[name] = message
      return next
    })
  }

  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    onChange?.(event)
    const element = event.target
    // Un error del servidor se oculta en cuanto se modifica el campo.
    if (isFormControl(element) && element.name in server && !dismissed.has(element.name)) {
      const { name } = element
      setDismissed((current) => new Set(current).add(name))
    }
    // Casillas, radios, desplegables y archivos se revisan al cambiar; el texto, al salir del campo.
    if (
      element instanceof HTMLSelectElement ||
      (element instanceof HTMLInputElement && ['checkbox', 'radio', 'file'].includes(element.type))
    ) {
      revalidate(element)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    onBlur?.(event)
    revalidate(event.target)
  }

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    onReset?.(event)
    setClientErrors({})
    setDismissed(new Set(Object.keys(server)))
  }

  const context = useMemo<FormContextValue>(
    () => ({ errors: visibleErrors, indicator, optionalLabel, errorPrefix }),
    [visibleErrors, indicator, optionalLabel, errorPrefix],
  )

  const showHint = requiredHint !== false && indicator === 'required' && hasRequired

  return (
    <form
      ref={mergeRefs(formRef, ref)}
      className={cx(styles.root, className)}
      noValidate={noValidate}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onBlur={handleBlur}
      onReset={handleReset}
      {...props}
    >
      {errorSummary && (
        <ErrorSummary ref={summaryRef} title={errorSummaryTitle} errors={summary.items} />
      )}
      {showHint &&
        (requiredHint === undefined ? (
          <p className={styles.hint} aria-hidden="true">
            Los campos marcados con <span className={styles.asterisk}>*</span> son obligatorios.
          </p>
        ) : (
          <div className={styles.hint}>{requiredHint}</div>
        ))}
      <FormContext.Provider value={context}>{children}</FormContext.Provider>
    </form>
  )
}

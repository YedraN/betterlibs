'use client'

import { Button, Input } from '@betterlibs/react'
import { useEffect, useRef, useState } from 'react'
import common from './Advanced.module.css'

export type InlineEditProps = {
  label: string
  value: string
  onSave: (value: string, signal: AbortSignal) => void | Promise<void>
  validate?: (value: string) => string | undefined
  disabled?: boolean
  placeholder?: string
}

/** Edición explícita: Escape cancela, Enter guarda y los errores conservan el borrador. */
export function InlineEdit({
  label,
  value,
  onSave,
  validate,
  disabled,
  placeholder = 'Añadir valor',
}: InlineEditProps) {
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(value),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    lock = useRef(false),
    mounted = useRef(true),
    operation = useRef<AbortController | null>(null)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      operation.current?.abort()
    }
  }, [])
  useEffect(() => {
    if (editing) {
      input.current?.focus()
      input.current?.select()
    }
  }, [editing])
  const close = () => {
    setEditing(false)
    requestAnimationFrame(() => trigger.current?.focus())
  }
  const save = async () => {
    if (lock.current) return
    lock.current = true
    const controller = new AbortController()
    operation.current = controller
    setBusy(true)
    setError('')
    try {
      const message = validate?.(draft)
      if (message) {
        setError(message)
        return
      }
      await onSave(draft, controller.signal)
      if (mounted.current && !controller.signal.aborted) close()
    } catch {
      if (mounted.current && !controller.signal.aborted)
        setError('No se pudo guardar. El texto se conserva; vuelve a intentar.')
    } finally {
      lock.current = false
      if (mounted.current) setBusy(false)
    }
  }
  return (
    <div className={common.column}>
      {editing ? (
        <>
          <Input
            ref={input}
            aria-label={label}
            value={draft}
            readOnly={busy}
            aria-busy={busy}
            standalone
            invalid={Boolean(error)}
            onChange={(event) => {
              setDraft(event.target.value)
              setError('')
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return
              if (event.key === 'Escape' && !busy) {
                event.preventDefault()
                close()
              }
              if (event.key === 'Enter') {
                event.preventDefault()
                void save()
              }
            }}
          />
          <div className={common.row}>
            <Button size="sm" loading={busy} onClick={save}>
              Guardar
            </Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={close}>
              Cancelar
            </Button>
          </div>
          {error && (
            <p role="alert" className={common.error}>
              {error}
            </p>
          )}
        </>
      ) : (
        <Button
          ref={trigger}
          variant="ghost"
          disabled={disabled}
          aria-label={`Editar ${label.toLowerCase()}: ${value || placeholder}`}
          onClick={() => {
            setDraft(value)
            setError('')
            setEditing(true)
          }}
        >
          {value || placeholder}
        </Button>
      )}
    </div>
  )
}

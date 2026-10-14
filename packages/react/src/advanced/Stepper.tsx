'use client'

import { Button } from '@betterlibs/react'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import common from './Advanced.module.css'
import styles from './Stepper.module.css'
import { useValue } from './shared'

export type Step = { id: string; title: string; description?: string; content: ReactNode }
export type StepperProps = {
  label: string
  steps: Step[]
  value?: number
  defaultValue?: number
  onValueChange?: (step: number) => void
  /** Devuelve un error para detener el avance; el consumidor conserva sus datos. */
  validate?: (step: number, signal: AbortSignal) => string | undefined | Promise<string | undefined>
  onComplete?: (signal: AbortSignal) => void | Promise<void>
}

/** Proceso por pasos. Conserva los paneles montados y evita dobles envíos durante validación. */
export function Stepper({
  label,
  steps,
  value,
  defaultValue = 0,
  onValueChange,
  validate,
  onComplete,
}: StepperProps) {
  const [index, setIndex] = useValue(value, defaultValue, onValueChange)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const lock = useRef(false)
  const operation = useRef<AbortController | null>(null)
  useEffect(() => () => operation.current?.abort(), [])
  const id = useId()
  const current = Math.min(Math.max(0, index), steps.length - 1)
  const go = (next: number) => {
    setError('')
    setIndex(next)
    requestAnimationFrame(() => heading.current?.focus())
  }
  const advance = async () => {
    if (lock.current) return
    lock.current = true
    const controller = new AbortController()
    operation.current = controller
    setBusy(true)
    setError('')
    try {
      const message = await validate?.(current, controller.signal)
      if (controller.signal.aborted) return
      if (message) {
        setError(message)
        return
      }
      if (current < steps.length - 1) go(current + 1)
      else {
        await onComplete?.(controller.signal)
        if (!controller.signal.aborted) {
          setDone(true)
          requestAnimationFrame(() => heading.current?.focus())
        }
      }
    } catch {
      if (!controller.signal.aborted)
        setError('No se pudo completar el paso. Revisa los datos y vuelve a intentar.')
    } finally {
      lock.current = false
      if (!controller.signal.aborted) setBusy(false)
    }
  }
  if (!steps.length) return <p>No hay pasos configurados.</p>
  return (
    <section className={common.column} aria-labelledby={id}>
      <h2 id={id}>{label}</h2>
      <ol className={styles.steps} aria-label="Progreso del proceso">
        {steps.map((step, position) => (
          <li
            key={step.id}
            aria-current={!done && position === current ? 'step' : undefined}
            data-complete={position < current || done || undefined}
          >
            <span className={styles.number} aria-hidden="true">
              {position + 1}
            </span>
            <span>{step.title}</span>
          </li>
        ))}
      </ol>
      <h3 ref={heading} tabIndex={-1} className={styles.heading}>
        {done ? 'Proceso completado' : steps[current]?.title}
      </h3>
      {steps.map((step, position) => (
        <div key={step.id} hidden={done || position !== current}>
          {step.description && <p className={common.muted}>{step.description}</p>}
          {step.content}
        </div>
      ))}
      {error && (
        <p role="alert" className={common.error}>
          {error}
        </p>
      )}
      <p role="status" className={common.muted}>
        {done ? 'Todos los pasos se han completado.' : `Paso ${current + 1} de ${steps.length}.`}
      </p>
      {!done && (
        <div className={common.row}>
          <Button
            type="button"
            variant="outline"
            disabled={current === 0 || busy}
            onClick={() => go(current - 1)}
          >
            Anterior
          </Button>
          <Button type="button" loading={busy} onClick={advance}>
            {current === steps.length - 1 ? 'Completar' : 'Continuar'}
          </Button>
        </div>
      )}
    </section>
  )
}

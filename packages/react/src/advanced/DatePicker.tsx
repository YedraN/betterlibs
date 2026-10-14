'use client'

import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@betterlibs/react'
import { useId, useState } from 'react'
import styles from './Advanced.module.css'
import { Calendar } from './Calendar'
import { type DateSelection, parseDate } from './dates'
import { useValue } from './shared'

export type DatePickerProps = {
  label: string
  mode?: 'single' | 'range'
  value?: DateSelection
  defaultValue?: DateSelection
  onValueChange?: (value: DateSelection) => void
  name?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  locale?: string
}

/** Fechas civiles ISO, sin conversiones UTC. Entrada manual nativa y calendario de teclado. */
export function DatePicker({
  label,
  mode = 'single',
  value,
  defaultValue = { start: '' },
  onValueChange,
  name,
  min,
  max,
  disabled,
  required,
  locale = 'es-ES',
}: DatePickerProps) {
  const [selection, setSelection] = useValue(value, defaultValue, onValueChange)
  const [open, setOpen] = useState(false)
  const calendarId = useId()
  const invalid = Boolean(selection.end && selection.start > selection.end)
  const choose = (key: string) => {
    if (mode === 'single') {
      setSelection({ start: key })
      setOpen(false)
    } else if (!selection.start || selection.end) setSelection({ start: key })
    else {
      setSelection(
        key >= selection.start
          ? { start: selection.start, end: key }
          : { start: key, end: selection.start },
      )
      setOpen(false)
    }
  }
  const date = parseDate(selection.start)
  return (
    <fieldset
      className={styles.root}
      disabled={disabled}
      style={{ border: 0, padding: 0, margin: 0 }}
    >
      <legend className={styles.label}>{label}</legend>
      <div className={styles.row}>
        <div className={styles.grow}>
          <Input
            standalone
            type="date"
            aria-label={mode === 'range' ? `${label}: inicio` : label}
            name={name}
            required={required}
            min={min}
            max={max}
            value={selection.start}
            onChange={(event) => setSelection({ ...selection, start: event.target.value })}
          />
        </div>
        {mode === 'range' && (
          <div className={styles.grow}>
            <Input
              standalone
              type="date"
              aria-label={`${label}: fin`}
              name={name ? `${name}End` : undefined}
              required={required}
              min={selection.start || min}
              max={max}
              value={selection.end ?? ''}
              invalid={invalid}
              onChange={(event) => setSelection({ ...selection, end: event.target.value })}
            />
          </div>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              aria-label={`Abrir calendario de ${label.toLowerCase()}${date ? `: ${new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)}` : ''}`}
            >
              Calendario
            </Button>
          </PopoverTrigger>
          <PopoverContent
            title={label}
            width="auto"
            className={styles.picker}
            onOpenAutoFocus={(event) => {
              event.preventDefault()
              requestAnimationFrame(() =>
                document
                  .getElementById(calendarId)
                  ?.querySelector<HTMLButtonElement>('button[tabindex="0"]')
                  ?.focus(),
              )
            }}
          >
            <div id={calendarId}>
              <Calendar value={selection} onChoose={choose} min={min} max={max} locale={locale} />
            </div>
            {mode === 'range' && (
              <p role="status" className={styles.muted}>
                {selection.start && !selection.end
                  ? 'Elige la fecha final.'
                  : 'Elige el inicio del intervalo.'}
              </p>
            )}
          </PopoverContent>
        </Popover>
      </div>
      {invalid && (
        <p role="alert" className={styles.error}>
          La fecha final debe ser posterior o igual al inicio.
        </p>
      )}
    </fieldset>
  )
}

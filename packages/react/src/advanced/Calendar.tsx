'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@betterlibs/icons'
import { IconButton } from '@betterlibs/react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import styles from './Calendar.module.css'
import { type DateSelection, dateKey, parseDate, shiftDate, shiftMonth } from './dates'

export type CalendarProps = {
  value: DateSelection
  onChoose: (date: string) => void
  min?: string
  max?: string
  locale?: string
}

/** Calendario con un único día en la tabulación y navegación de semana/mes/año. */
export function Calendar({ value, onChoose, min, max, locale = 'es-ES' }: CalendarProps) {
  const id = useId()
  const candidate = parseDate(value.start) ?? parseDate(min ?? '') ?? new Date()
  const initial =
    min && dateKey(candidate) < min
      ? (parseDate(min) ?? candidate)
      : max && dateKey(candidate) > max
        ? (parseDate(max) ?? candidate)
        : candidate
  const [focused, setFocused] = useState(dateKey(initial))
  const [month, setMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1, 12))
  const grid = useRef<HTMLTableElement>(null)
  const shouldFocus = useRef(false)
  useLayoutEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    grid.current?.querySelector<HTMLButtonElement>(`button[data-date="${focused}"]`)?.focus()
  }, [focused])
  const start = shiftDate(month, -((month.getDay() + 6) % 7))
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })
  const allowed = (key: string) => (!min || key >= min) && (!max || key <= max)
  const move = (next: Date) => {
    const candidateKey = dateKey(next)
    const key = min && candidateKey < min ? min : max && candidateKey > max ? max : candidateKey
    const target = parseDate(key)
    if (!target || key === focused) return
    shouldFocus.current = true
    setFocused(key)
    setMonth(new Date(target.getFullYear(), target.getMonth(), 1, 12))
  }
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <IconButton
          label="Mes anterior"
          size="sm"
          variant="ghost"
          disabled={Boolean(
            min && dateKey(new Date(month.getFullYear(), month.getMonth(), 0, 12)) < min,
          )}
          onClick={() => move(shiftMonth(parseDate(focused) ?? month, -1))}
        >
          <ChevronLeftIcon />
        </IconButton>
        <span id={id} aria-live="polite">
          {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month)}
        </span>
        <IconButton
          label="Mes siguiente"
          size="sm"
          variant="ghost"
          disabled={Boolean(
            max && dateKey(new Date(month.getFullYear(), month.getMonth() + 1, 1, 12)) > max,
          )}
          onClick={() => move(shiftMonth(parseDate(focused) ?? month, 1))}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
      <table ref={grid} role="grid" aria-labelledby={id} className={styles.grid}>
        <thead>
          <tr>
            {Array.from({ length: 7 }, (_, day) => {
              const weekday = shiftDate(new Date(2026, 0, 5, 12), day)
              return (
                <th
                  key={dateKey(weekday)}
                  scope="col"
                  abbr={new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(weekday)}
                >
                  {new Intl.DateTimeFormat(locale, { weekday: 'short' })
                    .format(weekday)
                    .slice(0, 2)}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={dateKey(shiftDate(start, week * 7))}>
              {Array.from({ length: 7 }, (_, day) => {
                const date = shiftDate(start, week * 7 + day)
                const key = dateKey(date)
                const selected = key === value.start || key === value.end
                return (
                  <td key={key} aria-selected={selected}>
                    <button
                      type="button"
                      data-date={key}
                      data-outside={date.getMonth() !== month.getMonth() || undefined}
                      data-range={(value.end && key > value.start && key < value.end) || undefined}
                      aria-label={formatter.format(date)}
                      aria-current={key === dateKey(new Date()) ? 'date' : undefined}
                      disabled={!allowed(key)}
                      tabIndex={key === focused ? 0 : -1}
                      onFocus={() => setFocused(key)}
                      onClick={() => onChoose(key)}
                      onKeyDown={(event) => {
                        let next: Date | undefined
                        const direction =
                          getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1
                        if (event.key === 'ArrowRight') next = shiftDate(date, direction)
                        if (event.key === 'ArrowLeft') next = shiftDate(date, -direction)
                        if (event.key === 'ArrowDown') next = shiftDate(date, 7)
                        if (event.key === 'ArrowUp') next = shiftDate(date, -7)
                        if (event.key === 'Home') next = shiftDate(date, -((date.getDay() + 6) % 7))
                        if (event.key === 'End')
                          next = shiftDate(date, 6 - ((date.getDay() + 6) % 7))
                        if (event.key === 'PageUp')
                          next = shiftMonth(date, event.shiftKey ? -12 : -1)
                        if (event.key === 'PageDown')
                          next = shiftMonth(date, event.shiftKey ? 12 : 1)
                        if (next) {
                          event.preventDefault()
                          move(next)
                        }
                      }}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'
import styles from './Advanced.module.css'
import { useValue } from './shared'

export type ToggleOption = { value: string; label: string; disabled?: boolean }
export type ToggleGroupProps = {
  label: string
  options: ToggleOption[]
  type?: 'single' | 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  name?: string
}

/** Grupo de botones de estado; las flechas mantienen una única parada de tabulación. */
export function ToggleGroup({
  label,
  options,
  type = 'single',
  value,
  defaultValue = [],
  onValueChange,
  disabled,
  name,
}: ToggleGroupProps) {
  const [selected, setSelected] = useValue(value, defaultValue, onValueChange)
  const root = useRef<HTMLDivElement>(null)
  const first = options.find((option) => !option.disabled)?.value
  const [focused, setFocused] = useState<string | undefined>(undefined)
  const tabStop = options.some((item) => item.value === focused && !item.disabled)
    ? focused
    : (selected.find((key) => options.some((item) => item.value === key && !item.disabled)) ??
      first)
  return (
    <div className={styles.column}>
      <div ref={root} role="group" aria-label={label} className={styles.row}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={styles.option}
            style={{ inlineSize: 'auto' }}
            aria-pressed={selected.includes(option.value)}
            disabled={disabled || option.disabled}
            tabIndex={option.value === tabStop ? 0 : -1}
            onFocus={() => setFocused(option.value)}
            onClick={() =>
              setSelected(
                selected.includes(option.value)
                  ? selected.filter((key) => key !== option.value)
                  : type === 'single'
                    ? [option.value]
                    : [...selected, option.value],
              )
            }
            onKeyDown={(event) => {
              const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
              if (!keys.includes(event.key)) return
              event.preventDefault()
              const buttons = [
                ...(root.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ??
                  []),
              ]
              const current = buttons.indexOf(event.currentTarget)
              const direction = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1
              const index =
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? buttons.length - 1
                    : (current +
                        (event.key === 'ArrowRight' ? direction : -direction) +
                        buttons.length) %
                      buttons.length
              buttons[index]?.focus()
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      {name &&
        selected.map((key) => (
          <input key={key} type="hidden" name={name} value={key} disabled={disabled} />
        ))}
    </div>
  )
}

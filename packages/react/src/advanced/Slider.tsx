'use client'

import { useId } from 'react'
import styles from './Slider.module.css'
import { useValue } from './shared'

export type SliderProps = {
  label: string
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  disabled?: boolean
  name?: string
  formatValue?: (value: number) => string
}

/** Una o dos entradas range nativas: teclado del navegador y límites que evitan cruzar extremos. */
export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [min],
  onValueChange,
  disabled,
  name,
  formatValue = String,
}: SliderProps) {
  const id = useId()
  const [values, setValues] = useValue(value, defaultValue, onValueChange)
  const clamp = (number: number) => Math.max(min, Math.min(max, number))
  const low = clamp(values[0] ?? min),
    high = Math.max(low, clamp(values[1] ?? max))
  const range = values.length > 1
  return (
    <fieldset className={styles.root} disabled={disabled || max <= min}>
      <legend>{label}</legend>
      <output className={styles.value} htmlFor={`${id}-low${range ? ` ${id}-high` : ''}`}>
        {formatValue(low)}
        {range ? ` – ${formatValue(high)}` : ''}
      </output>
      <label className={styles.control}>
        <span>{range ? 'Mínimo' : label}</span>
        <input
          id={`${id}-low`}
          type="range"
          name={name}
          min={min}
          max={range ? high : max}
          step={step > 0 ? step : 1}
          value={low}
          aria-valuetext={formatValue(low)}
          onChange={(event) =>
            setValues(range ? [Number(event.target.value), high] : [Number(event.target.value)])
          }
        />
      </label>
      {range && (
        <label className={styles.control}>
          <span>Máximo</span>
          <input
            id={`${id}-high`}
            type="range"
            name={name ? `${name}Max` : undefined}
            min={low}
            max={max}
            step={step > 0 ? step : 1}
            value={high}
            aria-valuetext={formatValue(high)}
            onChange={(event) => setValues([low, Number(event.target.value)])}
          />
        </label>
      )}
      <div className={styles.scale}>
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </fieldset>
  )
}

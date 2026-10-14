'use client'

import { CheckIcon, CloseIcon } from '@betterlibs/icons'
import {
  Button,
  Command,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@betterlibs/react'
import { useState } from 'react'
import styles from './Advanced.module.css'
import type { SelectOption } from './Combobox'
import { useValue } from './shared'

export type MultiSelectProps = {
  label: string
  options: SelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  name?: string
  disabled?: boolean
  /** Limita nuevas selecciones; las etiquetas elegidas siempre pueden quitarse. */
  maxSelected?: number
  loading?: boolean
  error?: string
  className?: string
}

/** Selección múltiple con búsqueda y etiquetas eliminables. Cada valor usa un campo nativo. */
export function MultiSelect({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  name,
  disabled,
  maxSelected,
  loading,
  error,
  className,
}: MultiSelectProps) {
  const [selected, setSelected] = useValue(value, defaultValue, onValueChange)
  const [open, setOpen] = useState(false)
  const toggle = (key: string) => {
    if (selected.includes(key)) setSelected(selected.filter((item) => item !== key))
    else if (maxSelected === undefined || selected.length < maxSelected)
      setSelected([...selected, key])
  }
  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <span className={styles.label}>{label}</span>
      {name &&
        selected.map((key) => (
          <input key={key} type="hidden" name={name} value={key} disabled={disabled} />
        ))}
      <div role="group" className={styles.chips} aria-label={`Selección de ${label}`}>
        {selected.map((key) => (
          <span className={styles.chip} key={key}>
            {options.find((option) => option.value === key)?.label ?? key}
            <IconButton
              size="sm"
              variant="ghost"
              label={`Quitar ${options.find((option) => option.value === key)?.label ?? key}`}
              disabled={disabled}
              onClick={() => toggle(key)}
            >
              <CloseIcon />
            </IconButton>
          </span>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" disabled={disabled} className={styles.trigger}>
            Elegir {label.toLowerCase()} ({selected.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent title={label} width="auto" className={styles.picker}>
          <Command
            items={options.map((option) => ({
              ...option,
              id: option.value,
              label: `${selected.includes(option.value) ? 'Quitar' : 'Añadir'} ${option.label}`,
              icon: selected.includes(option.value) ? <CheckIcon /> : undefined,
              disabled:
                option.disabled ||
                (!selected.includes(option.value) &&
                  maxSelected !== undefined &&
                  selected.length >= maxSelected),
            }))}
            label={`Buscar ${label.toLowerCase()}`}
            loading={loading}
            error={error}
            onSelect={(item) => toggle(item.id)}
            hint="Enter añade o quita una opción. Escape cierra la lista."
          />
        </PopoverContent>
      </Popover>
      <p className={styles.muted} role="status">
        {selected.length} seleccionadas{maxSelected !== undefined ? ` de ${maxSelected}` : ''}.
      </p>
    </div>
  )
}

'use client'

import { ChevronDownIcon } from '@betterlibs/icons'
import {
  Button,
  Command,
  type CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useFieldControl,
} from '@betterlibs/react'
import { useId, useRef, useState } from 'react'
import styles from './Advanced.module.css'
import { useValue } from './shared'

export type SelectOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
  keywords?: string[]
}
export type ComboboxProps = {
  /** Nombre accesible del selector. */
  label: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  name?: string
  id?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  error?: string
  onRetry?: () => void
  emptyText?: string
  className?: string
}

/** Selector con buscador en un panel: selección explícita, sin modificar el valor al explorar. */
export function Combobox({
  label,
  options,
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Elige una opción',
  loading,
  error,
  onRetry,
  emptyText,
  className,
  ...fieldOptions
}: ComboboxProps) {
  const [selected, setSelected] = useValue(value, defaultValue, onValueChange)
  const [open, setOpen] = useState(false)
  const popupId = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const { controlProps } = useFieldControl(fieldOptions)
  const option = options.find((item) => item.value === selected)
  const actions: CommandItem[] = options.map((item) => ({ ...item, id: item.value }))
  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      {controlProps.name && (
        <select
          aria-hidden="true"
          tabIndex={-1}
          className={styles.sr}
          name={controlProps.name}
          value={selected}
          required={controlProps.required}
          disabled={controlProps.disabled}
          onChange={() => {
            /* El control visible gestiona la selección. */
          }}
          onFocus={() => trigger.current?.focus()}
          onInvalid={(event) => {
            event.preventDefault()
            trigger.current?.focus()
          }}
        >
          <option value="" />
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={trigger}
            type="button"
            variant="outline"
            className={styles.trigger}
            id={controlProps.id}
            disabled={controlProps.disabled}
            aria-label={`${label}: ${option?.label ?? placeholder}`}
            aria-describedby={controlProps['aria-describedby']}
            aria-invalid={controlProps['aria-invalid']}
            aria-required={controlProps.required}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={open ? popupId : undefined}
            iconEnd={<ChevronDownIcon />}
          >
            <span>{option?.label ?? placeholder}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent id={popupId} title={label} width="auto" className={styles.picker}>
          <Command
            items={actions}
            label={`Buscar ${label.toLowerCase()}`}
            loading={loading}
            error={error}
            onRetry={onRetry}
            emptyText={emptyText}
            onSelect={(item) => {
              setSelected(item.id)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

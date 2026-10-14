'use client'

import { CloseIcon } from '@betterlibs/icons'
import { Button, IconButton, Input, Select } from '@betterlibs/react'
import { useId } from 'react'
import styles from './Advanced.module.css'
import type { SelectOption } from './Combobox'
import { useValue } from './shared'

export type FilterState = { query: string; filters: Record<string, string> }
export type FilterDefinition = { id: string; label: string; options: SelectOption[] }
export type FilterToolbarProps = {
  label: string
  filters: FilterDefinition[]
  value?: FilterState
  defaultValue?: FilterState
  onValueChange?: (value: FilterState) => void
  resultCount?: number
  loading?: boolean
}

/** Filtros declarativos; no asume un backend y mantiene búsqueda y selecciones independientes. */
export function FilterToolbar({
  label,
  filters,
  value,
  defaultValue = { query: '', filters: {} },
  onValueChange,
  resultCount,
  loading,
}: FilterToolbarProps) {
  const id = useId()
  const [state, setState] = useValue(value, defaultValue, onValueChange)
  const active = filters.filter((filter) => Boolean(state.filters[filter.id]))
  const clear = (key: string) => {
    const next = { ...state.filters }
    delete next[key]
    setState({ ...state, filters: next })
  }
  return (
    <section aria-label={label} className={styles.column}>
      <div className={styles.row}>
        <div className={styles.grow} style={{ flex: '1 1 12rem' }}>
          <Input
            standalone
            aria-label={`Buscar en ${label.toLowerCase()}`}
            value={state.query}
            placeholder="Buscar…"
            onChange={(event) => setState({ ...state, query: event.target.value })}
          />
        </div>
        {filters.map((filter) => (
          <label
            key={filter.id}
            className={styles.column}
            style={{ gap: 'var(--bl-space-1)', flex: '1 1 10rem' }}
            htmlFor={`${id}-${filter.id}`}
          >
            <span className={styles.muted}>{filter.label}</span>
            <Select
              standalone
              id={`${id}-${filter.id}`}
              value={state.filters[filter.id] ?? ''}
              onChange={(event) => {
                if (!event.target.value) clear(filter.id)
                else
                  setState({
                    ...state,
                    filters: { ...state.filters, [filter.id]: event.target.value },
                  })
              }}
            >
              <option value="">Todas las opciones</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        ))}
        <Button
          type="button"
          variant="ghost"
          disabled={!state.query && !active.length}
          onClick={() => setState({ query: '', filters: {} })}
        >
          Restablecer filtros
        </Button>
      </div>
      {active.length > 0 && (
        <div role="group" className={styles.chips} aria-label="Filtros activos">
          {active.map((filter) => (
            <span className={styles.chip} key={filter.id}>
              {filter.label}:{' '}
              {filter.options.find((option) => option.value === state.filters[filter.id])?.label ??
                state.filters[filter.id]}
              <IconButton
                size="sm"
                variant="ghost"
                label={`Quitar filtro ${filter.label.toLowerCase()}`}
                onClick={() => clear(filter.id)}
              >
                <CloseIcon />
              </IconButton>
            </span>
          ))}
        </div>
      )}
      <span role="status" className={styles.muted}>
        {loading
          ? 'Buscando resultados…'
          : resultCount !== undefined
            ? `${resultCount} resultados.`
            : `${active.length} filtros activos.`}
      </span>
    </section>
  )
}

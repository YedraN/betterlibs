'use client'

import { CloseIcon, SearchIcon } from '@betterlibs/icons'
import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import { cx } from '../../utils/cx'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'
import { Input } from '../Input/Input'
import { Spinner } from '../Spinner/Spinner'
import styles from './Command.module.css'
import type { CommandItem, CommandProps } from './types'

export type { CommandItem, CommandProps } from './types'

const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/**
 * Buscador de acciones con navegación por flechas y selección explícita. El foco permanece en
 * el campo mediante aria-activedescendant. Combínalo con Dialog para crear una paleta modal.
 * Escape pertenece al contenedor: este componente no cierra paneles ni registra atajos globales.
 */
export function Command({
  items,
  onSelect,
  label = 'Buscar acciones',
  placeholder = 'Escribe una acción…',
  query: controlledQuery,
  onQueryChange,
  loading = false,
  loadingText = 'Buscando acciones…',
  emptyText = 'No hay acciones que coincidan. Prueba otra búsqueda.',
  filter = true,
  recentIds = [],
  recentLabel = 'Recientes',
  error,
  onRetry,
  retryLabel = 'Volver a intentar',
  hint = 'Usa las flechas para elegir y Enter para ejecutar.',
  className,
  ...props
}: CommandProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [localQuery, setLocalQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const query = controlledQuery ?? localQuery
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
  const groups = new Map<string, { item: CommandItem; optionId: string }[]>()
  const recents = !query.trim()
    ? [...new Set(recentIds)]
        .map((recentId) => items.find((item) => item.id === recentId))
        .filter((item): item is CommandItem => Boolean(item))
    : []
  const ordered = [...recents, ...items.filter((item) => !recents.includes(item))]
  const indices = new Map(items.map((item, index) => [item.id, index]))
  ordered.forEach((item) => {
    const index = indices.get(item.id) ?? 0
    const searchable = normalize(
      [item.label, item.description, item.group, ...(item.keywords ?? [])].join(' '),
    )
    if (filter && !terms.every((term) => searchable.includes(term))) return
    const group = recents.includes(item) ? recentLabel : (item.group ?? '')
    const entries = groups.get(group) ?? []
    entries.push({ item, optionId: `${id}-option-${index}` })
    groups.set(group, entries)
  })
  const results = [...groups.values()].flat()
  const enabled = loading || error ? [] : results.filter(({ item }) => !item.disabled)
  const active = enabled.find(({ item }) => item.id === activeId) ?? enabled[0]
  const activeOptionId = active?.optionId

  useEffect(() => {
    if (!activeOptionId) return
    const list = listRef.current
    if (!list) return
    const option = [...list.querySelectorAll<HTMLElement>('[role="option"]')].find(
      (element) => element.id === activeOptionId,
    )
    if (!option) return
    // Desplazar solo la lista; una paleta inline no debe mover la página al montarse.
    const bounds = list.getBoundingClientRect()
    const target = option.getBoundingClientRect()
    if (target.top < bounds.top) list.scrollTop += target.top - bounds.top
    else if (target.bottom > bounds.bottom) list.scrollTop += target.bottom - bounds.bottom
  }, [activeOptionId])

  const choose = (item: CommandItem) => {
    if (loading || error || item.disabled) return
    inputRef.current?.focus({ preventScroll: true })
    onSelect(item)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!enabled.length) return
      const index = enabled.findIndex(({ item }) => item.id === active?.item.id)
      const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length
      const nextItem = enabled[next]
      if (nextItem) setActiveId(nextItem.item.id)
    } else if (event.key === 'Enter') {
      // Nunca enviar un formulario contenedor al intentar ejecutar una acción.
      event.preventDefault()
      if (active) choose(active.item)
    }
  }

  return (
    <div className={cx(styles.root, className)} {...props}>
      <div className={styles.search}>
        <Input
          standalone
          ref={inputRef}
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={activeOptionId}
          aria-describedby={`${id}-hint`}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          iconStart={<SearchIcon />}
          value={query}
          onChange={(event) => {
            setLocalQuery(event.target.value)
            setActiveId(null)
            onQueryChange?.(event.target.value)
          }}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <IconButton
            label="Limpiar búsqueda"
            variant="ghost"
            onClick={() => {
              setLocalQuery('')
              setActiveId(null)
              onQueryChange?.('')
              inputRef.current?.focus()
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </div>
      <div
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        aria-label={label}
        aria-busy={loading}
        className={styles.list}
      >
        {!loading &&
          !error &&
          [...groups].map(([group, entries]) => (
            <div key={group} role="group" aria-label={group || 'Acciones'}>
              {group && (
                <div aria-hidden="true" className={styles.group}>
                  {group}
                </div>
              )}
              {entries.map(({ item, optionId }) => (
                <button
                  key={item.id}
                  id={optionId}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  disabled={item.disabled}
                  aria-disabled={item.disabled || undefined}
                  aria-selected={active?.item.id === item.id}
                  aria-label={item.label}
                  aria-describedby={item.description ? `${optionId}-description` : undefined}
                  className={styles.item}
                  onPointerMove={(event) => {
                    if (event.pointerType === 'mouse' && !item.disabled) setActiveId(item.id)
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(item)}
                >
                  {item.icon && (
                    <span aria-hidden="true" className={styles.icon}>
                      {item.icon}
                    </span>
                  )}
                  <span className={styles.content}>
                    <span className={styles.label}>{item.label}</span>
                    {item.description && (
                      <span id={`${optionId}-description`} className={styles.description}>
                        {item.description}
                      </span>
                    )}
                  </span>
                  {item.shortcut && (
                    <kbd aria-hidden="true" className={styles.shortcut}>
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
      </div>
      {error && (
        <div role="alert" className={styles.error}>
          <p>{error}</p>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
        </div>
      )}
      <div role="status" className={styles.status}>
        {loading ? (
          <>
            <Spinner size="sm" decorative />
            {loadingText}
          </>
        ) : error ? (
          ''
        ) : results.length ? (
          `${results.length} resultados.`
        ) : (
          emptyText
        )}
      </div>
      <p id={`${id}-hint`} className={styles.hint}>
        {hint}
      </p>
    </div>
  )
}

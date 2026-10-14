'use client'

import { Button, Checkbox, Input, Select, Skeleton } from '@betterlibs/react'
import { type ReactNode, useId, useState } from 'react'
import common from './Advanced.module.css'
import styles from './DataTable.module.css'
import { normalizeSearch, useValue } from './shared'

export type DataColumn<T> = {
  id: string
  header: string
  value: (row: T) => string | number | null
  render?: (row: T) => ReactNode
  sortable?: boolean
}
export type DataTableProps<T> = {
  label: string
  rows: T[]
  columns: DataColumn<T>[]
  rowId: (row: T) => string
  pageSize?: number
  searchable?: boolean
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  loading?: boolean
  error?: string
  onRetry?: () => void
  emptyText?: string
}

/** Tabla HTML con orden estable, selección por página y búsqueda que conserva las selecciones. */
export function DataTable<T>({
  label,
  rows,
  columns,
  rowId,
  pageSize = 10,
  searchable = true,
  selectable = false,
  selectedIds,
  onSelectionChange,
  loading,
  error,
  onRetry,
  emptyText = 'No hay registros. Añade uno para empezar.',
}: DataTableProps<T>) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(Math.max(1, Math.floor(pageSize)))
  const [sort, setSort] = useState<{ id: string; descending: boolean } | null>(null)
  const [selected, setSelected] = useValue(selectedIds, [], onSelectionChange)
  const term = normalizeSearch(query)
  const found = rows.filter((row) =>
    normalizeSearch(columns.map((column) => column.value(row)).join(' ')).includes(term),
  )
  const column = columns.find((item) => item.id === sort?.id)
  const ordered = column
    ? [...found].sort((a, b) => {
        const left = column.value(a),
          right = column.value(b)
        const difference =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : new Intl.Collator('es', { numeric: true }).compare(
                String(left ?? ''),
                String(right ?? ''),
              )
        return sort?.descending ? -difference : difference
      })
    : found
  const pages = Math.max(1, Math.ceil(found.length / size))
  const current = Math.min(page, pages - 1)
  const visible = ordered.slice(current * size, (current + 1) * size)
  const visibleIds = visible.map(rowId)
  const allSelected = visibleIds.length > 0 && visibleIds.every((key) => selected.includes(key))
  const selectedCount = rows.filter((row) => selected.includes(rowId(row))).length
  const placeholders = Array.from(
    { length: Math.min(size, 5) },
    (_, index) => `placeholder-${index}`,
  )
  return (
    <section className={common.column} aria-labelledby={id} aria-busy={loading}>
      <div className={common.row}>
        <h2 id={id} className={styles.heading}>
          {label}
        </h2>
        {searchable && (
          <div className={common.grow} style={{ flex: '1 1 12rem' }}>
            <Input
              standalone
              aria-label={`Buscar en ${label.toLowerCase()}`}
              placeholder="Buscar registros…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(0)
              }}
            />
          </div>
        )}
      </div>
      {error && (
        <div role="alert" className={common.error}>
          {error}{' '}
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Volver a intentar
            </Button>
          )}
        </div>
      )}
      <div className={common.scroll} role="region" aria-label={`Tabla ${label}`} tabIndex={0}>
        <table className={styles.table}>
          <caption className={common.sr}>{label}</caption>
          <thead>
            <tr>
              {selectable && (
                <th scope="col">
                  <Checkbox
                    label={<span className={common.sr}>Seleccionar esta página</span>}
                    checked={allSelected}
                    disabled={loading || Boolean(error) || !visible.length}
                    indeterminate={!allSelected && visibleIds.some((key) => selected.includes(key))}
                    onCheckedChange={(checked) =>
                      setSelected(
                        checked
                          ? [...new Set([...selected, ...visibleIds])]
                          : selected.filter((key) => !visibleIds.includes(key)),
                      )
                    }
                  />
                </th>
              )}
              {columns.map((item) => (
                <th
                  key={item.id}
                  scope="col"
                  aria-sort={
                    sort?.id === item.id
                      ? sort.descending
                        ? 'descending'
                        : 'ascending'
                      : undefined
                  }
                >
                  {item.sortable ? (
                    <button
                      type="button"
                      className={styles.sort}
                      disabled={loading}
                      onClick={() =>
                        setSort({
                          id: item.id,
                          descending: sort?.id === item.id && !sort.descending,
                        })
                      }
                    >
                      {item.header}
                      <span aria-hidden="true">
                        {sort?.id === item.id ? (sort.descending ? ' ↓' : ' ↑') : ' ↕'}
                      </span>
                    </button>
                  ) : (
                    item.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? placeholders.map((key) => (
                  <tr key={key}>
                    <td colSpan={columns.length + Number(selectable)}>
                      <Skeleton style={{ height: '2rem' }} />
                    </td>
                  </tr>
                ))
              : !error &&
                visible.map((row) => (
                  <tr key={rowId(row)} data-selected={selected.includes(rowId(row)) || undefined}>
                    {selectable && (
                      <td>
                        <Checkbox
                          label={
                            <span
                              className={common.sr}
                            >{`Seleccionar ${columns[0]?.value(row) ?? rowId(row)}`}</span>
                          }
                          checked={selected.includes(rowId(row))}
                          onCheckedChange={(checked) =>
                            setSelected(
                              checked
                                ? [...new Set([...selected, rowId(row)])]
                                : selected.filter((key) => key !== rowId(row)),
                            )
                          }
                        />
                      </td>
                    )}
                    {columns.map((item) => (
                      <td key={item.id}>{item.render ? item.render(row) : item.value(row)}</td>
                    ))}
                  </tr>
                ))}
            {!loading && !error && !visible.length && (
              <tr>
                <td colSpan={columns.length + Number(selectable)}>
                  {query ? 'No hay coincidencias. Prueba otra búsqueda.' : emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={common.row}>
        <span role="status" className={common.grow} style={{ flex: '1 1 12rem' }}>
          {loading
            ? 'Cargando registros…'
            : `${found.length} registros${selectable ? `; ${selectedCount} seleccionados` : ''}.`}
        </span>
        <Select
          standalone
          className={styles.pageSize}
          aria-label="Registros por página"
          value={String(size)}
          onChange={(event) => {
            setSize(Number(event.target.value))
            setPage(0)
          }}
        >
          {[...new Set([size, 5, 10, 25])]
            .sort((a, b) => a - b)
            .map((count) => (
              <option key={count} value={count}>
                {count} por página
              </option>
            ))}
        </Select>
        <Button
          size="sm"
          variant="outline"
          disabled={current === 0 || loading}
          onClick={() => setPage(current - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {current + 1} de {pages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={current + 1 >= pages || loading}
          onClick={() => setPage(current + 1)}
        >
          Siguiente
        </Button>
      </div>
    </section>
  )
}

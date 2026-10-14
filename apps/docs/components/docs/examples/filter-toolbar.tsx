'use client'
import { type FilterState, FilterToolbar } from '@betterlibs/react/advanced'
import { useState } from 'react'
export function FilterToolbarExample() {
  const [state, setState] = useState<FilterState>({ query: '', filters: {} })
  const rows = [
    { name: 'Atlas', state: 'open', type: 'design' },
    { name: 'Cuaderno', state: 'done', type: 'content' },
    { name: 'Estudio', state: 'open', type: 'design' },
  ]
  const found = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(state.query.toLowerCase()) &&
      (!state.filters.state || row.state === state.filters.state) &&
      (!state.filters.type || row.type === state.filters.type),
  )
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-4)' }}>
      <FilterToolbar
        label="Colecciones filtradas"
        value={state}
        onValueChange={setState}
        resultCount={found.length}
        filters={[
          {
            id: 'state',
            label: 'Estado',
            options: [
              { value: 'open', label: 'En curso' },
              { value: 'done', label: 'Completadas' },
            ],
          },
          {
            id: 'type',
            label: 'Tipo',
            options: [
              { value: 'design', label: 'Diseño' },
              { value: 'content', label: 'Contenido' },
            ],
          },
        ]}
      />
      <ul>
        {found.map((row) => (
          <li key={row.name}>{row.name}</li>
        ))}
      </ul>
    </div>
  )
}

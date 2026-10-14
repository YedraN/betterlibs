'use client'
import { Button } from '@betterlibs/react'
import { DataTable } from '@betterlibs/react/advanced'
import { useState } from 'react'

const rows = [
  { id: 'atlas', name: 'Atlas', state: 'En curso', pieces: 24 },
  { id: 'cuaderno', name: 'Cuaderno', state: 'Revisión', pieces: 12 },
  { id: 'estudio', name: 'Estudio', state: 'Completado', pieces: 38 },
  { id: 'archivo', name: 'Archivo', state: 'En curso', pieces: 8 },
  { id: 'portadas', name: 'Portadas', state: 'Revisión', pieces: 16 },
  { id: 'materia', name: 'Materia', state: 'Completado', pieces: 6 },
]
export function DataTableExample({
  loading = false,
  error = false,
  empty = false,
}: {
  loading?: boolean
  error?: boolean
  empty?: boolean
}) {
  const [failed, setFailed] = useState(error),
    [selection, setSelection] = useState<string[]>([])
  return (
    <DataTable
      label="Colecciones"
      rows={empty ? [] : rows}
      rowId={(row) => row.id}
      pageSize={5}
      selectable
      selectedIds={selection}
      onSelectionChange={setSelection}
      loading={loading}
      error={failed ? 'No se pudieron cargar las colecciones.' : undefined}
      onRetry={() => setFailed(false)}
      columns={[
        { id: 'name', header: 'Nombre', value: (row) => row.name, sortable: true },
        { id: 'state', header: 'Estado', value: (row) => row.state, sortable: true },
        { id: 'pieces', header: 'Piezas', value: (row) => row.pieces, sortable: true },
        {
          id: 'action',
          header: 'Acción',
          value: (row) => row.id,
          render: (row) => (
            <Button size="sm" variant="ghost" onClick={() => setSelection([row.id])}>
              Elegir {row.name}
            </Button>
          ),
        },
      ]}
    />
  )
}

'use client'
import { Field, Text } from '@betterlibs/react'
import { Combobox } from '@betterlibs/react/advanced'
import { useState } from 'react'

export function ComboboxExample({
  loading = false,
  error = false,
}: {
  loading?: boolean
  error?: boolean
}) {
  const [value, setValue] = useState(''),
    [failed, setFailed] = useState(error)
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-4)' }}>
      <Field label="Proyecto" description="Busca por nombre y elige dónde trabajar." name="project">
        <Combobox
          label="Proyecto"
          value={value}
          onValueChange={setValue}
          loading={loading}
          error={failed ? 'No se pudieron cargar los proyectos.' : undefined}
          onRetry={() => setFailed(false)}
          options={[
            {
              value: 'atlas',
              label: 'Atlas',
              description: 'Sistema de interfaces',
              keywords: ['diseño'],
            },
            { value: 'cuaderno', label: 'Cuaderno', description: 'Notas y lecturas' },
            { value: 'archivo', label: 'Archivo', disabled: true },
          ]}
        />
      </Field>
      <Text role="status">
        {value ? `Proyecto elegido: ${value}.` : 'Todavía no has elegido un proyecto.'}
      </Text>
    </div>
  )
}

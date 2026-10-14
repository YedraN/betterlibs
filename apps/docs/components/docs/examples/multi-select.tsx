'use client'
import { MultiSelect } from '@betterlibs/react/advanced'
export function MultiSelectExample() {
  return (
    <MultiSelect
      label="Especialidades"
      maxSelected={3}
      options={[
        { value: 'ui', label: 'Interfaces', keywords: ['ui'] },
        { value: 'motion', label: 'Movimiento' },
        { value: 'type', label: 'Tipografía' },
        { value: 'accessibility', label: 'Accesibilidad' },
        { value: 'data', label: 'Datos' },
      ]}
    />
  )
}

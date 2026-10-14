'use client'
import { ToggleGroup } from '@betterlibs/react/advanced'
export function ToggleGroupExample() {
  return (
    <ToggleGroup
      label="Vista de la colección"
      defaultValue={['grid']}
      options={[
        { value: 'grid', label: 'Retícula' },
        { value: 'list', label: 'Lista' },
        { value: 'map', label: 'Mapa', disabled: true },
      ]}
    />
  )
}

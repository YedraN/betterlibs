'use client'
import { DatePicker } from '@betterlibs/react/advanced'
export function DatePickerExample({ range = false }: { range?: boolean }) {
  return (
    <DatePicker
      label={range ? 'Fechas del proyecto' : 'Fecha de entrega'}
      mode={range ? 'range' : 'single'}
      defaultValue={{ start: '2026-10-14' }}
      min="2026-10-01"
      max="2027-12-31"
    />
  )
}

'use client'
import { Slider } from '@betterlibs/react/advanced'
export function SliderExample({ range = false }: { range?: boolean }) {
  return (
    <Slider
      label={range ? 'Intervalo de presupuesto' : 'Tamaño del texto'}
      min={range ? 100 : 14}
      max={range ? 1000 : 48}
      step={range ? 50 : 1}
      defaultValue={range ? [250, 750] : [24]}
      formatValue={(value) => `${value}${range ? ' €' : ' px'}`}
    />
  )
}

'use client'

import { Button } from '@betterlibs/react'
import { useState } from 'react'

export function ButtonsExample() {
  const [saved, setSaved] = useState(false)
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button aria-pressed={saved} onClick={() => setSaved((value) => !value)}>
          {saved ? 'Colección guardada' : 'Guardar colección'}
        </Button>
        <Button variant="outline" disabled>
          Acción no disponible
        </Button>
      </div>
      <p role="status">
        {saved
          ? 'Tu elección se conserva al cambiar el tema.'
          : 'Prueba una acción y compara sus estados.'}
      </p>
    </div>
  )
}

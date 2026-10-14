'use client'
import { Button } from '@betterlibs/react'
import { InlineEdit } from '@betterlibs/react/advanced'
import { useState } from 'react'
export function InlineEditExample() {
  const [name, setName] = useState('Atlas'),
    [fail, setFail] = useState(false)
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-3)' }}>
      <InlineEdit
        label="Nombre de la colección"
        value={name}
        validate={(next) => (next.trim() ? undefined : 'Escribe un nombre.')}
        onSave={async (next) => {
          if (fail) throw new Error('Fallo de ejemplo')
          setName(next.trim())
        }}
      />
      <Button variant="ghost" size="sm" aria-pressed={fail} onClick={() => setFail(!fail)}>
        {fail ? 'Restablecer guardado' : 'Simular error al guardar'}
      </Button>
    </div>
  )
}

'use client'

import { Presence } from '@betterlibs/motion'
import { Button, Card, Field, Input } from '@betterlibs/react'
import { useRef, useState } from 'react'

export function PresenceExample() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('Atlas')
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Button
        ref={trigger}
        aria-expanded={open}
        aria-controls="gallery-details"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Ocultar detalles' : 'Mostrar detalles'}
      </Button>
      <Presence present={open} id="gallery-details" returnFocusRef={trigger}>
        <Card padding="4">
          <Field label="Borrador del detalle">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cerrar detalle
          </Button>
        </Card>
      </Presence>
    </div>
  )
}

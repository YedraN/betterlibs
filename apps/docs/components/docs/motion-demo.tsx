'use client'

import {
  type MotionMode,
  MotionProvider,
  Presence,
  Reveal,
  Stagger,
  useMotionPreferences,
} from '@betterlibs/motion'
import { Button, Card, Field, Input } from '@betterlibs/react'
import { useRef, useState } from 'react'

export function MotionDemo() {
  const [mode, setMode] = useState<MotionMode>('system')
  return (
    <MotionProvider mode={mode}>
      <label>
        Movimiento{' '}
        <select value={mode} onChange={(event) => setMode(event.target.value as MotionMode)}>
          <option value="system">Sistema</option>
          <option value="reduced">Reducido</option>
          <option value="off">Desactivado</option>
        </select>
      </label>
      <MotionSample />
    </MotionProvider>
  )
}

export function MotionSample() {
  const [replay, setReplay] = useState(0)
  const [present, setPresent] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const { enabled } = useMotionPreferences()
  return (
    <div
      style={{ display: 'grid', gap: 'var(--bl-space-4)', paddingBlockStart: 'var(--bl-space-4)' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bl-space-3)' }}>
        <Button onClick={() => setReplay((value) => value + 1)} disabled={!enabled}>
          Repetir entradas
        </Button>
        <Button
          ref={trigger}
          aria-expanded={present}
          aria-controls="motion-details"
          variant="secondary"
          onClick={() => setPresent((value) => !value)}
        >
          {present ? 'Cerrar detalles' : 'Abrir detalles'}
        </Button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: 'var(--bl-space-3)',
        }}
      >
        <Stagger>
          {['Identidad', 'Ritmo', 'Composición'].map((title) => (
            <Reveal key={title} replayKey={replay}>
              <Card padding="4">
                <strong>{title}</strong>
                <p>Contenido visible antes de hidratar.</p>
              </Card>
            </Reveal>
          ))}
        </Stagger>
      </div>
      <Presence present={present} id="motion-details" returnFocusRef={trigger}>
        <Card padding="4">
          <Field label="Nombre de la composición">
            <Input placeholder="Tu próxima idea" />
          </Field>
          <Button variant="ghost" onClick={() => setPresent(false)}>
            Guardar y cerrar
          </Button>
        </Card>
      </Presence>
      <p>
        {enabled
          ? 'Entradas y salidas activas.'
          : 'Contenido inmediato, sin desplazamientos ni secuencias.'}
      </p>
    </div>
  )
}

'use client'

import { ArrowRightIcon } from '@betterlibs/icons'
import {
  AnimatedNumber,
  type MotionMode,
  MotionProvider,
  Presence,
  Reveal,
  Stagger,
  useMotionPreferences,
} from '@betterlibs/motion'
import {
  BentoFeature,
  BentoFeatures,
  Button,
  Card,
  CTA,
  FeatureShowcase,
  Field,
  Hero,
  Input,
} from '@betterlibs/react'
import { useRef, useState } from 'react'

export function AnimatedNumberDemo() {
  const [mode, setMode] = useState<MotionMode>('system')
  return (
    <MotionProvider mode={mode}>
      <div data-motion={mode}>
        <label>
          Movimiento{' '}
          <select value={mode} onChange={(event) => setMode(event.target.value as MotionMode)}>
            <option value="system">Sistema</option>
            <option value="reduced">Reducido</option>
            <option value="off">Desactivado</option>
          </select>
        </label>
        <NumberSample />
      </div>
    </MotionProvider>
  )
}

export function NumberSample() {
  const [value, setValue] = useState(1250.5)
  const [replay, setReplay] = useState(0)
  const { enabled } = useMotionPreferences()
  const [present, setPresent] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <div style={{ display: 'grid', gap: '1rem', paddingBlock: '1rem' }}>
      <p>
        <AnimatedNumber
          value={value}
          startValue={0}
          replayKey={replay}
          format={{ style: 'currency', currency: 'EUR' }}
          style={{ display: 'inline-block', fontSize: 'clamp(2rem, 6vw, 4rem)' }}
        />
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Button onClick={() => setValue((number) => number + 250)}>Aumentar importe</Button>
        <Button variant="outline" onClick={() => setValue((number) => number - 250)}>
          Reducir importe
        </Button>
        <Button
          variant="ghost"
          disabled={!enabled}
          onClick={() => setReplay((number) => number + 1)}
        >
          Repetir cifra
        </Button>
        <Button
          ref={trigger}
          variant="outline"
          aria-expanded={present}
          aria-controls="number-details"
          onClick={() => setPresent(!present)}
        >
          {present ? 'Cerrar detalles' : 'Abrir detalles'}
        </Button>
      </div>
      <Presence present={present} id="number-details" returnFocusRef={trigger}>
        <Card>
          <Field label="Nombre de la colección">
            <Input />
          </Field>
          <Button onClick={() => setPresent(false)}>Guardar y cerrar</Button>
        </Card>
      </Presence>
    </div>
  )
}

export function EditorialPageDemo() {
  const [mode, setMode] = useState<MotionMode>('system')
  const [replay, setReplay] = useState(0)
  return (
    <MotionProvider mode={mode}>
      <div data-preset="editorial" data-motion={mode}>
        <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label>
            Movimiento{' '}
            <select value={mode} onChange={(event) => setMode(event.target.value as MotionMode)}>
              <option value="system">Sistema</option>
              <option value="reduced">Reducido</option>
              <option value="off">Desactivado</option>
            </select>
          </label>
          <Button variant="outline" onClick={() => setReplay((number) => number + 1)}>
            Repetir entradas
          </Button>
        </div>
        <Hero
          id="editorial-demo-hero"
          variant="editorial"
          headingLevel={2}
          title="Contenido con voz propia"
          description="Una página empieza con una buena historia. Elige las piezas y dales tu carácter."
          actions={
            <Button asChild iconEnd={<ArrowRightIcon />}>
              <a href="#editorial-demo-showcase">Explorar ejemplos</a>
            </Button>
          }
          media={
            <Card>
              <strong>Tu colección</strong>
              <AnimatedNumber
                value={8}
                startValue={0}
                replayKey={replay}
                style={{ fontSize: '4rem' }}
              />
              <p>Ocho piezas para empezar.</p>
            </Card>
          }
        />
        <BentoFeatures
          id="editorial-demo-bento"
          title="Cuatro formas de contar"
          description="Composiciones con diferente peso, sin depender de una imagen."
        >
          <Stagger>
            {['Identidad', 'Movimiento', 'Interacción', 'Composición'].map((title, index) => (
              <Reveal key={title} replayKey={replay}>
                <BentoFeature
                  title={title}
                  tone={index === 0 ? 'brand' : 'default'}
                  description="Contenido que se adapta a tu página, en escritorio y móvil."
                />
              </Reveal>
            ))}
          </Stagger>
        </BentoFeatures>
        <FeatureShowcase
          id="editorial-demo-showcase"
          title="Elige tu siguiente paso"
          selectorLabel="Ejemplos editoriales"
          items={[
            {
              value: 'read',
              label: 'Leer',
              content: (
                <Card>
                  <h3>Un espacio para tu historia</h3>
                  <p>Contenido de lectura, con una jerarquía clara.</p>
                  <a href="#editorial-demo-hero">Volver a la portada</a>
                </Card>
              ),
            },
            {
              value: 'edit',
              label: 'Editar',
              content: (
                <Card>
                  <Field label="Nombre de tu proyecto">
                    <Input defaultValue="Mi próxima idea" />
                  </Field>
                  <Button>Guardar proyecto</Button>
                </Card>
              ),
            },
            {
              value: 'later',
              label: 'Próximamente',
              content: 'Disponible más adelante.',
              disabled: true,
            },
          ]}
        />
        <CTA
          id="editorial-demo-cta"
          panelTone="inverse"
          title="Dale forma a tu próxima idea"
          description="Combina las piezas y crea una página propia."
          actions={
            <Button asChild>
              <a href="#editorial-demo-showcase">Empezar</a>
            </Button>
          }
        />
      </div>
    </MotionProvider>
  )
}

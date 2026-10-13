'use client'

import {
  type MotionMode,
  MotionProvider,
  ScrollProgress,
  TextReveal,
  useMotionPreferences,
} from '@betterlibs/motion'
import {
  BlogGrid,
  Button,
  FAQ,
  LogoCloud,
  Pricing,
  Stats,
  TeamGrid,
  Testimonials,
  Timeline,
} from '@betterlibs/react'
import { useState } from 'react'

export function ReadingDemo() {
  const [mode, setMode] = useState<MotionMode>('system')
  const [replay, setReplay] = useState(0)
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
        <h3
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.1, marginBlock: '1.5rem' }}
        >
          <TextReveal lines={['Espacio para leer.', 'Tiempo para entender.']} replayKey={replay} />
        </h3>
        <ReadingRepeat onRepeat={() => setReplay((value) => value + 1)} />
        <p>Esta barra sigue la lectura del documento sin interpolación ni anuncios continuos.</p>
        <ScrollProgress
          style={{ width: '100%', height: 8, accentColor: 'var(--bl-color-accent-text)' }}
        />
      </div>
    </MotionProvider>
  )
}

function ReadingRepeat({ onRepeat }: { onRepeat: () => void }) {
  const { enabled } = useMotionPreferences()
  return (
    <Button onClick={onRepeat} disabled={!enabled}>
      Repetir texto
    </Button>
  )
}

export function SectionPatternsDemo() {
  return (
    <>
      <Pricing
        title="Un plan para cada etapa"
        spacing="sm"
        billingPeriods={[
          { value: 'month', label: 'Mensual' },
          { value: 'year', label: 'Anual' },
        ]}
        columns={{ base: 1, md: 2 }}
        plans={[
          {
            name: 'Inicio',
            price: { month: '12 €', year: '115,20 €' },
            period: { month: '/mes', year: '/año' },
            note: { month: 'Pago mensual', year: 'Equivale a 9,60 €/mes' },
            features: ['Proyectos ilimitados', 'Un espacio de equipo'],
            action: (
              <Button asChild variant="outline">
                <a href="#preguntas-planes">Ver condiciones de Inicio</a>
              </Button>
            ),
          },
          {
            name: 'Equipo',
            price: { month: '24 €', year: '230,40 €' },
            period: { month: '/mes', year: '/año' },
            note: { month: 'Pago mensual', year: 'Equivale a 19,20 €/mes' },
            highlighted: true,
            features: ['Todo lo de Inicio', 'Permisos e invitados'],
            action: (
              <Button asChild>
                <a href="#preguntas-planes">Ver condiciones de Equipo</a>
              </Button>
            ),
          },
        ]}
      />
      <Testimonials
        title="Una experiencia compartida"
        spacing="sm"
        variant="carousel"
        carouselLabel="Experiencias del equipo"
        testimonials={[
          {
            name: 'Lucía Moreno',
            role: 'Producto · ejemplo',
            quote:
              'Ahora el proyecto tiene un lugar claro y el equipo sabe cuál es el siguiente paso.',
          },
          {
            name: 'Diego Vidal',
            role: 'Diseño · ejemplo',
            quote: 'La estructura nos deja trabajar con calma, incluso cuando cambia la prioridad.',
          },
        ]}
        columns={{ base: 1, md: 2 }}
      />
      <FAQ
        id="preguntas-planes"
        title="Condiciones claras"
        spacing="sm"
        variant="split"
        items={[
          {
            question: '¿Qué significa facturación anual?',
            answer:
              'El precio anual se paga una vez al año. La equivalencia mensual sirve para comparar; no es el importe del cobro.',
          },
          {
            question: '¿Puedo cambiar de plan?',
            answer:
              'Estas condiciones son una demostración. Explica aquí los plazos y requisitos de tu servicio real.',
          },
        ]}
      />
    </>
  )
}

export function RemainingSectionsDemo() {
  return (
    <>
      <LogoCloud
        title="Marcas que comparten una forma de trabajar"
        variant="grid"
        spacing="sm"
        logos={[
          { name: 'Luma', logo: <strong>Luma</strong> },
          { name: 'Forma', logo: <strong>Forma</strong> },
          { name: 'Atlas', logo: <strong>Atlas</strong> },
        ]}
      />
      <Stats
        title="Un proyecto de ejemplo, en cifras"
        spacing="sm"
        variant="cards"
        columns={{ base: 1, md: 3 }}
        stats={[
          { value: '2', label: 'Casos de trabajo', description: 'Con contexto y entregables' },
          {
            value: '4',
            label: 'Etapas de proceso',
            description: 'De la pregunta al acompañamiento',
          },
          {
            value: '3',
            label: 'Plantillas completas',
            description: 'Producto, estudio y artículo',
          },
        ]}
      />
      <Timeline
        title="Un proceso que se puede explicar"
        variant="steps"
        spacing="sm"
        items={[
          { title: 'Escuchar', description: 'Definimos qué necesita cambiar.' },
          { title: 'Probar', description: 'Comparamos direcciones con contenido real.' },
          { title: 'Entregar', description: 'Documentamos el sistema para que siga creciendo.' },
        ]}
      />
      <TeamGrid
        title="Personas detrás del trabajo"
        spacing="sm"
        variant="compact"
        columns={{ base: 1, md: 2 }}
        members={[
          { name: 'Clara Soler', role: 'Estrategia · ejemplo' },
          { name: 'Diego Vidal', role: 'Diseño · ejemplo' },
        ]}
      />
      <BlogGrid
        title="Lecturas para seguir pensando"
        spacing="sm"
        columns={{ base: 1, md: 2 }}
        posts={[
          {
            title: 'Diseñar para que se lea',
            href: '/docs/guias/lectura-y-texto',
            excerpt: 'Jerarquía, ritmo y entradas que conservan la lectura.',
          },
          {
            title: 'Llegar y poder volver',
            href: '/docs/guias/navegacion-de-paginas',
            excerpt: 'Historial, foco y scroll que acompañan al contenido.',
          },
        ]}
      />
    </>
  )
}

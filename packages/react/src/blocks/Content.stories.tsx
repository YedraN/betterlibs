import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../components/Button/Button'
import { features, logos, milestones, stats, steps } from '../test/sample-data'
import { CTA } from './CTA/CTA'
import { FeatureGrid } from './FeatureGrid/FeatureGrid'
import { LogoCloud } from './LogoCloud/LogoCloud'
import { Stats } from './Stats/Stats'
import { Timeline } from './Timeline/Timeline'

const meta = {
  title: 'Bloques/Contenido',
  component: FeatureGrid,
  args: {
    eyebrow: 'Servicios',
    title: 'Todo lo que tu empresa necesita',
    description: 'Un equipo, tres especialidades y un mismo objetivo: que crezcas con orden.',
    features,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['cards', 'plain', 'list'] },
    tone: { control: 'select', options: ['default', 'subtle', 'muted', 'brand', 'dark'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FeatureGrid>
export default meta
type Story = StoryObj<typeof meta>

export const Caracteristicas: Story = { name: 'FeatureGrid' }

export const CaracteristicasSimples: Story = {
  name: 'FeatureGrid simple',
  args: { variant: 'plain', align: 'center', tone: 'subtle' },
}

export const CaracteristicasLista: Story = {
  name: 'FeatureGrid en lista',
  args: { variant: 'list' },
}

export const Logos: StoryObj<typeof LogoCloud> = {
  name: 'LogoCloud',
  render: () => (
    <>
      <LogoCloud title="Más de 500 empresas confían en nosotros" logos={logos} />
      <LogoCloud
        title="Nuestros clientes"
        logos={logos}
        variant="grid"
        align="start"
        tone="subtle"
      />
    </>
  ),
}

export const Cifras: StoryObj<typeof Stats> = {
  name: 'Stats',
  render: () => (
    <>
      <Stats title="Resultados que hablan por nosotros" stats={stats} />
      <Stats stats={stats} variant="cards" tone="subtle" />
      <Stats stats={stats} variant="divided" tone="dark" />
    </>
  ),
}

export const LineaTemporal: StoryObj<typeof Timeline> = {
  name: 'Timeline',
  render: () => (
    <>
      <Timeline
        eyebrow="Historia"
        title="20 años creciendo con nuestros clientes"
        items={milestones}
      />
      <Timeline
        title="Cómo trabajamos"
        items={steps}
        variant="steps"
        tone="subtle"
        align="center"
      />
    </>
  ),
}

export const LlamadaALaAccion: StoryObj<typeof CTA> = {
  name: 'CTA',
  render: () => (
    <>
      <CTA
        title="Hablemos de tu proyecto"
        description="Una primera reunión sin compromiso para entender qué necesitas."
        actions={
          <>
            <Button size="lg">Solicitar reunión</Button>
            <Button size="lg" variant="outline">
              Llamar al 910 000 000
            </Button>
          </>
        }
        note="Sin compromiso · Respuesta en 24 horas"
      />
      <CTA
        variant="split"
        tone="subtle"
        title="¿Listo para ordenar tus finanzas?"
        description="Empieza hoy y ten tu primer informe en dos semanas."
        actions={<Button>Empezar ahora</Button>}
      />
      <CTA
        variant="panel"
        panelTone="dark"
        title="Descarga el informe de tendencias 2026"
        actions={<Button>Descargar (PDF, 2 MB)</Button>}
      />
    </>
  ),
}

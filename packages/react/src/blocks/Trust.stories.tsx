import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from '../components/Grid/Grid'
import { photo, posts, team, testimonials } from '../test/sample-data'
import { BlogGrid } from './Blog/BlogGrid'
import { CaseStudyCard } from './CaseStudyCard/CaseStudyCard'
import { TeamGrid } from './TeamGrid/TeamGrid'
import { Testimonials } from './Testimonials/Testimonials'

const meta = {
  title: 'Bloques/Confianza y blog',
  component: Testimonials,
  args: { title: 'Lo que dicen nuestros clientes', testimonials },
  argTypes: {
    variant: { control: 'inline-radio', options: ['grid', 'carousel', 'featured'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Testimonials>
export default meta
type Story = StoryObj<typeof meta>

export const Testimonios: Story = { name: 'Testimonials' }

export const TestimoniosCarrusel: Story = {
  name: 'Testimonials en carrusel',
  args: { variant: 'carousel', columns: { base: 1, md: 2 }, tone: 'subtle' },
}

export const TestimonioDestacado: Story = {
  name: 'Testimonial destacado',
  args: { variant: 'featured', title: undefined },
}

export const Equipo: StoryObj<typeof TeamGrid> = {
  name: 'TeamGrid',
  render: () => (
    <>
      <TeamGrid eyebrow="Equipo" title="Las personas detrás de Norte" members={team} />
      <TeamGrid title="Equipo de auditoría" members={team} variant="compact" tone="subtle" />
    </>
  ),
}

export const Casos: StoryObj<typeof CaseStudyCard> = {
  name: 'CaseStudyCard',
  render: () => (
    <div style={{ padding: 'var(--bl-space-8)' }}>
      <Grid columns={{ base: 1, md: 2, lg: 3 }}>
        <CaseStudyCard
          title="Cómo Norte Industrial redujo a la mitad su cierre mensual"
          href="#caso-1"
          client="Norte Industrial"
          tags={['Industria', 'Auditoría']}
          summary="Automatizamos la conciliación y rediseñamos el calendario de cierre."
          metrics={[
            { value: '-50 %', label: 'tiempo de cierre' },
            { value: '3 meses', label: 'de proyecto' },
          ]}
          image={{ src: photo('caso1') }}
        />
        <CaseStudyCard
          title="Clínicas Sanare: un cuadro de mando para 14 centros"
          href="#caso-2"
          client="Clínicas Sanare"
          tags={['Salud']}
          metrics={[{ value: '14', label: 'centros conectados' }]}
          image={{ src: photo('caso2') }}
        />
        <CaseStudyCard
          title="Vela multiplicó sus contactos con una web nueva"
          href="#caso-3"
          client="Vela"
          tags={['Retail', 'Marketing']}
          metrics={[{ value: '+40 %', label: 'contactos' }]}
        />
      </Grid>
    </div>
  ),
}

export const Blog: StoryObj<typeof BlogGrid> = {
  name: 'BlogGrid',
  render: () => (
    <>
      <BlogGrid title="Últimos artículos" posts={posts} />
      <BlogGrid title="Destacado" posts={posts} variant="featured" tone="subtle" />
      <BlogGrid title="Todas las noticias" posts={posts} variant="list" containerSize="lg" />
    </>
  ),
}

import { BarChartIcon, ShieldCheckIcon, UsersIcon, ZapIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from '../Grid/Grid'
import { Heading } from '../Heading/Heading'
import { IconTile } from '../IconTile/IconTile'
import { Section } from '../Section/Section'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Card } from './Card'

const meta = {
  title: 'Componentes/Contenido/Card',
  component: Card,
  args: { variant: 'elevated', interactive: false },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['elevated', 'outline', 'glass', 'gradient', 'glow'],
    },
  },
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: '22rem' }}>
      <IconTile>
        <BarChartIcon />
      </IconTile>
      <Heading level={3} size="lg">
        Analítica
      </Heading>
      <Text tone="muted">Cuadros de mando que se entienden a la primera.</Text>
    </Card>
  ),
}

const variants = ['elevated', 'outline', 'glass', 'gradient', 'glow'] as const

export const Variantes: Story = {
  render: () => (
    <Section background="mesh" spacing="sm">
      <Grid columns={{ base: 1, sm: 2, lg: 5 }} gap="6" style={{ padding: '0 1.5rem' }}>
        {variants.map((variant) => (
          <Card key={variant} variant={variant}>
            <Text weight="semibold">{variant}</Text>
            <Text size="sm" tone="muted">
              Superficie {variant}
            </Text>
          </Card>
        ))}
      </Grid>
    </Section>
  ),
}

const services = [
  { icon: <BarChartIcon />, title: 'Analítica', text: 'Datos claros para decidir.' },
  { icon: <ShieldCheckIcon />, title: 'Auditoría', text: 'Revisión independiente.' },
  { icon: <UsersIcon />, title: 'Consultoría', text: 'Te acompañamos al crecer.' },
]

export const Enlazadas: Story = {
  name: 'Tarjetas enlazadas',
  render: () => (
    <Grid columns={{ base: 1, md: 3 }} gap="6">
      {services.map((service) => (
        <Card key={service.title} interactive variant="gradient">
          <IconTile>{service.icon}</IconTile>
          <Heading level={3} size="lg">
            <a className="bl-card-link" href={`#${service.title}`}>
              {service.title}
            </a>
          </Heading>
          <Text tone="muted">{service.text}</Text>
        </Card>
      ))}
    </Grid>
  ),
}

export const Baldosas: Story = {
  name: 'IconTile',
  render: () => (
    <Stack direction="row" gap="4" align="center">
      <IconTile size="sm">
        <ZapIcon />
      </IconTile>
      <IconTile>
        <ZapIcon />
      </IconTile>
      <IconTile size="lg">
        <ZapIcon />
      </IconTile>
      <IconTile tone="solid">
        <ZapIcon />
      </IconTile>
      <IconTile tone="neutral">
        <ZapIcon />
      </IconTile>
    </Stack>
  ),
}

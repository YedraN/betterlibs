import { BarChartIcon, ShieldCheckIcon, UsersIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from '../AspectRatio/AspectRatio'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Container } from '../Container/Container'
import { Divider } from '../Divider/Divider'
import { Grid } from '../Grid/Grid'
import { Heading } from '../Heading/Heading'
import { Icon } from '../Icon/Icon'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Section } from './Section'

const meta = {
  title: 'Componentes/Layout/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
  args: { tone: 'default', spacing: 'md' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['default', 'subtle', 'muted', 'brand', 'dark', 'light'],
    },
    spacing: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Section>
export default meta
type Story = StoryObj<typeof meta>

const features = [
  {
    icon: <UsersIcon />,
    title: 'Equipo dedicado',
    text: 'Un interlocutor único que conoce tu negocio.',
  },
  {
    icon: <BarChartIcon />,
    title: 'Resultados medibles',
    text: 'Informes mensuales con indicadores claros.',
  },
  {
    icon: <ShieldCheckIcon />,
    title: 'Cumplimiento',
    text: 'Procesos alineados con RGPD e ISO 27001.',
  },
]

const clients = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne', 'Tyrell']

export const Playground: Story = {
  render: (args) => (
    <Section {...args} aria-labelledby="demo-title">
      <Container>
        <Stack gap="10">
          <Stack gap="3" style={{ maxWidth: '40rem' }}>
            <Text variant="eyebrow">Por qué elegirnos</Text>
            <Heading id="demo-title">Todo lo que necesitas para crecer con seguridad</Heading>
            <Text variant="lead">
              Tres compromisos que cumplimos con cada cliente desde el primer día.
            </Text>
          </Stack>
          <Grid columns={{ base: 1, md: 3 }} gap="6">
            {features.map((f) => (
              <Box key={f.title} padding="6" radius="lg" tone="raised" bordered>
                <Stack gap="3">
                  <Icon contained size="lg">
                    {f.icon}
                  </Icon>
                  <Heading level={3} size="md">
                    {f.title}
                  </Heading>
                  <Text tone="muted">{f.text}</Text>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  ),
}

export const Tonos: Story = {
  render: () => (
    <>
      {(['default', 'subtle', 'brand', 'dark'] as const).map((tone) => (
        <Section key={tone} tone={tone} spacing="sm" aria-label={`Sección ${tone}`}>
          <Container>
            <Stack direction="row" justify="between" align="center" stackBelow="md" gap="6">
              <Stack gap="2">
                <Heading level={2} size="xl">
                  Sección con tono «{tone}»
                </Heading>
                <Text tone="muted">Todo el contenido se adapta al fondo automáticamente.</Text>
              </Stack>
              <Button>Hablar con ventas</Button>
            </Stack>
          </Container>
        </Section>
      ))}
    </>
  ),
}

export const RejillaAutomatica: StoryObj<typeof Grid> = {
  name: 'Grid automático',
  render: () => (
    <Section aria-label="Rejilla">
      <Container>
        <Grid minItemWidth="14rem" gap="4">
          {clients.map((client) => (
            <Box key={client} padding="8" tone="subtle" radius="md">
              <Text align="center" tone="muted">
                {client}
              </Text>
            </Box>
          ))}
        </Grid>
      </Container>
    </Section>
  ),
}

export const DividerYAspectRatio: Story = {
  name: 'Divider y AspectRatio',
  render: () => (
    <Section aria-label="Utilidades">
      <Container size="md">
        <Stack gap="6">
          <AspectRatio ratio={16 / 9} style={{ borderRadius: 'var(--bl-radius-lg)' }}>
            <img
              src="https://picsum.photos/seed/oficina/1200/675"
              alt="Sala de reuniones luminosa"
            />
          </AspectRatio>
          <Divider label="o" />
          <Stack direction="row" gap="4" align="center">
            <Text>Madrid</Text>
            <Divider orientation="vertical" />
            <Text>Barcelona</Text>
            <Divider orientation="vertical" />
            <Text>Valencia</Text>
          </Stack>
        </Stack>
      </Container>
    </Section>
  ),
}

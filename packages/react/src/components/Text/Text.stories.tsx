import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stack } from '../Stack/Stack'
import { Text } from './Text'

const meta = {
  title: 'Componentes/Tipografía/Text',
  component: Text,
  args: {
    children:
      'Acompañamos a empresas en su transformación digital con equipos cercanos y resultados medibles.',
    variant: 'body',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['body', 'lead', 'eyebrow', 'caption', 'label'] },
    tone: {
      control: 'select',
      options: [undefined, 'default', 'muted', 'subtle', 'accent', 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<typeof Text>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variantes: Story = {
  render: () => (
    <Stack gap="5" style={{ maxWidth: '42rem' }}>
      <Text variant="eyebrow">Eyebrow · antetítulo</Text>
      <Text variant="lead">
        Lead · entradilla bajo un titular, más grande y en tono secundario.
      </Text>
      <Text>Body · texto de párrafo con interlineado cómodo para leer.</Text>
      <Text variant="label">Label · etiquetas y metadatos</Text>
      <Text variant="caption">Caption · pies de foto y notas.</Text>
    </Stack>
  ),
}

export const Truncado: Story = {
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <Text lines={2}>
        Este extracto se corta a dos líneas con puntos suspensivos para que las tarjetas del blog
        mantengan la misma altura aunque el texto sea largo.
      </Text>
    </div>
  ),
}

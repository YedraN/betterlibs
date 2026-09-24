import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from '../Link/Link'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Heading } from './Heading'

const meta = {
  title: 'Componentes/Tipografía/Heading',
  component: Heading,
  args: { children: 'Soluciones para empresas que quieren crecer', level: 2 },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '`level` define la estructura (h1–h6) y `size` el aspecto. Usa un solo `h1` por página y no te saltes niveles.',
      },
    },
  },
} satisfies Meta<typeof Heading>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Niveles: Story = {
  render: () => (
    <Stack gap="4">
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          Título de nivel {level}
        </Heading>
      ))}
    </Stack>
  ),
}

export const BloqueDeTexto: Story = {
  name: 'Bloque de texto',
  render: () => (
    <Stack gap="4" style={{ maxWidth: '42rem' }}>
      <Text variant="eyebrow">Servicios</Text>
      <Heading level={2}>Asesoría fiscal para pymes</Heading>
      <Text variant="lead">
        Te ayudamos a cumplir con Hacienda y a pagar lo justo, con un gestor asignado que conoce tu
        negocio.
      </Text>
      <Text>
        Revisamos tu situación cada trimestre, preparamos tus declaraciones y te avisamos de
        cualquier cambio normativo que te afecte.{' '}
        <Link href="#tarifas">Consulta nuestras tarifas</Link>.
      </Text>
      <Text variant="caption">Precios sin IVA. Actualizado en septiembre de 2026.</Text>
    </Stack>
  ),
}

export const Link_: StoryObj<typeof Link> = {
  name: 'Link',
  render: () => (
    <Stack gap="3">
      <Text>
        Enlace en línea: consulta nuestra <Link href="#privacidad">política de privacidad</Link>.
      </Text>
      <Link href="#casos" variant="standalone" arrow>
        Ver todos los casos de éxito
      </Link>
      <Link href="https://example.com" target="_blank" variant="standalone">
        Informe anual 2025 (PDF)
      </Link>
      <Link href="#aviso-legal" variant="subtle">
        Aviso legal
      </Link>
    </Stack>
  ),
}

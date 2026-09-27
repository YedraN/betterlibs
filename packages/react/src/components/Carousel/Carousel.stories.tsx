import { QuoteIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../Avatar/Avatar'
import { Box } from '../Box/Box'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Carousel } from './Carousel'

const testimonials = [
  {
    name: 'Ana Pérez',
    role: 'Directora financiera, Norte Industrial',
    text: 'Redujimos a la mitad el tiempo de cierre mensual.',
  },
  {
    name: 'Luis Martín',
    role: 'CEO, Clínicas Sanare',
    text: 'Un equipo que entiende el negocio, no solo la tecnología.',
  },
  {
    name: 'Sara Gil',
    role: 'Responsable de marketing, Vela',
    text: 'Las solicitudes de contacto crecieron un 40 % en tres meses.',
  },
  {
    name: 'Jorge Ramos',
    role: 'Gerente, Ramos Abogados',
    text: 'La web nueva transmite por fin lo que somos.',
  },
  {
    name: 'Marta León',
    role: 'COO, Logística Delta',
    text: 'Plazos cumplidos y comunicación clara en todo momento.',
  },
]

const slides = testimonials.map((item) => (
  <Box key={item.name} padding="6" radius="lg" bordered style={{ height: '100%' }}>
    <Stack gap="4">
      <QuoteIcon
        aria-hidden="true"
        style={{ fontSize: '1.5rem', color: 'var(--bl-color-accent-text)' }}
      />
      <Text variant="lead">{item.text}</Text>
      <Stack direction="row" gap="3" align="center">
        <Avatar name={item.name} alt="" size="sm" />
        <div>
          <Text weight="semibold">{item.name}</Text>
          <Text size="sm" tone="muted">
            {item.role}
          </Text>
        </div>
      </Stack>
    </Stack>
  </Box>
))

const meta = {
  title: 'Componentes/Contenido interactivo/Carousel',
  component: Carousel,
  args: { label: 'Testimonios de clientes', children: slides },
  parameters: {
    docs: {
      description: {
        component:
          'Carrusel accesible (patrón WAI-ARIA) sobre scroll nativo con `scroll-snap`: táctil, trackpad y teclado. **Sin autoplay por defecto.** Si lo activas, hay botón de pausa, se detiene al pasar el ratón o entrar con el teclado y respeta «reducir movimiento».',
      },
    },
  },
} satisfies Meta<typeof Carousel>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const VariasPorVista: Story = {
  name: 'Varias por vista',
  args: { slidesPerView: { base: 1, md: 2, lg: 3 } },
}

export const Automatico: Story = {
  name: 'Con autoplay',
  args: { autoplay: 5000, slidesPerView: { base: 1, md: 2 } },
}

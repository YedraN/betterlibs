import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '../Box/Box'
import { Grid } from '../Grid/Grid'
import { SkipLink } from '../SkipLink/SkipLink'
import { Spinner } from '../Spinner/Spinner'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Componentes/Feedback/Skeleton',
  component: Skeleton,
  args: { variant: 'text', lines: 3 },
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TarjetasCargando: Story = {
  name: 'Tarjetas cargando',
  render: () => (
    <Grid columns={{ base: 1, md: 3 }} aria-busy="true" aria-label="Cargando artículos">
      {[1, 2, 3].map((i) => (
        <Box key={i} padding="5" bordered radius="lg">
          <Stack gap="3">
            <Skeleton variant="rect" height="10rem" />
            <Skeleton width="40%" />
            <Skeleton lines={3} />
            <Stack direction="row" gap="3" align="center">
              <Skeleton variant="circle" width="2rem" />
              <Skeleton width="8rem" />
            </Stack>
          </Stack>
        </Box>
      ))}
    </Grid>
  ),
}

export const Spinners: StoryObj<typeof Spinner> = {
  render: () => (
    <Stack direction="row" gap="6" align="center">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" label="Cargando resultados" />
    </Stack>
  ),
}

export const Accesibilidad: StoryObj<typeof SkipLink> = {
  name: 'SkipLink y VisuallyHidden',
  render: () => (
    <Stack gap="4">
      <Text>
        Pulsa <kbd>Tab</kbd> dentro de este lienzo para ver el enlace de salto.
      </Text>
      <SkipLink href="#contenido" />
      <Text id="contenido">
        <a href="#servicios">
          Leer más<VisuallyHidden> sobre nuestros servicios de auditoría</VisuallyHidden>
        </a>
      </Text>
    </Stack>
  ),
}

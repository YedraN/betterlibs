import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Link } from '../Link/Link'
import { Stack } from '../Stack/Stack'
import { Alert } from './Alert'

const meta = {
  title: 'Componentes/Feedback/Alert',
  component: Alert,
  args: {
    tone: 'info',
    title: 'Horario de verano',
    children: 'Del 1 de julio al 31 de agosto atendemos de 8 a 15 h.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Mensaje destacado dentro de la página. El color siempre va acompañado de icono y texto. Si aparece tras una acción, añade `role="status"` (o `role="alert"` si es urgente) para que se anuncie.',
      },
    },
  },
} satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

function DismissibleDemo() {
  const [open, setOpen] = useState(true)
  if (!open) return <Button onClick={() => setOpen(true)}>Mostrar aviso</Button>
  return (
    <Alert tone="warning" title="Mantenimiento programado" onDismiss={() => setOpen(false)}>
      El área de clientes no estará disponible el sábado de 2 a 4 h.
    </Alert>
  )
}

export const Tonos: Story = {
  render: () => (
    <Stack gap="4" style={{ maxWidth: '40rem' }}>
      <Alert tone="info" title="Novedad">
        Ya puedes descargar tus facturas desde el área de clientes.
      </Alert>
      <Alert tone="success" title="Hemos recibido tu mensaje">
        Te responderemos en un plazo de 24 horas laborables.
      </Alert>
      <DismissibleDemo />
      <Alert
        tone="danger"
        title="No hemos podido enviar tu mensaje"
        actions={
          <Link href="mailto:hola@empresa.com" variant="standalone">
            Escríbenos a hola@empresa.com
          </Link>
        }
      >
        Inténtalo de nuevo en unos minutos.
      </Alert>
      <Alert tone="info">Aviso sin título, solo con texto.</Alert>
    </Stack>
  ),
}

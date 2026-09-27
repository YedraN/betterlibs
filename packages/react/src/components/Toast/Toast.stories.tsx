import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button/Button'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup'
import { toast } from './store'
import { Toaster } from './Toaster'

const meta = {
  title: 'Componentes/Feedback/Toast',
  component: Toaster,
  args: { position: 'bottom-right' },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Notificaciones temporales con `toast()`. Monta `<Toaster />` una vez. Se anuncian a los lectores de pantalla (los errores, de inmediato), se pausan al pasar el ratón o enfocarlas, F8 lleva el foco a ellas y se pueden descartar deslizando. Si tienen acción, no se cierran solas.',
      },
    },
  },
} satisfies Meta<typeof Toaster>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <>
      <ButtonGroup>
        <Button variant="outline" onClick={() => toast.success('Cambios guardados')}>
          Éxito
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Nueva versión disponible',
              description: 'Recarga la página para ver las novedades.',
            })
          }
        >
          Información
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning('Tu sesión caduca en 5 minutos', {
              description: 'Guarda los cambios para no perderlos.',
            })
          }
        >
          Aviso
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('No hemos podido enviar tu mensaje', {
              description: 'Revisa tu conexión e inténtalo de nuevo.',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Artículo archivado',
              action: {
                label: 'Deshacer',
                altText: 'Para deshacerlo, ve a Archivados',
                onClick: () => toast.success('Artículo restaurado'),
              },
            })
          }
        >
          Con acción
        </Button>
      </ButtonGroup>
      <Toaster {...args} />
    </>
  ),
}

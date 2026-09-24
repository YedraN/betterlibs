import { ArrowRightIcon, DownloadIcon, MailIcon, SearchIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup'
import { IconButton } from '../IconButton/IconButton'
import { Button } from './Button'

const meta = {
  title: 'Componentes/Acciones/Button',
  component: Button,
  args: { children: 'Solicitar propuesta', variant: 'primary', size: 'md' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Para acciones. Usa **un solo `primary` por bloque**. Para navegar usa `asChild` con un enlace. El texto empieza por un verbo y describe el resultado: «Descargar informe», no «Aceptar».',
      },
    },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variantes: Story = {
  render: (args) => (
    <ButtonGroup>
      <Button {...args} variant="primary">
        Principal
      </Button>
      <Button {...args} variant="secondary">
        Secundario
      </Button>
      <Button {...args} variant="outline">
        Contorno
      </Button>
      <Button {...args} variant="ghost">
        Fantasma
      </Button>
      <Button {...args} variant="danger">
        Eliminar
      </Button>
    </ButtonGroup>
  ),
}

export const Tamanos: Story = {
  name: 'Tamaños',
  render: (args) => (
    <ButtonGroup align="start">
      <Button {...args} size="sm">
        Pequeño
      </Button>
      <Button {...args} size="md">
        Mediano (44px)
      </Button>
      <Button {...args} size="lg">
        Grande
      </Button>
    </ButtonGroup>
  ),
}

export const ConIconos: Story = {
  name: 'Con iconos',
  render: (args) => (
    <ButtonGroup>
      <Button {...args} iconEnd={<ArrowRightIcon />}>
        Empezar ahora
      </Button>
      <Button {...args} variant="outline" iconStart={<DownloadIcon />}>
        Descargar dossier (PDF)
      </Button>
      <IconButton label="Buscar" variant="outline">
        <SearchIcon />
      </IconButton>
      <IconButton label="Escríbenos" shape="circle" variant="secondary">
        <MailIcon />
      </IconButton>
    </ButtonGroup>
  ),
}

function LoadingDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      loading={loading}
      loadingLabel="Enviando solicitud…"
      onClick={() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
      }}
    >
      Enviar solicitud
    </Button>
  )
}

export const Estados: Story = {
  render: () => (
    <ButtonGroup>
      <LoadingDemo />
      <Button disabled>Deshabilitado</Button>
      <Button variant="outline" disabled>
        Deshabilitado
      </Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`loading` mantiene el ancho y el foco, y anuncia la carga. Evita `disabled` sin explicar por qué: es mejor dejar pulsar y mostrar qué falta.',
      },
    },
  },
}

export const ComoEnlace: Story = {
  name: 'Como enlace (asChild)',
  render: (args) => (
    <Button {...args} asChild iconEnd={<ArrowRightIcon />}>
      <a href="#contacto">Hablar con un experto</a>
    </Button>
  ),
}

export const AnchoCompleto: Story = {
  name: 'Ancho completo',
  render: (args) => (
    <div style={{ maxWidth: '24rem' }}>
      <Button {...args} fullWidth>
        Crear cuenta
      </Button>
    </div>
  ),
}

export const GrupoApilado: Story = {
  name: 'Grupo apilado en móvil',
  render: () => (
    <ButtonGroup stackBelow="md" aria-label="Acciones del hero">
      <Button size="lg">Solicitar demo</Button>
      <Button size="lg" variant="outline">
        Ver precios
      </Button>
    </ButtonGroup>
  ),
}

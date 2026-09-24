import { CheckIcon, MailIcon, PhoneIcon, StarIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Avatar, AvatarGroup } from '../Avatar/Avatar'
import { Icon } from '../Icon/Icon'
import { Image } from '../Image/Image'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'
import { Badge } from './Badge'

const meta = {
  title: 'Componentes/Contenido/Badge',
  component: Badge,
  args: { children: 'Nuevo', tone: 'accent', variant: 'subtle' },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    },
    variant: { control: 'inline-radio', options: ['subtle', 'solid', 'outline'] },
  },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

export const Playground: Story = {}

export const Tonos: Story = {
  render: () => (
    <Stack gap="3">
      {(['subtle', 'solid', 'outline'] as const).map((variant) => (
        <Stack key={variant} direction="row" gap="2" wrap>
          {tones.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {tone}
            </Badge>
          ))}
        </Stack>
      ))}
      <Stack direction="row" gap="2">
        <Badge tone="success" dot>
          Disponible
        </Badge>
        <Badge tone="info" icon={<StarIcon />}>
          Destacado
        </Badge>
        <Badge size="sm">Beta</Badge>
      </Stack>
    </Stack>
  ),
}

function TagsDemo() {
  const [filters, setFilters] = useState(['Madrid', 'Consultoría', 'Remoto'])
  return (
    <Stack gap="4">
      <Stack direction="row" gap="2" wrap>
        {filters.map((f) => (
          <Tag key={f} selected onRemove={() => setFilters((all) => all.filter((x) => x !== f))}>
            {f}
          </Tag>
        ))}
      </Stack>
      <Stack direction="row" gap="2" wrap>
        <Tag asChild>
          <a href="#fiscalidad">Fiscalidad</a>
        </Tag>
        <Tag asChild>
          <a href="#laboral">Laboral</a>
        </Tag>
        <Tag size="sm">Solo lectura</Tag>
      </Stack>
    </Stack>
  )
}

export const Tags: StoryObj<typeof Tag> = { render: () => <TagsDemo /> }

export const Avatares: StoryObj<typeof Avatar> = {
  render: () => (
    <Stack gap="6">
      <Stack direction="row" gap="3" align="center">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Avatar key={size} size={size} name="Laura Gómez" />
        ))}
        <Avatar size="lg" src="https://i.pravatar.cc/160?img=47" name="Marta Ruiz" />
        <Avatar size="lg" src="/no-existe.jpg" name="Imagen rota" />
        <Avatar size="lg" />
      </Stack>
      <AvatarGroup max={4} size="lg">
        {['Ana Pérez', 'Luis Martín', 'Sara Gil', 'Jorge Ramos', 'Elena Vidal', 'Iván Soto'].map(
          (n) => (
            <Avatar key={n} name={n} />
          ),
        )}
      </AvatarGroup>
    </Stack>
  ),
}

export const Iconos: StoryObj<typeof Icon> = {
  render: () => (
    <Stack gap="4">
      <Stack direction="row" gap="4" align="center">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Icon key={size} size={size} tone="accent">
            <MailIcon />
          </Icon>
        ))}
      </Stack>
      <Stack direction="row" gap="4">
        <Icon contained size="lg">
          <PhoneIcon />
        </Icon>
        <Icon contained size="lg">
          <CheckIcon />
        </Icon>
      </Stack>
    </Stack>
  ),
}

export const Imagen: StoryObj<typeof Image> = {
  render: () => (
    <div style={{ maxWidth: '36rem' }}>
      <Image
        src="https://picsum.photos/seed/equipo/1200/800"
        alt="Equipo reunido alrededor de una mesa revisando un proyecto"
        ratio={3 / 2}
        radius="lg"
        caption="Nuestro equipo de Valencia durante la planificación anual."
      />
    </div>
  ),
}

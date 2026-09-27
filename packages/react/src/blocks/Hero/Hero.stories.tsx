import { ArrowRightIcon, StarIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarGroup } from '../../components/Avatar/Avatar'
import { Button } from '../../components/Button/Button'
import { photo } from '../../test/sample-data'
import { Hero } from './Hero'

const actions = (
  <>
    <Button size="lg" iconEnd={<ArrowRightIcon />}>
      Solicitar propuesta
    </Button>
    <Button size="lg" variant="outline">
      Ver casos de éxito
    </Button>
  </>
)

const trust = (
  <>
    <AvatarGroup max={4} size="sm">
      <Avatar name="Ana Pérez" />
      <Avatar name="Luis Martín" />
      <Avatar name="Sara Gil" />
      <Avatar name="Jorge Ramos" />
      <Avatar name="Marta León" />
    </AvatarGroup>
    <span>
      <StarIcon
        aria-hidden="true"
        style={{ fill: 'currentColor', color: 'var(--bl-color-warning-solid)' }}
      />{' '}
      4,9 de media en 320 opiniones
    </span>
  </>
)

const meta = {
  title: 'Bloques/Hero',
  component: Hero,
  args: {
    eyebrow: 'Consultoría financiera',
    title: 'Crece con orden y decide con datos',
    description:
      'Acompañamos a pymes y grupos empresariales en fiscalidad, auditoría y estrategia desde hace 20 años.',
    actions,
    children: trust,
    media: <img src={photo('hero')} alt="Equipo de consultores reunido con un cliente" />,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['split', 'centered', 'background'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cabecera principal de una página con titular (`h1`), entradilla, acciones e imagen o vídeo. Variantes `split`, `centered` y `background` (imagen o vídeo a sangre con capa oscura).',
      },
    },
  },
} satisfies Meta<typeof Hero>
export default meta
type Story = StoryObj<typeof meta>

export const Dividido: Story = { name: 'Split', args: { variant: 'split' } }

export const Centrado: Story = {
  name: 'Centrado',
  args: { variant: 'centered', media: undefined },
}

export const ConFondo: Story = {
  name: 'Con imagen de fondo',
  args: {
    variant: 'background',
    size: 'lg',
    media: <img src={photo('office', 1920, 1080)} alt="" />,
  },
}

export const ConVideo: Story = {
  name: 'Con vídeo de fondo',
  args: {
    variant: 'background',
    media: undefined,
    video: {
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster: photo('flower', 1920, 1080),
    },
  },
}

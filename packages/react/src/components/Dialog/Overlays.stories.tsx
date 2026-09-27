import {
  CopyIcon,
  DownloadIcon,
  FilterIcon,
  GlobeIcon,
  InfoIcon,
  MailIcon,
  MenuIcon,
  ShareIcon,
} from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { ButtonGroup } from '../ButtonGroup/ButtonGroup'
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox'
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '../Drawer/Drawer'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu'
import { Field } from '../Field/Field'
import { Form } from '../Form/Form'
import { IconButton } from '../IconButton/IconButton'
import { Input } from '../Input/Input'
import { Link } from '../Link/Link'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog'

const meta = {
  title: 'Componentes/Overlays/Dialog',
  component: DialogContent,
  parameters: {
    docs: {
      description: {
        component:
          'Ventana modal sobre Radix: foco atrapado, scroll bloqueado, Escape para cerrar y foco devuelto al botón que la abrió. El título es obligatorio (da nombre al diálogo). Úsala con moderación: interrumpe.',
      },
    },
  },
} satisfies Meta<typeof DialogContent>
export default meta
type Story = StoryObj<typeof meta>

export const Basico: Story = {
  name: 'Diálogo con formulario',
  args: { title: 'Solicitar una demo' },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Solicitar una demo</Button>
      </DialogTrigger>
      <DialogContent
        title="Solicitar una demo"
        description="Te llamamos en 24 horas laborables para enseñarte la plataforma."
        size="lg"
        footer={
          <>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="demo-form">
              Solicitar demo
            </Button>
          </>
        }
      >
        <Form id="demo-form" onSubmit={(event) => event.preventDefault()}>
          <Field label="Nombre" name="nombre" required>
            <Input autoComplete="name" />
          </Field>
          <Field label="Email de trabajo" name="email" required>
            <Input type="email" autoComplete="email" />
          </Field>
        </Form>
      </DialogContent>
    </Dialog>
  ),
}

function ConfirmDemo() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger">Cancelar suscripción</Button>
      </DialogTrigger>
      <DialogContent
        role="alertdialog"
        size="sm"
        title="¿Cancelar la suscripción?"
        description="Dejarás de recibir el boletín mensual. Puedes volver a suscribirte cuando quieras."
        footer={
          <>
            <DialogClose asChild>
              <Button variant="outline">Mantener</Button>
            </DialogClose>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Cancelar suscripción
            </Button>
          </>
        }
      />
    </Dialog>
  )
}

export const Confirmacion: Story = {
  name: 'Confirmación',
  args: { title: '¿Cancelar la suscripción?' },
  render: () => <ConfirmDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Para confirmar acciones destructivas usa `role="alertdialog"` y botones que digan lo que hacen («Cancelar suscripción», no «Sí»).',
      },
    },
  },
}

export const Paneles: StoryObj<typeof DrawerContent> = {
  name: 'Drawer',
  render: () => (
    <ButtonGroup>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" iconStart={<FilterIcon />}>
            Filtros
          </Button>
        </DrawerTrigger>
        <DrawerContent
          title="Filtrar casos de éxito"
          side="right"
          footer={
            <DrawerClose asChild>
              <Button>Ver 12 resultados</Button>
            </DrawerClose>
          }
        >
          <CheckboxGroup label="Sector" name="sector">
            <Checkbox value="industria" label="Industria" />
            <Checkbox value="salud" label="Salud" />
            <Checkbox value="retail" label="Retail" />
          </CheckboxGroup>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <IconButton label="Abrir menú" variant="outline">
            <MenuIcon />
          </IconButton>
        </DrawerTrigger>
        <DrawerContent title="Menú" side="left" size="sm">
          <Stack gap="4" as="nav" aria-label="Principal">
            <Link href="#" variant="standalone">
              Servicios
            </Link>
            <Link href="#" variant="standalone">
              Casos de éxito
            </Link>
            <Link href="#" variant="standalone">
              Contacto
            </Link>
          </Stack>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Desde abajo</Button>
        </DrawerTrigger>
        <DrawerContent title="Compartir" side="bottom" size="sm">
          <Text>Elige cómo quieres compartir este artículo.</Text>
        </DrawerContent>
      </Drawer>
    </ButtonGroup>
  ),
}

export const Popovers: StoryObj<typeof PopoverContent> = {
  name: 'Popover',
  render: () => (
    <ButtonGroup>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" iconStart={<InfoIcon />}>
            Horario de atención
          </Button>
        </PopoverTrigger>
        <PopoverContent title="Horario de atención">
          <Text size="sm">De lunes a viernes, de 9 a 18 h. En agosto, de 8 a 15 h.</Text>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" iconStart={<MailIcon />}>
            Suscribirse
          </Button>
        </PopoverTrigger>
        <PopoverContent title="Recibe el boletín" closeButton width="lg">
          <Form onSubmit={(event) => event.preventDefault()}>
            <Field label="Email" name="email" required>
              <Input type="email" autoComplete="email" />
            </Field>
            <Button type="submit" size="sm">
              Suscribirme
            </Button>
          </Form>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
}

export const Tooltips: StoryObj<typeof Tooltip> = {
  name: 'Tooltip',
  render: () => (
    <ButtonGroup>
      <Tooltip content="Descargar el dossier en PDF (2 MB)">
        <IconButton label="Descargar dossier" variant="outline">
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="Copiar enlace" side="bottom">
        <IconButton label="Copiar enlace" variant="outline">
          <CopyIcon />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Aparece al pasar el ratón o enfocar con Tab. No aparece en pantallas táctiles: nunca pongas ahí información imprescindible.',
      },
    },
  },
}

function MenuDemo() {
  const [language, setLanguage] = useState('es')
  const [compact, setCompact] = useState(false)
  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" iconStart={<ShareIcon />}>
            Compartir
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<CopyIcon />} hint="Ctrl+C">
            Copiar enlace
          </DropdownMenuItem>
          <DropdownMenuItem icon={<MailIcon />}>Enviar por email</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<ShareIcon />}>Redes sociales</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>LinkedIn</DropdownMenuItem>
              <DropdownMenuItem>X</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={compact} onCheckedChange={setCompact}>
            Vista compacta
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="danger">Denunciar contenido</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" iconStart={<GlobeIcon />}>
            {language === 'es' ? 'Español' : 'English'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Idioma</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
            <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en" lang="en">
              English
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export const Menus: StoryObj<typeof DropdownMenuContent> = {
  name: 'DropdownMenu',
  render: () => <MenuDemo />,
}

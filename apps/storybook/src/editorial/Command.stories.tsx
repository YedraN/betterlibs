import { Command, type CommandItem, Stack, Text } from '@betterlibs/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CommandExample } from '../../../docs/components/docs/examples/command'

const meta: Meta = {
  title: 'Componentes/Editorial/Paleta de comandos',
  globals: { preset: 'editorial' },
  parameters: { layout: 'padded' },
}
export default meta

export const Acciones: StoryObj = { render: () => <CommandExample /> }
export const Cargando: StoryObj = { render: () => <CommandExample loading /> }
export const SinAcciones: StoryObj = { render: () => <CommandExample empty /> }

const collections: CommandItem[] = [
  'Atlas',
  'Cuaderno',
  'Horizonte',
  'Retícula',
  'Archivo',
  'Materia',
  'Borrador',
  'Mosaico',
  'Estudio',
  'Producto',
  'Lecturas',
  'Notas',
  'Referencias',
  'Campaña',
  'Portadas',
  'Encuentros',
].map((name) => ({
  id: name,
  label: `Abrir ${name}`,
  group: 'Colecciones',
}))

function InlineExample() {
  const [selected, setSelected] = useState('Elige una colección para continuar.')
  return (
    <Stack gap="4">
      <h1>Abre una colección</h1>
      <Command
        items={collections}
        onSelect={(item) => setSelected(`Colección elegida: ${item.id}.`)}
      />
      <Text role="status">{selected}</Text>
    </Stack>
  )
}

export const EnPagina: StoryObj = { render: () => <InlineExample /> }

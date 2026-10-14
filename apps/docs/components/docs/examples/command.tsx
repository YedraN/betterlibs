'use client'

import { SearchIcon } from '@betterlibs/icons'
import {
  Button,
  Command,
  type CommandItem,
  Dialog,
  DialogContent,
  DialogTrigger,
  Stack,
  Text,
} from '@betterlibs/react'
import { useState } from 'react'

const actions: CommandItem[] = [
  {
    id: 'new',
    label: 'Nueva colección',
    description: 'Empieza con una selección vacía.',
    group: 'Colecciones',
    keywords: ['crear', 'añadir'],
  },
  {
    id: 'open',
    label: 'Abrir Atlas',
    description: 'Continúa tu colección de interfaces.',
    group: 'Colecciones',
    keywords: ['proyecto'],
  },
  {
    id: 'archive',
    label: 'Archivar colección',
    description: 'Disponible cuando haya una colección abierta.',
    group: 'Colecciones',
    disabled: true,
  },
  { id: 'light', label: 'Usar tema claro', group: 'Vista', keywords: ['apariencia', 'blanco'] },
  { id: 'dark', label: 'Usar tema oscuro', group: 'Vista', keywords: ['apariencia', 'negro'] },
]

/** Demo local: ejecuta una selección sin enviar datos ni modificar la aplicación anfitriona. */
export function CommandExample({
  loading = false,
  empty = false,
}: {
  loading?: boolean
  empty?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('Elige una acción para ver el resultado.')
  const [recent, setRecent] = useState<string[]>([])
  return (
    <Stack gap="4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" iconStart={<SearchIcon />}>
            Buscar acciones
          </Button>
        </DialogTrigger>
        <DialogContent
          title="¿Qué quieres hacer?"
          description="Busca una acción o elige una de la lista."
        >
          <Command
            recentIds={recent}
            items={empty ? [] : actions}
            loading={loading}
            onSelect={(item) => {
              setRecent((current) =>
                [item.id, ...current.filter((id) => id !== item.id)].slice(0, 3),
              )
              setMessage(`Acción elegida: ${item.label}.`)
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
      <Text role="status">{message}</Text>
    </Stack>
  )
}

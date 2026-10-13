'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Field,
  Input,
} from '@betterlibs/react'
import { useState } from 'react'

export function DialogExample() {
  const [name, setName] = useState('Atlas')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Editar colección</Button>
      </DialogTrigger>
      <DialogContent
        title="Editar colección"
        description="La selección de tema y movimiento también llega al portal."
        footer={
          <DialogClose asChild>
            <Button>Guardar y cerrar</Button>
          </DialogClose>
        }
      >
        <Field label="Nombre de la colección">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
      </DialogContent>
    </Dialog>
  )
}

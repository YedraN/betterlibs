'use client'

import { Button, Field, Form, Input, Textarea } from '@betterlibs/react'
import { useState } from 'react'

export function FormExample() {
  const [saved, setSaved] = useState(false)
  return (
    <Form
      aria-label="Proyecto de ejemplo"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
      }}
      onChange={() => setSaved(false)}
    >
      <Field name="project" label="Nombre del proyecto" required>
        <Input autoComplete="off" />
      </Field>
      <Field name="description" label="Descripción">
        <Textarea rows={3} />
      </Field>
      <Button type="submit">Guardar proyecto</Button>
      <p role="status">
        {saved
          ? 'Proyecto guardado en esta demostración.'
          : 'Los datos de ejemplo permanecen en esta página.'}
      </p>
    </Form>
  )
}

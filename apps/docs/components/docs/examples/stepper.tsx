'use client'
import { Field, Input, Text } from '@betterlibs/react'
import { Stepper } from '@betterlibs/react/advanced'
import { useState } from 'react'
export function StepperExample() {
  const [name, setName] = useState('')
  return (
    <Stepper
      label="Preparar una colección"
      validate={(step) =>
        step === 0 && !name.trim() ? 'Escribe el nombre de la colección para continuar.' : undefined
      }
      steps={[
        {
          id: 'name',
          title: 'Nombre',
          description: 'El borrador se conserva al volver.',
          content: (
            <Field label="Nombre de la colección">
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
          ),
        },
        {
          id: 'review',
          title: 'Revisar',
          content: <Text>Vas a preparar la colección «{name}». Este ejemplo no envía datos.</Text>,
        },
      ]}
    />
  )
}

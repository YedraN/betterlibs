'use client'
import { Button, Text } from '@betterlibs/react'
import { EmptyState } from '@betterlibs/react/advanced'
import { useState } from 'react'
export function EmptyStateExample() {
  const [created, setCreated] = useState(false)
  return created ? (
    <div>
      <Text role="status">Tu primera colección está preparada en esta demo.</Text>
      <Button variant="outline" onClick={() => setCreated(false)}>
        Volver al estado vacío
      </Button>
    </div>
  ) : (
    <EmptyState
      title="Tu colección empieza aquí"
      description="Añade una referencia para tener tus ideas a mano durante el próximo proyecto."
      actions={<Button onClick={() => setCreated(true)}>Crear colección</Button>}
    />
  )
}

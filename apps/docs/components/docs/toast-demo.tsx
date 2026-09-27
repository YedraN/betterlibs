'use client'

import { Button, ButtonGroup, Toaster, toast } from '@betterlibs/react'

/** Botones para probar `toast()` en la documentación. */
export function ToastDemo() {
  return (
    <>
      <ButtonGroup>
        <Button variant="outline" onClick={() => toast.success('Cambios guardados')}>
          Éxito
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('No hemos podido enviar tu mensaje', {
              description: 'Revisa tu conexión e inténtalo de nuevo.',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Artículo archivado',
              action: {
                label: 'Deshacer',
                altText: 'Puedes restaurarlo desde Archivados',
                onClick: () => toast.success('Artículo restaurado'),
              },
            })
          }
        >
          Con acción
        </Button>
      </ButtonGroup>
      <Toaster />
    </>
  )
}

'use client'
import { Button, Toaster, toast } from '@betterlibs/react'
import { useEffect, useRef, useState } from 'react'
export function NotificationsExample() {
  const operation = useRef<string | undefined>(undefined)
  const created = useRef(new Set<string>())
  const [activeOperation, setActiveOperation] = useState<string | undefined>(undefined)
  const [progress, setProgress] = useState(0)
  useEffect(
    () => () => {
      for (const id of created.current) toast.dismiss(id)
    },
    [],
  )
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-3)' }}>
      <p>El progreso de esta operación se controla manualmente; no se envían archivos.</p>
      <Button
        variant="outline"
        onClick={() => {
          created.current.add(
            toast({
              title: 'Cambios guardados',
              description: 'La colección está al día.',
              group: 'catalogue-demo-save',
              actions: [
                {
                  label: 'Ver estado',
                  onClick: () => created.current.add(toast.success('Colección disponible.')),
                },
              ],
            }),
          )
        }}
      >
        Guardar y agrupar aviso
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          if (operation.current) toast.dismiss(operation.current)
          setProgress(0)
          operation.current = toast({ title: 'Preparando entrega', persistent: true, progress: 0 })
          created.current.add(operation.current)
          setActiveOperation(operation.current)
        }}
      >
        Iniciar operación de ejemplo
      </Button>
      <Button
        variant="outline"
        disabled={!activeOperation || progress >= 100}
        onClick={() => {
          const next = Math.min(progress + 25, 100)
          setProgress(next)
          if (operation.current)
            toast.update(operation.current, {
              progress: next,
              title: next === 100 ? 'Entrega preparada' : 'Preparando entrega',
              persistent: next < 100,
              tone: next === 100 ? 'success' : 'info',
            })
        }}
      >
        Avanzar progreso ({progress} %)
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          for (const id of created.current) toast.dismiss(id)
          created.current.clear()
          operation.current = undefined
          setActiveOperation(undefined)
          setProgress(0)
        }}
      >
        Cerrar avisos
      </Button>
      <Toaster />
    </div>
  )
}

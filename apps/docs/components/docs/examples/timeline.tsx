import { Timeline } from '@betterlibs/react/advanced'
export function TimelineExample() {
  return (
    <Timeline
      label="Historial de la colección"
      items={[
        {
          id: 'created',
          title: 'Colección creada',
          date: '2026-10-12',
          dateLabel: '12 de octubre',
          status: 'complete',
          description: 'Atlas tiene una base para empezar.',
        },
        {
          id: 'review',
          title: 'Revisión de contenido',
          date: '2026-10-14',
          dateLabel: '14 de octubre',
          status: 'current',
          description: 'Comprobar títulos, enlaces y alternativas.',
          details: <p>Revisa el contenido largo en móvil y la navegación con teclado.</p>,
        },
        {
          id: 'publish',
          title: 'Publicación',
          status: 'pending',
          description: 'Preparar la entrega después de la revisión.',
        },
      ]}
    />
  )
}

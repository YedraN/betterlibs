'use client'
import { Kanban } from '@betterlibs/react/advanced'
export function KanbanExample() {
  return (
    <Kanban
      label="Plan de publicación"
      columns={[
        { id: 'todo', title: 'Pendiente' },
        { id: 'doing', title: 'En curso' },
        { id: 'done', title: 'Completado' },
      ]}
      defaultValue={[
        {
          id: 'cover',
          title: 'Diseñar portada',
          description: 'Definir jerarquía y composición.',
          columnId: 'todo',
        },
        { id: 'content', title: 'Revisar contenido', columnId: 'todo' },
        { id: 'images', title: 'Preparar imágenes', columnId: 'doing' },
      ]}
    />
  )
}

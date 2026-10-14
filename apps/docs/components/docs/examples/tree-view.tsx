'use client'
import { TreeView } from '@betterlibs/react/advanced'
export function TreeViewExample() {
  return (
    <TreeView
      label="Archivos del estudio"
      defaultExpandedIds={['atlas']}
      nodes={[
        {
          id: 'atlas',
          label: 'Atlas',
          children: [
            { id: 'cover', label: 'Portada' },
            {
              id: 'components',
              label: 'Componentes',
              children: [
                { id: 'actions', label: 'Acciones' },
                { id: 'forms', label: 'Formularios' },
              ],
            },
          ],
        },
        { id: 'notebook', label: 'Cuaderno', children: [{ id: 'notes', label: 'Notas' }] },
        { id: 'archive', label: 'Archivo', disabled: true },
      ]}
    />
  )
}

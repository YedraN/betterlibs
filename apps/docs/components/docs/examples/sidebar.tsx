'use client'
import { Sidebar } from '@betterlibs/react/advanced'
export function SidebarExample() {
  return (
    <Sidebar
      label="Navegación del proyecto"
      header={<strong>Estudio Betterlibs</strong>}
      items={[
        {
          id: 'overview',
          label: 'Componentes',
          href: '/docs/componentes/avanzados',
          group: 'Documentación',
        },
        {
          id: 'projects',
          label: 'Galería',
          href: '/docs/galeria',
          group: 'Documentación',
        },
        {
          id: 'files',
          label: 'Instalación',
          href: '/docs/primeros-pasos/instalacion',
          group: 'Recursos',
        },
      ]}
      activeId="overview"
      footer={<span>Tu espacio de trabajo.</span>}
    />
  )
}

'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import examples from '@/generated/examples.json'
import { playgroundUrl } from '@/lib/shared'
import { ButtonsExample } from './examples/buttons'
import { CodeBlockExample } from './examples/code-block'
import { ComboboxExample } from './examples/combobox'
import { CommandExample } from './examples/command'
import { DataTableExample } from './examples/data-table'
import { DatePickerExample } from './examples/date-picker'
import { DialogExample } from './examples/dialog'
import { DropzoneExample } from './examples/dropzone'
import { EmptyStateExample } from './examples/empty-state'
import { FilterToolbarExample } from './examples/filter-toolbar'
import { FormExample } from './examples/form'
import { ImageViewerExample } from './examples/image-viewer'
import { InlineEditExample } from './examples/inline-edit'
import { KanbanExample } from './examples/kanban'
import { MultiSelectExample } from './examples/multi-select'
import { NotificationsExample } from './examples/notifications'
import { PresenceExample } from './examples/presence'
import { RevealExample } from './examples/reveal'
import { SectionsExample } from './examples/sections'
import { SidebarExample } from './examples/sidebar'
import { SliderExample } from './examples/slider'
import { SplitPaneExample } from './examples/split-pane'
import { StepperExample } from './examples/stepper'
import { TimelineExample } from './examples/timeline'
import { ToggleGroupExample } from './examples/toggle-group'
import { TreeViewExample } from './examples/tree-view'
import styles from './gallery.module.css'
import { Preview, usePreviewReplay } from './preview'

const catalog = [
  {
    id: 'combobox',
    title: 'Selector con búsqueda',
    category: 'Componentes',
    description: 'Busca opciones sin perder el valor elegido.',
    href: '/docs/componentes/avanzados/combobox',
    render: () => <ComboboxExample />,
  },
  {
    id: 'multi-select',
    title: 'Selección múltiple',
    category: 'Componentes',
    description: 'Busca, añade y quita etiquetas con un límite opcional.',
    href: '/docs/componentes/avanzados/multi-select',
    render: () => <MultiSelectExample />,
  },
  {
    id: 'date-picker',
    title: 'Fechas y calendario',
    category: 'Componentes',
    description: 'Entrada manual y calendario para fechas e intervalos.',
    href: '/docs/componentes/avanzados/date-picker',
    render: () => <DatePickerExample />,
  },
  {
    id: 'data-table',
    title: 'Tabla de colecciones',
    category: 'Componentes',
    description: 'Ordenación, búsqueda, selección y paginación.',
    href: '/docs/componentes/avanzados/data-table',
    render: () => <DataTableExample />,
  },
  {
    id: 'sidebar',
    title: 'Navegación lateral',
    category: 'Componentes',
    description: 'Menú plegable en escritorio y panel en móvil.',
    href: '/docs/componentes/avanzados/sidebar',
    render: () => <SidebarExample />,
  },
  {
    id: 'stepper',
    title: 'Proceso por pasos',
    category: 'Componentes',
    description: 'Valida cada paso y conserva los borradores al volver.',
    href: '/docs/componentes/avanzados/stepper',
    render: () => <StepperExample />,
  },
  {
    id: 'dropzone',
    title: 'Archivos con vista previa',
    category: 'Componentes',
    description: 'Valida formatos y tamaño antes de subir archivos.',
    href: '/docs/componentes/avanzados/dropzone',
    render: () => <DropzoneExample />,
  },
  {
    id: 'slider',
    title: 'Valor e intervalo',
    category: 'Componentes',
    description: 'Ajusta un valor o dos extremos con controles nativos.',
    href: '/docs/componentes/avanzados/slider',
    render: () => <SliderExample />,
  },
  {
    id: 'toggle-group',
    title: 'Opciones de vista',
    category: 'Componentes',
    description: 'Alterna opciones con selección única o múltiple.',
    href: '/docs/componentes/avanzados/toggle-group',
    render: () => <ToggleGroupExample />,
  },
  {
    id: 'tree-view',
    title: 'Árbol de archivos',
    category: 'Componentes',
    description: 'Explora carpetas, expande ramas y elige un elemento.',
    href: '/docs/componentes/avanzados/tree-view',
    render: () => <TreeViewExample />,
  },
  {
    id: 'split-pane',
    title: 'Paneles ajustables',
    category: 'Componentes',
    description: 'Cambia el reparto entre editor y vista previa.',
    href: '/docs/componentes/avanzados/split-pane',
    render: () => <SplitPaneExample />,
  },
  {
    id: 'kanban',
    title: 'Tablero de trabajo',
    category: 'Componentes',
    description: 'Mueve y reordena tarjetas con controles o arrastre.',
    href: '/docs/componentes/avanzados/kanban',
    render: () => <KanbanExample />,
  },
  {
    id: 'timeline',
    title: 'Historial de actividad',
    category: 'Componentes',
    description: 'Fechas, estados y detalles de cada cambio.',
    href: '/docs/componentes/avanzados/timeline',
    render: () => <TimelineExample />,
  },
  {
    id: 'empty-state',
    title: 'Estado vacío con salida',
    category: 'Componentes',
    description: 'Explica qué falta y cómo dar el siguiente paso.',
    href: '/docs/componentes/avanzados/empty-state',
    render: () => <EmptyStateExample />,
  },
  {
    id: 'code-block',
    title: 'Código y copia',
    category: 'Componentes',
    description: 'Variantes de código con copia y confirmación.',
    href: '/docs/componentes/avanzados/code-block',
    render: () => <CodeBlockExample />,
  },
  {
    id: 'image-viewer',
    title: 'Visor de imágenes',
    category: 'Componentes',
    description: 'Amplía imágenes, cambia de vista y restablece el zoom.',
    href: '/docs/componentes/avanzados/image-viewer',
    render: () => <ImageViewerExample />,
  },
  {
    id: 'inline-edit',
    title: 'Edición directa',
    category: 'Componentes',
    description: 'Guarda, cancela y recupera el borrador ante errores.',
    href: '/docs/componentes/avanzados/inline-edit',
    render: () => <InlineEditExample />,
  },
  {
    id: 'notifications',
    title: 'Notificaciones de operaciones',
    category: 'Componentes',
    description: 'Agrupa avisos y comunica progreso con acciones.',
    href: '/docs/componentes/avanzados/notifications',
    render: () => <NotificationsExample />,
  },
  {
    id: 'filter-toolbar',
    title: 'Búsqueda y filtros',
    category: 'Componentes',
    description: 'Combina filtros, muestra los activos y restablécelos.',
    href: '/docs/componentes/avanzados/filter-toolbar',
    render: () => <FilterToolbarExample />,
  },
  {
    id: 'command',
    title: 'Buscar y ejecutar acciones',
    category: 'Componentes',
    description: 'Paleta de comandos, búsqueda y selección con teclado.',
    href: '/docs/componentes/interactivos/command',
    render: () => <CommandExample />,
  },
  {
    id: 'buttons',
    title: 'Acciones y estados',
    category: 'Componentes',
    description: 'Confirmación, foco y deshabilitado.',
    href: '/docs/componentes/acciones/button',
    render: () => <ButtonsExample />,
  },
  {
    id: 'form',
    title: 'Formulario y borrador',
    category: 'Componentes',
    description: 'Validación, error y confirmación sin perder lo escrito.',
    href: '/docs/componentes/formularios/form',
    render: () => <FormExample />,
  },
  {
    id: 'dialog',
    title: 'Diálogo con contexto',
    category: 'Componentes',
    description: 'Portal, Escape y retorno de foco.',
    href: '/docs/componentes/overlays/dialog',
    render: () => <DialogExample />,
  },
  {
    id: 'reveal',
    title: 'Entradas con ritmo',
    category: 'Movimiento',
    description: 'Líneas, secuencia y cifras con HTML inicial visible.',
    href: '/docs/movimiento/reveal',
    render: () => <ReplayExample />,
  },
  {
    id: 'presence',
    title: 'Contenido condicional',
    category: 'Movimiento',
    description: 'Salida inerte y borrador conservado al reabrir.',
    href: '/docs/movimiento/presence',
    render: () => <PresenceExample />,
  },
  {
    id: 'sections',
    title: 'De piezas a una página',
    category: 'Secciones',
    description: 'Hero editorial, bento y CTA de contraste.',
    href: '/docs/bloques/editoriales',
    render: () => <SectionsExample />,
  },
] as const
const templates = [
  {
    id: 'producto',
    title: 'Producto',
    description: 'Tablero, planes y formulario.',
    color: '#ddef94',
  },
  { id: 'estudio', title: 'Estudio', description: 'Casos, proceso y equipo.', color: '#d0dbdf' },
  {
    id: 'articulo',
    title: 'Artículo',
    description: 'Índice y progreso de lectura.',
    color: '#ece7db',
  },
]
function ReplayExample() {
  return <RevealExample replayKey={usePreviewReplay()} />
}
export function Gallery() {
  const [category, setCategory] = useState('Todo')
  const [query, setQuery] = useState('')
  const search = useRef<HTMLInputElement>(null)
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase('es')
      .trim()
  const normalized = normalize(query)
  const matches = (title: string, description: string) =>
    normalize(`${title} ${description}`).includes(normalized)
  const visible = catalog.filter(
    (item) =>
      (category === 'Todo' || category === item.category) && matches(item.title, item.description),
  )
  const pages = templates.filter(
    (item) =>
      (category === 'Todo' || category === 'Páginas') && matches(item.title, item.description),
  )
  return (
    <div className={`not-prose ${styles.gallery}`}>
      <noscript>
        Los ejemplos, su código y los enlaces están disponibles. Activa JavaScript para usar los
        filtros, los controles y las interacciones.
      </noscript>
      <div className={styles.filters}>
        <label>
          Buscar ejemplos
          <input
            ref={search}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Formulario, ritmo, artículo…"
          />
        </label>
        <div className={styles.categories} role="group" aria-label="Filtrar por uso">
          {['Todo', 'Componentes', 'Movimiento', 'Secciones', 'Páginas'].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {(query || category !== 'Todo') && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('Todo')
              search.current?.focus({ preventScroll: true })
            }}
          >
            Limpiar filtros
          </button>
        )}
        <p role="status">
          {visible.length + pages.length}{' '}
          {visible.length + pages.length === 1 ? 'ejemplo disponible.' : 'ejemplos disponibles.'}
        </p>
      </div>
      {visible.length + pages.length === 0 && (
        <p>No hay ejemplos para esta búsqueda. Prueba otra palabra o selecciona Todo.</p>
      )}
      {visible.map((item) => (
        <section key={item.id} aria-labelledby={`gallery-${item.id}`} className={styles.entry}>
          <div className={styles.heading}>
            <div>
              <span className={styles.category}>{item.category}</span>
              <h2 id={`gallery-${item.id}`}>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <Link href={item.href}>Consultar la API →</Link>
          </div>
          <Preview
            label={item.title}
            preset="editorial"
            controls
            replay={item.id === 'reveal'}
            code={examples[item.id]}
            padded={item.id !== 'sections'}
          >
            {item.render()}
          </Preview>
        </section>
      ))}
      {pages.length > 0 && (
        <section aria-labelledby="gallery-pages">
          <h2 id="gallery-pages">Páginas completas</h2>
          <div className={styles.pages}>
            {pages.map((item) => (
              <article key={item.id}>
                <div className={styles.cover} style={{ background: item.color }} aria-hidden="true">
                  <span>{item.title.slice(0, 1)}</span>
                  <div />
                  <div />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={`${playgroundUrl}/plantillas/${item.id}`}>
                  Explorar {item.title.toLowerCase()} →
                </a>
              </article>
            ))}
          </div>
          <p>
            Las plantillas se abren en el playground.{' '}
            <Link href="/docs/recursos/plantillas">
              Código, imágenes y ruta de cada composición
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeBlockExample } from '../../../docs/components/docs/examples/code-block'
import { ComboboxExample } from '../../../docs/components/docs/examples/combobox'
import { DataTableExample } from '../../../docs/components/docs/examples/data-table'
import { DatePickerExample } from '../../../docs/components/docs/examples/date-picker'
import { DropzoneExample } from '../../../docs/components/docs/examples/dropzone'
import { EmptyStateExample } from '../../../docs/components/docs/examples/empty-state'
import { FilterToolbarExample } from '../../../docs/components/docs/examples/filter-toolbar'
import { ImageViewerExample } from '../../../docs/components/docs/examples/image-viewer'
import { InlineEditExample } from '../../../docs/components/docs/examples/inline-edit'
import { KanbanExample } from '../../../docs/components/docs/examples/kanban'
import { MultiSelectExample } from '../../../docs/components/docs/examples/multi-select'
import { NotificationsExample } from '../../../docs/components/docs/examples/notifications'
import { SidebarExample } from '../../../docs/components/docs/examples/sidebar'
import { SliderExample } from '../../../docs/components/docs/examples/slider'
import { SplitPaneExample } from '../../../docs/components/docs/examples/split-pane'
import { StepperExample } from '../../../docs/components/docs/examples/stepper'
import { TimelineExample } from '../../../docs/components/docs/examples/timeline'
import { ToggleGroupExample } from '../../../docs/components/docs/examples/toggle-group'
import { TreeViewExample } from '../../../docs/components/docs/examples/tree-view'

const meta: Meta = {
  title: 'Componentes/Avanzados/Catálogo',
  globals: { preset: 'editorial' },
  parameters: { layout: 'fullscreen' },
}
export default meta
const frame = (title: string, content: React.ReactNode) => (
  <main
    style={{
      maxWidth: '64rem',
      margin: 'auto',
      padding: 'clamp(1rem, 4vw, 3rem)',
      color: 'var(--bl-color-text)',
    }}
  >
    <h1 style={{ fontFamily: 'var(--bl-font-family-display)' }}>{title}</h1>
    {content}
  </main>
)
export const Combobox: StoryObj = {
  render: () => frame('Selector con búsqueda', <ComboboxExample />),
}
export const MultiSelect: StoryObj = {
  render: () => frame('Selección múltiple', <MultiSelectExample />),
}
export const DatePicker: StoryObj = {
  render: () => frame('Fechas y calendario', <DatePickerExample />),
}
export const DataTable: StoryObj = {
  render: () => frame('Tabla de colecciones', <DataTableExample />),
}
export const Sidebar: StoryObj = { render: () => frame('Navegación lateral', <SidebarExample />) }
export const Stepper: StoryObj = { render: () => frame('Proceso por pasos', <StepperExample />) }
export const Dropzone: StoryObj = {
  render: () => frame('Archivos con vista previa', <DropzoneExample />),
}
export const Slider: StoryObj = { render: () => frame('Valor e intervalo', <SliderExample />) }
export const ToggleGroup: StoryObj = {
  render: () => frame('Opciones de vista', <ToggleGroupExample />),
}
export const TreeView: StoryObj = { render: () => frame('Árbol de archivos', <TreeViewExample />) }
export const SplitPane: StoryObj = {
  render: () => frame('Paneles ajustables', <SplitPaneExample />),
}
export const Kanban: StoryObj = { render: () => frame('Tablero de trabajo', <KanbanExample />) }
export const Timeline: StoryObj = {
  render: () => frame('Historial de actividad', <TimelineExample />),
}
export const EmptyState: StoryObj = {
  render: () => frame('Estado vacío con salida', <EmptyStateExample />),
}
export const CodeBlock: StoryObj = { render: () => frame('Código y copia', <CodeBlockExample />) }
export const ImageViewer: StoryObj = {
  render: () => frame('Visor de imágenes', <ImageViewerExample />),
}
export const InlineEdit: StoryObj = {
  render: () => frame('Edición directa', <InlineEditExample />),
}
export const Notifications: StoryObj = {
  render: () => frame('Notificaciones de operaciones', <NotificationsExample />),
}
export const FilterToolbar: StoryObj = {
  render: () => frame('Búsqueda y filtros', <FilterToolbarExample />),
}
export const ComboboxCarga: StoryObj = {
  render: () => frame('Cargando opciones', <ComboboxExample loading />),
}
export const ComboboxError: StoryObj = {
  render: () => frame('Reintentar búsqueda', <ComboboxExample error />),
}
export const TablaVacia: StoryObj = {
  render: () => frame('Una colección por empezar', <DataTableExample empty />),
}
export const TablaCarga: StoryObj = {
  render: () => frame('Cargando colecciones', <DataTableExample loading />),
}
export const TablaError: StoryObj = {
  render: () => frame('Reintentar carga', <DataTableExample error />),
}
export const IntervaloFechas: StoryObj = {
  render: () => frame('Fechas del proyecto', <DatePickerExample range />),
}
export const IntervaloNumeros: StoryObj = {
  render: () => frame('Presupuesto disponible', <SliderExample range />),
}
export const PanelesVerticales: StoryObj = {
  render: () => frame('Paneles verticales', <SplitPaneExample vertical />),
}

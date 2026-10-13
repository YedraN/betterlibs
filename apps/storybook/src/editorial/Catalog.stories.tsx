import '@betterlibs/react/styles.css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CatalogContentDemo,
  CatalogFormsDemo,
  CatalogOverlaysDemo,
  PositionDemo,
} from '../../../docs/components/docs/catalog-demo'

const meta: Meta = {
  title: 'Componentes/Editorial/Catálogo',
  globals: { preset: 'editorial' },
  parameters: { layout: 'fullscreen' },
}
export default meta
const frame = (title: string, content: React.ReactNode) => (
  <main style={{ maxWidth: '48rem', margin: 'auto', padding: 'clamp(1rem, 4vw, 3rem)' }}>
    <h1 style={{ fontFamily: 'var(--bl-font-family-display)', overflowWrap: 'anywhere' }}>
      {title}
    </h1>
    {content}
  </main>
)
export const Formularios: StoryObj = {
  render: () => frame('Crea una colección', <CatalogFormsDemo />),
}
export const MenusYOverlays: StoryObj = {
  render: () => frame('Acciones con contexto', <CatalogOverlaysDemo />),
}
export const Contenido: StoryObj = {
  render: () => frame('Estados que se entienden', <CatalogContentDemo />),
}
export const Posiciones: StoryObj = {
  render: () => frame('Continuidad de posiciones', <PositionDemo />),
}
export const PosicionesVerticalesRTL: StoryObj = {
  render: () => frame('Selección vertical en RTL', <PositionDemo vertical direction="rtl" />),
}

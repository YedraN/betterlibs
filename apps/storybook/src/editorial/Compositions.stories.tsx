import '@betterlibs/react/styles.css'
import { MotionProvider } from '@betterlibs/motion'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AnimatedNumberDemo,
  EditorialPageDemo,
  NumberSample,
} from '../../../docs/components/docs/editorial-demo'

const meta: Meta = {
  title: 'Bloques/Editorial/Primera página',
  globals: { preset: 'editorial' },
  parameters: { layout: 'fullscreen' },
}
export default meta
export const Composiciones: StoryObj = { render: () => <EditorialPageDemo /> }
export const Cifras: StoryObj = {
  render: () => (
    <main style={{ padding: '2rem' }}>
      <h1>Cifras que responden</h1>
      <AnimatedNumberDemo />
    </main>
  ),
}
export const CifrasReducidas: StoryObj = {
  render: () => (
    <main style={{ padding: '2rem' }}>
      <h1>Cifras con movimiento reducido</h1>
      <MotionProvider mode="reduced">
        <NumberSample />
      </MotionProvider>
    </main>
  ),
}
export const CifrasDesactivadas: StoryObj = {
  render: () => (
    <main style={{ padding: '2rem' }}>
      <h1>Cifras sin movimiento</h1>
      <MotionProvider mode="off">
        <NumberSample />
      </MotionProvider>
    </main>
  ),
}

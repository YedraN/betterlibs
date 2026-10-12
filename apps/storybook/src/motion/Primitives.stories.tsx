import { MotionProvider } from '@betterlibs/motion'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MotionSample } from '../../../docs/components/docs/motion-demo'

const meta: Meta = {
  title: 'Movimiento/Primitivas',
  parameters: { layout: 'padded' },
  render: () => (
    <MotionProvider>
      <MotionSample />
    </MotionProvider>
  ),
}
export default meta
type Story = StoryObj<typeof meta>
export const Sistema: Story = {}
export const Reducido: Story = {
  render: () => (
    <MotionProvider mode="reduced">
      <MotionSample />
    </MotionProvider>
  ),
}
export const Desactivado: Story = {
  render: () => (
    <MotionProvider mode="off">
      <MotionSample />
    </MotionProvider>
  ),
}
export const SalidaAbierta: Story = {
  play: async ({ canvas }) => {
    await canvas.getByRole('button', { name: 'Abrir detalles' }).click()
  },
}

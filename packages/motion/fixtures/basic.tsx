import { MotionProvider, Presence, Reveal, Stagger } from '../dist/index.js'

export function BasicFixture({ open = true }: { open?: boolean }) {
  return (
    <MotionProvider>
      <Stagger>
        <Reveal>Contenido</Reveal>
        <Presence present={open}>Detalles</Presence>
      </Stagger>
    </MotionProvider>
  )
}

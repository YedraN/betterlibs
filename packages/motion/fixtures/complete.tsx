import { AnimatedNumber, MotionProvider, Presence, Reveal, Stagger } from '../dist/index.js'
export function CompleteFixture({ open = true }: { open?: boolean }) {
  return (
    <MotionProvider>
      <Stagger>
        <Reveal>
          <AnimatedNumber value={1234.5} startValue={0} />
        </Reveal>
        <Presence present={open}>Detalles</Presence>
      </Stagger>
    </MotionProvider>
  )
}

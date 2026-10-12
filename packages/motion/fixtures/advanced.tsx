// Cost-only fixture; advanced capabilities are not part of the public Betterlibs API yet.
import { domMax, LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'

export function AdvancedFixture() {
  return (
    <LazyMotion features={domMax}>
      <m.div layout drag whileTap={{ scale: 0.98 }}>
        Layout y gestos
      </m.div>
    </LazyMotion>
  )
}

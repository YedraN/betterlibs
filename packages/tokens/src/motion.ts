import { motion } from './primitives.ts'

/** Valores en ms y px para CSS, WAAPI y motores de animación opcionales. */
export const motionRoles = {
  feedback: { duration: 140, exitDuration: 120, distance: 2, easing: motion.ease.out, scale: 0.98 },
  disclosure: { duration: 220, exitDuration: 180, distance: 8, easing: motion.ease.out },
  reveal: { duration: 360, exitDuration: 180, distance: 14, easing: motion.ease.out },
  navigation: { duration: 240, exitDuration: 180, distance: 8, easing: motion.ease.standard },
}
export const motionStagger = { interval: 48, maxDelay: 240 }
/** Parámetros físicos, no curvas CSS. No requieren una dependencia de animación. */
export const motionSprings = {
  snappy: { stiffness: 400, damping: 35, mass: 1 },
  gentle: { stiffness: 170, damping: 26, mass: 1 },
}

export function motionVars(): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [role, values] of Object.entries(motionRoles)) {
    const prefix = `--bl-motion-${role}`
    vars[`${prefix}-duration`] = `${values.duration}ms`
    vars[`${prefix}-exit-duration`] = `${values.exitDuration}ms`
    vars[`${prefix}-distance`] = `${values.distance}px`
    vars[`${prefix}-easing`] = values.easing
  }
  vars['--bl-motion-feedback-scale'] = String(motionRoles.feedback.scale)
  vars['--bl-motion-stagger-interval'] = `${motionStagger.interval}ms`
  vars['--bl-motion-stagger-max-delay'] = `${motionStagger.maxDelay}ms`
  return vars
}

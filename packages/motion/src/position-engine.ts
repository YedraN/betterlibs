import { motionSprings } from '@betterlibs/tokens'
import { spring } from 'motion'
import { animate } from 'motion/mini'

/** Kept behind the position capability; basic Reveal never loads the spring generator. */
export function animatePosition(
  element: HTMLElement,
  from: string,
  preset: keyof typeof motionSprings,
  to = 'none',
) {
  return animate(element, { transform: [from, to] }, { type: spring, ...motionSprings[preset] })
}

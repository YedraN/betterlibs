'use client'

import { motionRoles, motionStagger } from '@betterlibs/tokens'
import { useCallback, useEffect, useRef } from 'react'
import { useMotionPreferences } from './preferences'

export type MotionPreset = 'rise' | 'fade' | 'sequence' | 'press'
type Ticket = { cancel: () => void }
// Only the optional package references the engine. Failed requests leave the HTML visible.
let engineRequest: Promise<typeof import('motion/mini')> | undefined
const loadEngine = () => {
  engineRequest ??= import('motion/mini').catch((error) => {
    engineRequest = undefined
    throw error
  })
  return engineRequest
}

/** Milliseconds, just like the shared tokens. Returns false when interrupted or unsupported. */
export function useMotionAnimation() {
  const { enabled, intensity } = useMotionPreferences()
  const active = useRef(new Map<HTMLElement, Ticket>())
  const cancel = useCallback(() => {
    for (const ticket of active.current.values()) ticket.cancel()
    active.current.clear()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: A policy change must also cancel work waiting for the engine.
  useEffect(() => cancel, [cancel, enabled, intensity])

  const play = useCallback(
    async (
      elements: HTMLElement[],
      preset: MotionPreset = 'rise',
      options: { delay?: number; exit?: boolean } = {},
    ): Promise<boolean> => {
      if (!enabled) return false
      const results = elements.map(
        (element, index) =>
          new Promise<boolean>((resolve) => {
            if (!element.isConnected || !element.animate) {
              resolve(false)
              return
            }
            active.current.get(element)?.cancel()
            let settled = false
            let restore = () => {}
            const finish = (completed: boolean) => {
              if (settled) return
              settled = true
              restore()
              if (active.current.get(element) === ticket) active.current.delete(element)
              resolve(completed)
            }
            const ticket: Ticket = { cancel: () => finish(false) }
            active.current.set(element, ticket)
            void loadEngine()
              .then(({ animate }) => {
                if (settled) return
                if (!element.isConnected || !element.animate) {
                  finish(false)
                  return
                }
                const css = getComputedStyle(element)
                const role = preset === 'press' ? 'feedback' : 'reveal'
                const defaults = motionRoles[role]
                const value = (name: string, fallback: string) =>
                  css.getPropertyValue(`--bl-motion-${name}`).trim() || fallback
                const milliseconds = (name: string, fallback: number) => {
                  const raw = value(name, `${fallback}ms`)
                  const number = Number.parseFloat(raw) * (raw.endsWith('ms') ? 1 : 1000)
                  return Number.isFinite(number) ? Math.max(0, Math.min(number, 10000)) : fallback
                }
                const duration = milliseconds(
                  `${role}-${options.exit ? 'exit-duration' : 'duration'}`,
                  options.exit ? defaults.exitDuration : defaults.duration,
                )
                const interval = milliseconds('stagger-interval', motionStagger.interval)
                const maxDelay = Math.min(
                  milliseconds('stagger-max-delay', motionStagger.maxDelay),
                  motionStagger.maxDelay,
                )
                const delay = Math.min(
                  Math.max(0, options.delay ?? (preset === 'sequence' ? index * interval : 0)),
                  maxDelay,
                )
                const distance =
                  Number.parseFloat(value(`${role}-distance`, `${defaults.distance}px`)) *
                  (intensity === 'subtle' ? 1 : 1.5)
                const base = css.transform === 'none' ? '' : css.transform
                const scale = Number.parseFloat(
                  value('feedback-scale', String(motionRoles.feedback.scale)),
                )
                const displaced =
                  preset === 'press'
                    ? `scale(${Number.isFinite(scale) && scale > 0 ? scale : motionRoles.feedback.scale}) ${base}`
                    : `translateY(${Number.isFinite(distance) ? distance : defaults.distance}px) ${base}`
                const transform = [displaced.trim(), base || 'none']
                const opacity = [options.exit ? 0 : 0.1, Number(css.opacity) || 1]
                const original = {
                  transform: element.style.transform,
                  opacity: element.style.opacity,
                }
                const curve = value(`${role}-easing`, defaults.easing)
                  .match(/^cubic-bezier\(([^)]+)\)$/)?.[1]
                  ?.split(',')
                  .map(Number)
                const ease: [number, number, number, number] =
                  curve?.length === 4 && curve.every(Number.isFinite)
                    ? [curve[0] ?? 0.16, curve[1] ?? 1, curve[2] ?? 0.3, curve[3] ?? 1]
                    : [0.16, 1, 0.3, 1]
                const controls = animate(
                  element,
                  preset === 'press'
                    ? { transform }
                    : preset === 'fade'
                      ? { opacity: options.exit ? [...opacity].reverse() : opacity }
                      : {
                          opacity: options.exit ? [...opacity].reverse() : opacity,
                          transform: options.exit ? [...transform].reverse() : transform,
                        },
                  { duration: duration / 1000, delay: options.exit ? 0 : delay / 1000, ease },
                )
                restore = () => {
                  controls.cancel()
                  element.style.transform = original.transform
                  element.style.opacity = original.opacity
                }
                void controls.then(
                  () => finish(true),
                  () => finish(false),
                )
              })
              .catch(() => finish(false))
          }),
      )
      return (await Promise.all(results)).every(Boolean)
    },
    [enabled, intensity],
  )

  return { play, cancel }
}

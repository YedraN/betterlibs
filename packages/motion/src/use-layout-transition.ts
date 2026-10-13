'use client'

import { type RefObject, useCallback, useLayoutEffect, useRef } from 'react'
import { loadPositionEngine } from './position-loader'
import { useMotionPreferences } from './preferences'

export type LayoutTransitionOptions = { spring?: 'snappy' | 'gentle' }
type Position = { x: number; y: number }
type Ticket = { cancel: () => void }

/**
 * Position continuity for direct children marked data-bl-layout. Use stable React keys and
 * plain wrappers without another transform/transition owner. The DOM order changes immediately.
 * No added DOM, retained exits, size scaling or drag. Change transitionKey after a layout change.
 */
export function useLayoutTransition<T extends HTMLElement>(
  ref: RefObject<T | null>,
  transitionKey: unknown,
  { spring = 'snappy' }: LayoutTransitionOptions = {},
) {
  const { enabled } = useMotionPreferences()
  const previous = useRef(new Map<HTMLElement, Position>())
  const active = useRef(new Map<HTMLElement, Ticket>())
  const cancel = useCallback(() => {
    for (const ticket of active.current.values()) ticket.cancel()
    active.current.clear()
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Cancel before measuring when policy or spring changes.
  useLayoutEffect(() => cancel, [cancel, enabled, spring])

  // biome-ignore lint/correctness/useExhaustiveDependencies: transitionKey explicitly signals a committed layout change.
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) {
      cancel()
      previous.current.clear()
      return
    }
    const items = Array.from(root.children).filter(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && item.hasAttribute('data-bl-layout'),
    )
    const visual = new Map<HTMLElement, Position>()
    for (const item of items) {
      const before = previous.current.get(item)
      if (!before) continue
      // An interrupted spring starts at its current visual position, rather than its old endpoint.
      const transform = getComputedStyle(item).transform
      const matrix =
        transform === 'none' || !transform ? undefined : new DOMMatrixReadOnly(transform)
      visual.set(item, { x: before.x + (matrix?.m41 ?? 0), y: before.y + (matrix?.m42 ?? 0) })
    }
    cancel()
    const origin = root.getBoundingClientRect()
    const next = new Map<HTMLElement, Position>()
    for (const item of items) {
      const rect = item.getBoundingClientRect()
      const position = {
        x: rect.left - origin.left + root.scrollLeft,
        y: rect.top - origin.top + root.scrollTop,
      }
      next.set(item, position)
      const before = visual.get(item)
      if (!enabled || !item.animate || !before || rect.width === 0 || rect.height === 0) continue
      const x = before.x - position.x
      const y = before.y - position.y
      if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) continue
      const original = item.style.transform
      const from = `translate(${x}px, ${y}px)`
      // Invert before paint while the optional engine loads. Failure/cancellation restores HTML.
      item.style.transform = from
      let settled = false
      let stop = () => {}
      const ticket: Ticket = {
        cancel: () => {
          if (settled) return
          settled = true
          stop()
          item.style.transform = original
          if (active.current.get(item) === ticket) active.current.delete(item)
        },
      }
      active.current.set(item, ticket)
      void loadPositionEngine()
        .then(({ animatePosition }) => {
          if (settled) return
          if (!item.isConnected || !root.contains(item)) {
            ticket.cancel()
            return
          }
          const controls = animatePosition(item, from, spring)
          stop = () => controls.cancel()
          void controls.then(ticket.cancel, ticket.cancel)
        })
        .catch(ticket.cancel)
    }
    previous.current = next
  }, [ref, transitionKey, enabled, spring, cancel])

  return { cancel }
}

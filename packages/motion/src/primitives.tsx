'use client'

import { motionStagger } from '@betterlibs/tokens'
import {
  Children,
  createContext,
  createElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useMotionPreferences } from './preferences'
import { type MotionPreset, useMotionAnimation } from './use-motion-animation'

export type MotionElement = 'div' | 'section' | 'article' | 'aside' | 'li' | 'ul' | 'ol' | 'span'
type Wrapper = HTMLAttributes<HTMLElement> & { as?: MotionElement; ref?: Ref<HTMLElement> }
const Sequence = createContext(0)
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** Adds no wrapper. Only immediate children receive indices; fragments count as one child. */
export function Stagger({
  children,
  interval = motionStagger.interval,
}: {
  children: ReactNode
  interval?: number
}) {
  const step = Number.isFinite(interval) ? Math.max(0, interval) : motionStagger.interval
  return Children.map(children, (child, index) => (
    <Sequence value={Math.min(index * step, motionStagger.maxDelay)}>{child}</Sequence>
  ))
}

export interface RevealProps extends Wrapper {
  preset?: 'rise' | 'fade'
  once?: boolean
  /** Changing this value repeats the effect while the element is in view. */
  replayKey?: string | number
}

export function Reveal({
  as = 'div',
  ref,
  preset = 'rise',
  once = true,
  replayKey,
  ...props
}: RevealProps): ReactElement {
  const node = useRef<HTMLElement>(null)
  const revealed = useRef(false)
  const { enabled } = useMotionPreferences()
  const { play, cancel } = useMotionAnimation()
  const delay = useContext(Sequence)
  const previousReplay = useRef(replayKey)
  // A replay starts a new observation; the SSR output never has hidden styles.
  useEffect(() => {
    if (previousReplay.current !== replayKey) {
      revealed.current = false
      previousReplay.current = replayKey
    }
    const element = node.current
    if (!element || !enabled || (once && revealed.current) || !window.IntersectionObserver) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && (!once || !revealed.current)) {
            revealed.current = true
            void play([element], preset, { delay })
            if (once) observer.unobserve(element)
          } else if (!entry.isIntersecting) cancel()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancel()
    }
  }, [enabled, once, play, cancel, preset, delay, replayKey])
  return createElement(as, {
    ...props,
    'data-bl-reveal': '',
    ref: (element: HTMLElement | null) => {
      node.current = element
      if (typeof ref === 'function') return ref(element)
      if (ref) ref.current = element
    },
  })
}

export interface PresenceProps extends Wrapper {
  present: boolean
  preset?: Extract<MotionPreset, 'rise' | 'fade'>
  /** Focus destination when a focused descendant exits. Not a dialog/focus trap. */
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function Presence({
  as = 'div',
  ref,
  present,
  preset = 'fade',
  returnFocusRef,
  ...props
}: PresenceProps): ReactElement | null {
  const node = useRef<HTMLElement>(null)
  const focusedWithin = useRef(false)
  const [retained, setRetained] = useState(present)
  const { enabled } = useMotionPreferences()
  const { play, cancel } = useMotionAnimation()
  const mounted = present || retained
  useClientLayoutEffect(() => {
    const element = node.current
    if (!element) return
    let current = true
    if (present) {
      setRetained(true)
      if (enabled) void play([element], preset)
    } else {
      // WebKit can blur the descendant as soon as React applies inert, before this effect.
      if (focusedWithin.current || element.contains(document.activeElement)) {
        if (returnFocusRef?.current) returnFocusRef.current.focus()
        else (document.activeElement as HTMLElement | null)?.blur()
      }
      focusedWithin.current = false
      if (!enabled) setRetained(false)
      else
        void play([element], preset, { exit: true }).then(() => {
          if (current) setRetained(false)
        })
    }
    return () => {
      current = false
      cancel()
    }
  }, [present, enabled, play, cancel, preset, returnFocusRef])
  if (!mounted) return null
  return createElement(as, {
    ...props,
    onPointerDownCapture: (event) => {
      props.onPointerDownCapture?.(event)
      // Safari activates buttons without moving focus to them. Closing from inside still returns focus.
      if (
        !event.defaultPrevented &&
        event.target instanceof Element &&
        event.target.closest('button, a[href], input, select, textarea, [tabindex]')
      )
        focusedWithin.current = true
    },
    onFocusCapture: (event) => {
      focusedWithin.current = true
      props.onFocusCapture?.(event)
    },
    onBlurCapture: (event) => {
      if (event.relatedTarget)
        focusedWithin.current = event.currentTarget.contains(event.relatedTarget)
      props.onBlurCapture?.(event)
    },
    inert: !present || props.inert,
    'aria-hidden': !present ? true : props['aria-hidden'],
    'data-bl-presence': present ? 'present' : 'exiting',
    ref: (element: HTMLElement | null) => {
      node.current = element
      if (typeof ref === 'function') return ref(element)
      if (ref) ref.current = element
    },
  })
}

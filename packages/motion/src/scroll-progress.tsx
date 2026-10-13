'use client'

import { type ComponentPropsWithRef, type RefObject, useEffect, useRef } from 'react'

export type ScrollProgressProps = Omit<
  ComponentPropsWithRef<'progress'>,
  'value' | 'max' | 'children'
> & {
  /** Sin referencia, mide el documento. La referencia debe existir al montar. */
  targetRef?: RefObject<HTMLElement | null>
  /** @default 'Progreso de lectura' */
  label?: string
}

/** Progreso nativo, sin motor, interpolación ni anuncios live. Sigue el scroll también en off. */
export function ScrollProgress({
  targetRef,
  label = 'Progreso de lectura',
  ref,
  ...props
}: ScrollProgressProps) {
  const node = useRef<HTMLProgressElement>(null)
  useEffect(() => {
    let frame: number | undefined
    const update = () => {
      frame = undefined
      const target = targetRef?.current
      const start = target ? target.getBoundingClientRect().top + window.scrollY : 0
      const height = target
        ? target.getBoundingClientRect().height
        : document.documentElement.scrollHeight
      const range = height - window.innerHeight
      if (node.current)
        node.current.value =
          range <= 0
            ? window.scrollY >= start
              ? 1
              : 0
            : Math.min(1, Math.max(0, (window.scrollY - start) / range))
    }
    const schedule = () => {
      if (frame === undefined) {
        if (window.requestAnimationFrame) frame = window.requestAnimationFrame(update)
        else update()
      }
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = window.ResizeObserver ? new ResizeObserver(schedule) : undefined
    observer?.observe(targetRef?.current ?? document.documentElement)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer?.disconnect()
      if (frame !== undefined) window.cancelAnimationFrame?.(frame)
    }
  }, [targetRef])
  return (
    <progress
      {...props}
      aria-label={props['aria-label'] ?? label}
      max={1}
      value={0}
      data-bl-scroll-progress=""
      ref={(element) => {
        node.current = element
        if (typeof ref === 'function') return ref(element)
        if (ref) ref.current = element
      }}
    />
  )
}

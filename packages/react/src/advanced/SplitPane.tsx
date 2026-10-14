'use client'

import { type ReactNode, useId, useRef } from 'react'
import styles from './SplitPane.module.css'
import { useValue } from './shared'

export type SplitPaneProps = {
  label: string
  first: ReactNode
  second: ReactNode
  value?: number
  defaultValue?: number
  onValueChange?: (percent: number) => void
  min?: number
  max?: number
  orientation?: 'horizontal' | 'vertical'
}

/** Separador redimensionable. En móvil apila paneles y conserva el valor elegido en escritorio. */
export function SplitPane({
  label,
  first,
  second,
  value,
  defaultValue = 50,
  onValueChange,
  min = 20,
  max = 80,
  orientation = 'horizontal',
}: SplitPaneProps) {
  const id = useId(),
    root = useRef<HTMLDivElement>(null)
  const [size, setSize] = useValue(value, defaultValue, onValueChange)
  const clamped = Math.max(min, Math.min(max, size))
  const vertical = orientation === 'vertical'
  const dragging = useRef(false)
  return (
    <div
      ref={root}
      className={styles.root}
      data-orientation={orientation}
      style={{
        [vertical ? 'gridTemplateRows' : 'gridTemplateColumns']:
          `${clamped}fr 12px ${100 - clamped}fr`,
      }}
    >
      <section id={`${id}-first`} className={styles.pane} aria-label={`${label}: primer panel`}>
        {first}
      </section>
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-controls={`${id}-first`}
        aria-orientation={vertical ? 'horizontal' : 'vertical'}
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={min}
        aria-valuemax={max}
        className={styles.handle}
        onKeyDown={(event) => {
          const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
          const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight',
            backward = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'
          if ([forward, backward, 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            setSize(
              event.key === 'Home'
                ? min
                : event.key === 'End'
                  ? max
                  : Math.max(
                      min,
                      Math.min(
                        max,
                        size + (event.key === forward ? 1 : -1) * (event.shiftKey ? 10 : 2),
                      ),
                    ),
            )
          }
        }}
        onPointerDown={(event) => {
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!dragging.current || !root.current) return
          const bounds = root.current.getBoundingClientRect()
          const next = vertical
            ? (event.clientY - bounds.top) / bounds.height
            : (event.clientX - bounds.left) / bounds.width
          const rtl = !vertical && getComputedStyle(event.currentTarget).direction === 'rtl'
          if (Number.isFinite(next))
            setSize(Math.max(min, Math.min(max, (rtl ? 1 - next : next) * 100)))
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
        onLostPointerCapture={() => {
          dragging.current = false
        }}
      />
      <section className={styles.pane} aria-label={`${label}: segundo panel`}>
        {second}
      </section>
    </div>
  )
}

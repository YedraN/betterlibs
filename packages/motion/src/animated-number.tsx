'use client'

import { motionRoles } from '@betterlibs/tokens'
import { type ComponentPropsWithRef, useEffect, useMemo, useRef, useState } from 'react'
import { useMotionPreferences } from './preferences'

export type AnimatedNumberProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Valor final, siempre disponible para lectores de pantalla y en el HTML del servidor. */
  value: number
  /** Primera entrada en vista y repeticiones. Sin él no cuenta al montar. */
  startValue?: number
  /** Locale explícito para que servidor y navegador formateen igual. @default 'es-ES' */
  locale?: string
  format?: Intl.NumberFormatOptions
  /** Duración en ms. Por defecto lee --bl-motion-navigation-duration. */
  duration?: number
  replayKey?: string | number
}

const hidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
} as const

/** Un único valor accesible; los fotogramas no actualizan estado React ni regiones live. */
export function AnimatedNumber({
  value,
  startValue,
  locale = 'es-ES',
  format,
  duration,
  replayKey,
  style,
  ...props
}: AnimatedNumberProps) {
  if (!Number.isFinite(value))
    throw new RangeError('AnimatedNumber: value debe ser un número finito.')
  const options = JSON.stringify(format ?? {})
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, JSON.parse(options)),
    [locale, options],
  )
  const visual = useRef<HTMLSpanElement>(null)
  const displayed = useRef(value)
  const previous = useRef({ value, replayKey })
  const started = useRef(false)
  const [visible, setVisible] = useState(false)
  const { enabled } = useMotionPreferences()

  useEffect(() => {
    const element = visual.current
    if (!element) return
    if (!window.IntersectionObserver) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(entries.some((entry) => entry.isIntersecting))
      },
      { threshold: 0.1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = visual.current
    if (!element) return
    const changed = previous.current.value !== value
    const replay = previous.current.replayKey !== replayKey
    previous.current = { value, replayKey }
    const initial = !started.current && startValue !== undefined
    const css = getComputedStyle(element).getPropertyValue('--bl-motion-navigation-duration').trim()
    const cssDuration = css
      ? Number.parseFloat(css) * (css.endsWith('ms') ? 1 : 1000)
      : motionRoles.navigation.duration
    const requested = duration ?? cssDuration
    const milliseconds = Number.isFinite(requested)
      ? Math.max(0, Math.min(requested, 10000))
      : motionRoles.navigation.duration
    const finish = () => {
      displayed.current = value
      element.textContent = formatter.format(value)
      element.dataset.state = 'idle'
    }
    if (
      !enabled ||
      !visible ||
      !window.requestAnimationFrame ||
      milliseconds === 0 ||
      (!initial && !changed && !replay)
    ) {
      finish()
      return
    }
    const from =
      initial || replay
        ? startValue !== undefined && Number.isFinite(startValue)
          ? startValue
          : value
        : displayed.current
    started.current = true
    if (from === value) {
      finish()
      return
    }
    element.textContent = formatter.format(from)
    element.dataset.state = 'running'
    let frame = 0
    let start: number | undefined
    const tick = (now: number) => {
      start ??= now
      const progress = Math.min(1, Math.max(0, (now - start) / milliseconds))
      displayed.current = from + (value - from) * (1 - (1 - progress) ** 3)
      element.textContent = formatter.format(displayed.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else finish()
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [value, startValue, formatter, duration, replayKey, enabled, visible])

  const final = formatter.format(value)
  return (
    <span
      {...props}
      data-bl-animated-number=""
      data-value={value}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
    >
      <span ref={visual} data-bl-number-visual="" data-state="idle" aria-hidden="true">
        {final}
      </span>
      <span data-bl-number-final="" style={hidden}>
        {final}
      </span>
    </span>
  )
}

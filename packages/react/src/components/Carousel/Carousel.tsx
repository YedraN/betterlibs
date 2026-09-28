'use client'

import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@betterlibs/icons'
import {
  Children,
  type ComponentPropsWithRef,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars, Responsive, Space } from '../../utils/types'
import { responsiveVars, spaceVar } from '../../utils/types'
import { usePrefersReducedMotion } from '../../utils/use-reduced-motion'
import { IconButton } from '../IconButton/IconButton'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './Carousel.module.css'

export type CarouselProps = Omit<ComponentPropsWithRef<'section'>, 'children'> & {
  /** Nombre del carrusel para lectores de pantalla: «Testimonios de clientes». */
  label: string
  /** Una diapositiva por hijo. */
  children: ReactNode
  /** Diapositivas visibles a la vez, fijo o por breakpoint. @default 1 */
  slidesPerView?: Responsive<number>
  /** Separación entre diapositivas. @default '6' */
  gap?: Space
  /** Al llegar al final, «Siguiente» vuelve al principio. */
  loop?: boolean
  /**
   * Avance automático cada N ms. Desactivado por defecto: el movimiento automático distrae y
   * dificulta la lectura. Si lo activas, hay botón de pausa, se detiene al pasar el ratón o al
   * entrar con el teclado, y no se activa si el usuario pide reducir el movimiento.
   */
  autoplay?: number
  /** Muestra los indicadores de posición. @default true */
  showIndicators?: boolean
  /** @default 'Anterior' */
  previousLabel?: string
  /** @default 'Siguiente' */
  nextLabel?: string
  /** @default 'Pausar el carrusel' */
  pauseLabel?: string
  /** @default 'Reanudar el carrusel' */
  playLabel?: string
  /** Nombre de cada diapositiva. @default (n, total) => `${n} de ${total}` */
  slideLabel?: (index: number, total: number) => string
  /** Nombre de cada indicador. @default (n) => `Ir a la diapositiva ${n}` */
  goToLabel?: (index: number) => string
  /** @default 'carrusel' */
  roleDescription?: string
  /** @default 'diapositiva' */
  slideRoleDescription?: string
}

/**
 * Carrusel accesible (patrón WAI-ARIA) sobre scroll nativo con `scroll-snap`: funciona con
 * deslizamiento táctil, trackpad y teclado, y sin JavaScript se puede desplazar igualmente.
 *
 * Úsalo para contenido secundario (logos, testimonios, galerías). Lo que va después de la
 * primera diapositiva lo ve muy poca gente: no escondas ahí nada importante.
 */
export function Carousel({
  label,
  children,
  slidesPerView = 1,
  gap = '6',
  loop = false,
  autoplay,
  showIndicators = true,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  pauseLabel = 'Pausar el carrusel',
  playLabel = 'Reanudar el carrusel',
  slideLabel = (n, total) => `${n} de ${total}`,
  goToLabel = (n) => `Ir a la diapositiva ${n}`,
  roleDescription = 'carrusel',
  slideRoleDescription = 'diapositiva',
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  ...props
}: CarouselProps) {
  const slides = Children.toArray(children)
  const total = slides.length
  const viewportRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(1)
  const reducedMotion = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const lastIndex = Math.max(0, total - perView)
  const perViewVars = responsiveVars('bl-carousel-per-view', slidesPerView, (v) => v)

  // El autoplay arranca en el cliente, y solo si no se ha pedido reducir el movimiento.
  useEffect(() => {
    setPlaying(Boolean(autoplay) && !reducedMotion)
  }, [autoplay, reducedMotion])

  // Si las diapositivas no tienen nada enfocable, la zona desplazable se hace enfocable para
  // poder moverla con las flechas del teclado (WCAG 2.1.1).
  const [scrollableFocus, setScrollableFocus] = useState(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: se recalcula si cambian las diapositivas
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    setScrollableFocus(
      !viewport.querySelector('a[href], button, input, select, textarea, [tabindex], video'),
    )
  }, [children])

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const first = viewport?.firstElementChild as HTMLElement | null
    if (!viewport || !first) return
    const gapPx = Number.parseFloat(getComputedStyle(viewport).columnGap) || 0
    const step = first.offsetWidth + gapPx
    if (step <= 0) return
    const visible = Math.max(1, Math.round((viewport.clientWidth + gapPx) / step))
    setPerView(visible)
    setIndex(
      Math.min(Math.round(Math.abs(viewport.scrollLeft) / step), Math.max(0, total - visible)),
    )
  }, [total])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    measure()
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    viewport.addEventListener('scroll', onScroll, { passive: true })
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : undefined
    observer?.observe(viewport)
    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [measure])

  // `announce`: solo los cambios pedidos por el usuario se anuncian (el autoplay no).
  const goTo = useCallback(
    (target: number, announce = true) => {
      const viewport = viewportRef.current
      const slide = viewport?.children[target] as HTMLElement | undefined
      if (!viewport || !slide) return
      const rtl = getComputedStyle(viewport).direction === 'rtl'
      const slideRect = slide.getBoundingClientRect()
      const viewportRect = viewport.getBoundingClientRect()
      const delta = rtl ? slideRect.right - viewportRect.right : slideRect.left - viewportRect.left
      viewport.scrollBy?.({ left: delta, behavior: reducedMotion ? 'auto' : 'smooth' })
      setIndex(target)
      if (announce) setAnnouncement(slideLabel(target + 1, total))
    },
    [reducedMotion, slideLabel, total],
  )

  const atStart = index <= 0
  const atEnd = index >= lastIndex
  const previous = () => {
    if (!atStart) goTo(index - 1)
    else if (loop) goTo(lastIndex)
  }
  const next = () => {
    if (!atEnd) goTo(index + 1)
    else if (loop) goTo(0)
  }

  useEffect(() => {
    if (!autoplay || !playing || hovered) return
    const timer = setInterval(() => goTo(index < lastIndex ? index + 1 : 0, false), autoplay)
    return () => clearInterval(timer)
  }, [autoplay, playing, hovered, index, lastIndex, goTo])

  const positions = lastIndex + 1

  return (
    <section
      className={cx(styles.root, className)}
      aria-roledescription={roleDescription}
      aria-label={label}
      {...perViewVars.data}
      style={{ ...perViewVars.style, '--_gap': spaceVar(gap), ...style } as CSSVars}
      onMouseEnter={(event) => {
        setHovered(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setHovered(false)
        onMouseLeave?.(event)
      }}
      // Al entrar con el teclado se detiene del todo (patrón WAI-ARIA); se reanuda con el botón.
      onFocus={(event) => {
        if (event.target !== event.currentTarget.querySelector('[data-bl-carousel-play]')) {
          setPlaying(false)
        }
        onFocus?.(event)
      }}
      {...props}
    >
      {total > perView && (
        <div className={styles.controls}>
          {autoplay ? (
            <IconButton
              label={playing ? pauseLabel : playLabel}
              variant="outline"
              shape="circle"
              size="sm"
              data-bl-carousel-play=""
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          ) : null}
          {showIndicators && positions <= 10 ? (
            <div className={styles.indicators}>
              {Array.from({ length: positions }, (_, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
                  key={i}
                  type="button"
                  className={styles.indicator}
                  aria-label={goToLabel(i + 1)}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          ) : showIndicators ? (
            <p className={styles.counter} aria-hidden="true">
              {index + 1} / {positions}
            </p>
          ) : null}
          <div className={styles.arrows}>
            <IconButton
              label={previousLabel}
              variant="outline"
              shape="circle"
              aria-disabled={(atStart && !loop) || undefined}
              onClick={previous}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              label={nextLabel}
              variant="outline"
              shape="circle"
              aria-disabled={(atEnd && !loop) || undefined}
              onClick={next}
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
        </div>
      )}
      <div ref={viewportRef} className={styles.viewport} tabIndex={scrollableFocus ? 0 : undefined}>
        {slides.map((slide, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: las diapositivas no cambian de orden
            key={i}
            className={styles.slide}
            role="group"
            aria-roledescription={slideRoleDescription}
            aria-label={slideLabel(i + 1, total)}
          >
            {slide}
          </div>
        ))}
      </div>
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {announcement}
      </VisuallyHidden>
    </section>
  )
}

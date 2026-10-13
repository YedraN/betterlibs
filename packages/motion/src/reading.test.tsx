import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MotionProvider } from './preferences'
import { ScrollProgress } from './scroll-progress'
import { TextReveal } from './text-reveal'

let frames: Map<number, FrameRequestCallback>
let frameId = 0
const tick = () =>
  act(() => {
    const pending = [...frames.values()]
    frames.clear()
    for (const callback of pending) callback(0)
  })
beforeEach(() => {
  frames = new Map()
  window.scrollY = 0
  window.innerHeight = 1000
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('ResizeObserver', undefined)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
})

describe('Reading primitives', () => {
  it('SSR conserva líneas visibles, una copia accesible y progreso nativo sin regiones live', () => {
    const html = renderToString(
      <>
        <h1>
          <TextReveal lines={['Diseñar para', 'que se lea.']} />
        </h1>
        <ScrollProgress />
      </>,
    )
    expect(html).toContain('Diseñar para que se lea.')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('max="1"')
    expect(html).toContain('value="0"')
    expect(html).not.toContain('aria-live')
    expect(html).not.toContain('opacity:0')
  })
  it('el nombre del título no duplica líneas y permite actualizar texto sin ocultarlo en off', () => {
    const sample = (lines: string[]) => (
      <MotionProvider mode="off">
        <h1>
          <TextReveal lines={lines} />
        </h1>
      </MotionProvider>
    )
    const { rerender } = render(sample(['Una idea.', 'Otra idea.']))
    expect(screen.getByRole('heading', { name: 'Una idea. Otra idea.' })).toBeTruthy()
    rerender(sample(['Una idea.', 'Una idea.']))
    expect(screen.getByRole('heading', { name: 'Una idea. Una idea.' })).toBeTruthy()
    expect(document.querySelectorAll('[data-bl-reveal]')).toHaveLength(2)
    expect(frames.size).toBe(0)
  })
  it('mide un artículo, acota el valor y sigue el scroll en off sin actualizaciones React por frame', () => {
    const target = createRef<HTMLElement>()
    const element = document.createElement('article')
    target.current = element
    let height = 3000
    element.getBoundingClientRect = () => ({ top: 100 - window.scrollY, height }) as DOMRect
    const ref = createRef<HTMLProgressElement>()
    const { unmount } = render(
      <MotionProvider mode="off">
        <ScrollProgress ref={ref} targetRef={target} label="Lectura del artículo" />
      </MotionProvider>,
    )
    expect(screen.getByRole('progressbar', { name: 'Lectura del artículo' })).toBe(ref.current)
    expect(ref.current?.value).toBe(0)
    window.scrollY = 1100
    act(() => {
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('scroll'))
    })
    expect(frames.size).toBe(1)
    tick()
    expect(ref.current?.value).toBe(0.5)
    window.scrollY = 4000
    act(() => window.dispatchEvent(new Event('scroll')))
    tick()
    expect(ref.current?.value).toBe(1)
    height = 500
    window.scrollY = 0
    act(() => window.dispatchEvent(new Event('resize')))
    tick()
    expect(ref.current?.value).toBe(0)
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(frames.size).toBe(1)
    unmount()
    expect(frames.size).toBe(0)
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(frames.size).toBe(0)
  })
  it('mide el documento y actualiza el progreso al cambiar el tamaño del contenido sin RAF', () => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    let resized = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resized = callback
        }
        observe() {}
        disconnect = disconnect
      },
    )
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 3000,
    })
    const { unmount } = render(<ScrollProgress />)
    const progress = screen.getByRole('progressbar') as HTMLProgressElement
    window.scrollY = 1000
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(progress.value).toBe(0.5)
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 5000,
    })
    act(resized)
    expect(progress.value).toBe(0.25)
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })
})

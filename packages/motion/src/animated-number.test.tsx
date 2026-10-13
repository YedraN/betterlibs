import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnimatedNumber } from './animated-number'
import { MotionProvider } from './preferences'

let frames: Map<number, FrameRequestCallback>
let frameId = 0
function step(time: number) {
  const pending = [...frames.values()]
  frames.clear()
  act(() => {
    for (const callback of pending) callback(time)
  })
}
const visual = () => document.querySelector('[data-bl-number-visual]') as HTMLElement
const final = () => document.querySelector('[data-bl-number-final]') as HTMLElement

beforeEach(() => {
  frames = new Map()
  frameId = 0
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
})

describe('AnimatedNumber', () => {
  it('SSR expone el valor final y un único texto accesible, con locale determinista', () => {
    const html = renderToString(
      <AnimatedNumber
        value={1234.5}
        startValue={0}
        locale="en-US"
        format={{ minimumFractionDigits: 2 }}
      />,
    )
    expect(html).toContain('1,234.50')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('aria-live')
    expect(html).not.toContain('running')
  })
  it('no anima el montaje sin startValue, preserva ref y respeta el formato al cambiar', () => {
    const ref = createRef<HTMLSpanElement>()
    const { rerender } = render(<AnimatedNumber ref={ref} value={20} duration={100} />)
    expect(ref.current?.dataset.value).toBe('20')
    expect(frames.size).toBe(0)
    rerender(
      <AnimatedNumber
        ref={ref}
        value={-12.5}
        duration={100}
        format={{ minimumFractionDigits: 1 }}
      />,
    )
    expect(final().textContent).toBe('-12,5')
    step(0)
    step(50)
    expect(visual().textContent).not.toBe('-12,5')
    expect(final().textContent).toBe('-12,5')
    step(100)
    expect(visual().textContent).toBe('-12,5')
  })
  it('invierte un cambio desde la cifra visible, sin frames obsoletos', () => {
    const { rerender } = render(<AnimatedNumber value={100} startValue={0} duration={100} />)
    step(0)
    step(50)
    const interrupted = visual().textContent
    rerender(<AnimatedNumber value={10} startValue={0} duration={100} />)
    expect(visual().textContent).toBe(interrupted)
    expect(frames.size).toBe(1)
    step(60)
    step(160)
    expect(visual().textContent).toBe('10')
    expect(frames.size).toBe(0)
  })
  it('cancela y presenta el final al restringir la preferencia, sin repetir al reactivarla', () => {
    const sample = (mode: 'system' | 'off') => (
      <MotionProvider mode={mode}>
        <AnimatedNumber value={100} startValue={0} duration={100} />
      </MotionProvider>
    )
    const { rerender } = render(sample('system'))
    step(0)
    step(30)
    rerender(sample('off'))
    expect(visual().textContent).toBe('100')
    expect(frames.size).toBe(0)
    rerender(sample('system'))
    expect(frames.size).toBe(0)
  })
  it('permite repetir y cancela el frame al desmontar', () => {
    const { rerender, unmount } = render(
      <AnimatedNumber value={9} startValue={0} replayKey={0} duration={100} />,
    )
    step(0)
    step(100)
    rerender(<AnimatedNumber value={9} startValue={0} replayKey={1} duration={100} />)
    expect(visual().textContent).toBe('0')
    expect(final().textContent).toBe('9')
    unmount()
    expect(frames.size).toBe(0)
  })
  it('sin RAF o con duración cero presenta el final; los valores no finitos tienen error claro', () => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    const { rerender } = render(<AnimatedNumber value={9} startValue={0} />)
    expect(visual().textContent).toBe('9')
    rerender(<AnimatedNumber value={12} startValue={0} duration={0} />)
    expect(visual().textContent).toBe('12')
    expect(() => renderToString(<AnimatedNumber value={Number.NaN} />)).toThrow(/finito/)
  })
  it('un observador conserva el final fuera de vista y detiene la animación al salir', () => {
    let notify: IntersectionObserverCallback = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          notify = callback
        }
        observe() {}
        disconnect = disconnect
      },
    )
    const { unmount } = render(
      <AnimatedNumber value={50} startValue={0} duration={100} aria-label="Total" />,
    )
    expect(visual().textContent).toBe('50')
    act(() =>
      notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
    )
    expect(frames.size).toBe(1)
    act(() =>
      notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver),
    )
    expect(visual().textContent).toBe('50')
    expect(frames.size).toBe(0)
    expect(screen.getByLabelText('Total')).toBeTruthy()
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })
})

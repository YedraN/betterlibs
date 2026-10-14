import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MotionProvider,
  Presence,
  Reveal,
  Stagger,
  useMotionAnimation,
  useMotionPreferences,
} from './index'

const engine = vi.hoisted(() => ({ animate: vi.fn() }))
vi.mock('motion/mini', () => engine)
let reduced = false
const listeners = new Set<() => void>()
let observers: Array<{
  callback: IntersectionObserverCallback
  observe: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}> = []
let pending: Array<{ finish: () => void; cancel: ReturnType<typeof vi.fn> }> = []

beforeEach(() => {
  reduced = false
  listeners.clear()
  observers = []
  pending = []
  vi.clearAllMocks()
  window.matchMedia = vi.fn(() => ({
    get matches() {
      return reduced
    },
    addEventListener: (_: string, callback: () => void) => {
      listeners.add(callback)
    },
    removeEventListener: (_: string, callback: () => void) => {
      listeners.delete(callback)
    },
  })) as unknown as typeof window.matchMedia
  window.IntersectionObserver = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    constructor(callback: IntersectionObserverCallback) {
      observers.push({ callback, observe: this.observe, disconnect: this.disconnect })
    }
  } as unknown as typeof IntersectionObserver
  Element.prototype.animate = vi.fn()
  engine.animate.mockImplementation(() => {
    let finish = () => {}
    const promise = new Promise<void>((resolve) => {
      finish = resolve
    })
    const cancel = vi.fn()
    pending.push({ finish, cancel })
    return Object.assign(promise, { cancel })
  })
})

describe('motion policy and HTML', () => {
  it('returns focus after pointer activation inside when the browser leaves focus outside', () => {
    const trigger = createRef<HTMLButtonElement>()
    const sample = (present: boolean) => (
      <MotionProvider mode="off">
        <button ref={trigger}>Abrir</button>
        <Presence present={present} returnFocusRef={trigger}>
          <button>Cerrar</button>
        </Presence>
      </MotionProvider>
    )
    const { rerender } = render(sample(true))
    trigger.current?.focus()
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Cerrar' }))
    rerender(sample(false))
    expect(document.activeElement).toBe(trigger.current)
  })
  it('restores focus if applying inert has already blurred the focused descendant', () => {
    const trigger = createRef<HTMLButtonElement>()
    const sample = (present: boolean) => (
      <MotionProvider mode="off">
        <button ref={trigger}>Abrir</button>
        <Presence present={present} returnFocusRef={trigger}>
          <input aria-label="Borrador" />
        </Presence>
      </MotionProvider>
    )
    const { rerender } = render(sample(true))
    const input = screen.getByRole('textbox')
    input.focus()
    input.blur()
    expect(document.activeElement).toBe(document.body)
    rerender(sample(false))
    expect(document.activeElement).toBe(trigger.current)
  })

  it('does not steal focus after the user has moved to an external control', () => {
    const trigger = createRef<HTMLButtonElement>()
    const sample = (present: boolean) => (
      <MotionProvider mode="off">
        <button ref={trigger}>Abrir</button>
        <input aria-label="Fuera" />
        <Presence present={present} returnFocusRef={trigger}>
          <input aria-label="Dentro" />
        </Presence>
      </MotionProvider>
    )
    const { rerender } = render(sample(true))
    screen.getByRole('textbox', { name: 'Dentro' }).focus()
    const outside = screen.getByRole('textbox', { name: 'Fuera' })
    outside.focus()
    rerender(sample(false))
    expect(document.activeElement).toBe(outside)
  })
  it('renders visible semantic HTML without a provider or engine on the server', () => {
    const html = renderToString(
      <ul>
        <Stagger>
          <Reveal as="li">Contenido</Reveal>
        </Stagger>
      </ul>,
    )
    expect(html).toContain('<li')
    expect(html).not.toContain('opacity')
    expect(html).not.toContain('transform')
    expect(engine.animate).not.toHaveBeenCalled()
    expect(renderToString(<Presence present={false}>Oculto</Presence>)).toBe('')
  })

  it('never lets a nested provider override reduced or off', () => {
    const { result } = renderHook(useMotionPreferences, {
      wrapper: ({ children }) => (
        <MotionProvider mode="off">
          <MotionProvider mode="system">{children}</MotionProvider>
        </MotionProvider>
      ),
    })
    expect(result.current.mode).toBe('off')
  })

  it('reacts to changes in system preference and cancels a running effect', async () => {
    const { result } = renderHook(() => ({ ...useMotionPreferences(), ...useMotionAnimation() }))
    const element = document.createElement('div')
    document.body.append(element)
    let playing: Promise<boolean> | undefined
    act(() => {
      playing = result.current.play([element])
    })
    await waitFor(() => expect(engine.animate).toHaveBeenCalledTimes(1))
    act(() => {
      reduced = true
      for (const callback of listeners) callback()
    })
    expect(result.current.enabled).toBe(false)
    expect(pending[0]?.cancel).toHaveBeenCalledTimes(1)
    expect(await playing).toBe(false)
    element.remove()
  })

  it('does not start an effect when off', async () => {
    const { result } = renderHook(useMotionAnimation, {
      wrapper: ({ children }) => <MotionProvider mode="off">{children}</MotionProvider>,
    })
    expect(await result.current.play([document.body])).toBe(false)
    expect(engine.animate).not.toHaveBeenCalled()
  })
})

describe('Reveal and cancellation', () => {
  it('uses shared delay limits, observes once and forwards refs', async () => {
    const ref = createRef<HTMLElement>()
    render(
      <ul>
        <Stagger interval={150}>
          {['A', 'B', 'C'].map((label) => (
            <Reveal key={label} ref={label === 'A' ? ref : undefined} as="li">
              {label}
            </Reveal>
          ))}
        </Stagger>
      </ul>,
    )
    expect(ref.current?.tagName).toBe('LI')
    expect(observers).toHaveLength(3)
    for (const observer of observers) {
      const target = observer.observe.mock.calls[0]?.[0]
      act(() =>
        observer.callback(
          [{ isIntersecting: true, target } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      )
    }
    await waitFor(() => expect(engine.animate).toHaveBeenCalledTimes(3))
    expect(engine.animate.mock.calls.map((call) => call[2].delay)).toEqual([0, 0.15, 0.24])
  })

  it('cancels pending engine work before unmount', async () => {
    const { result, unmount } = renderHook(useMotionAnimation)
    const promise = result.current.play([document.body])
    unmount()
    expect(await promise).toBe(false)
    expect(engine.animate).not.toHaveBeenCalled()
  })

  it('interrupts a previous animation and restores inline transforms', async () => {
    const { result } = renderHook(useMotionAnimation)
    const element = document.createElement('div')
    element.style.transform = 'rotate(4deg)'
    document.body.append(element)
    const first = result.current.play([element])
    await waitFor(() => expect(pending).toHaveLength(1))
    const second = result.current.play([element], 'press')
    expect(await first).toBe(false)
    await waitFor(() => expect(pending).toHaveLength(2))
    act(() => pending[1]?.finish())
    expect(await second).toBe(true)
    expect(element.style.transform).toBe('rotate(4deg)')
    element.remove()
  })
})

describe('Presence', () => {
  it('makes exiting children inert immediately, restores focus and tolerates reopening', async () => {
    const trigger = createRef<HTMLButtonElement>()
    const sample = (present: boolean) => (
      <>
        <button ref={trigger}>Abrir</button>
        <Presence present={present} returnFocusRef={trigger}>
          <input aria-label="Nombre" />
        </Presence>
      </>
    )
    const { rerender } = render(sample(true))
    await waitFor(() => expect(pending).toHaveLength(1))
    screen.getByRole('textbox').focus()
    rerender(sample(false))
    expect(document.activeElement).toBe(trigger.current)
    expect(document.querySelector('[data-bl-presence]')?.hasAttribute('inert')).toBe(true)
    expect(screen.queryByRole('textbox')).toBe(null)
    await waitFor(() => expect(pending).toHaveLength(2))
    rerender(sample(true))
    act(() => pending[1]?.finish())
    expect(screen.getByRole('textbox')).toBeTruthy()
    expect(document.querySelector('[data-bl-presence]')?.hasAttribute('inert')).toBe(false)
  })

  it('removes immediately and restores focus with motion off', () => {
    const trigger = createRef<HTMLButtonElement>()
    const sample = (present: boolean) => (
      <MotionProvider mode="off">
        <button ref={trigger}>Abrir</button>
        <Presence present={present} returnFocusRef={trigger}>
          <button>Cerrar</button>
        </Presence>
      </MotionProvider>
    )
    const { rerender } = render(sample(true))
    fireEvent.focus(screen.getByRole('button', { name: 'Cerrar' }))
    screen.getByRole('button', { name: 'Cerrar' }).focus()
    rerender(sample(false))
    expect(screen.queryByRole('button', { name: 'Cerrar' })).toBe(null)
    expect(document.activeElement).toBe(trigger.current)
    expect(engine.animate).not.toHaveBeenCalled()
  })
})

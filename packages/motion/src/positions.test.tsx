import { act, render, screen, waitFor } from '@testing-library/react'
import { createRef, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { MotionProvider } from './preferences'
import { useLayoutTransition } from './use-layout-transition'

const engine = vi.hoisted(() => ({ animatePosition: vi.fn() }))
vi.mock('./position-engine', () => engine)
let controls: Array<{ cancel: ReturnType<typeof vi.fn>; finish: () => void }>
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
beforeEach(() => {
  controls = []
  vi.clearAllMocks()
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
  Element.prototype.animate = vi.fn()
  vi.stubGlobal(
    'DOMMatrixReadOnly',
    class {
      m41 = 0
      m42 = 0
      constructor(value: string) {
        const numbers = value.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
        this.m41 = numbers[0] ?? 0
        this.m42 = numbers[1] ?? 0
      }
    },
  )
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const index = this.parentElement ? Array.from(this.parentElement.children).indexOf(this) : 0
    return {
      x: 0,
      y: index * 100,
      left: 0,
      top: index * 100,
      width: 100,
      height: 80,
      right: 100,
      bottom: index * 100 + 80,
      toJSON() {},
    }
  })
  engine.animatePosition.mockImplementation(() => {
    let finish = () => {}
    const promise = new Promise<void>((resolve) => {
      finish = resolve
    })
    const cancel = vi.fn()
    controls.push({ cancel, finish })
    return Object.assign(promise, { cancel })
  })
})

function Example({ order, mode = 'system' }: { order: string[]; mode?: 'system' | 'off' }) {
  return (
    <MotionProvider mode={mode}>
      <List order={order} />
    </MotionProvider>
  )
}
function List({ order }: { order: string[] }) {
  const ref = useRef<HTMLUListElement>(null)
  useLayoutTransition(ref, order)
  return (
    <ul ref={ref}>
      {order.map((item) => (
        <li data-bl-layout key={item}>
          <input aria-label={item} defaultValue={item} />
        </li>
      ))}
    </ul>
  )
}

it('el servidor y el montaje inicial presentan el orden final sin motor', () => {
  expect(renderToString(<Example order={['a', 'b']} />)).not.toContain('transform')
  render(<Example order={['a', 'b']} />)
  expect(engine.animatePosition).not.toHaveBeenCalled()
})

it('reordena los mismos nodos y conserva los borradores sin esperar a la animación', async () => {
  const { rerender } = render(<Example order={['a', 'b']} />)
  const input = screen.getByRole('textbox', { name: 'a' }) as HTMLInputElement
  input.value = 'Borrador'
  rerender(<Example order={['b', 'a']} />)
  expect(screen.getAllByRole('textbox')[0]?.getAttribute('aria-label')).toBe('b')
  expect(screen.getByRole('textbox', { name: 'a' })).toBe(input)
  expect(input.value).toBe('Borrador')
  await waitFor(() => expect(engine.animatePosition).toHaveBeenCalledTimes(2))
  expect(engine.animatePosition.mock.calls[0]?.[1]).toBe('translate(0px, 100px)')
  act(() => {
    for (const control of controls) control.finish()
  })
  await waitFor(() => expect(input.parentElement?.style.transform).toBe(''))
})

it('un cambio rápido parte de la posición visible y cancela la ejecución anterior', async () => {
  const { rerender } = render(<Example order={['a', 'b']} />)
  rerender(<Example order={['b', 'a']} />)
  await waitFor(() => expect(controls).toHaveLength(2))
  const item = screen.getByRole('textbox', { name: 'b' }).parentElement
  if (!item) throw new Error('Missing layout item')
  item.style.transform = 'translate(0px, 50px)'
  rerender(<Example order={['a', 'b']} />)
  await waitFor(() => expect(controls).toHaveLength(3))
  expect(controls[0]?.cancel).toHaveBeenCalled()
  expect(engine.animatePosition.mock.calls[2]?.[1]).toBe('translate(0px, -50px)')
})

it('cambiar a off restaura los estilos y no anima el nuevo orden', async () => {
  const { rerender, unmount } = render(<Example order={['a', 'b']} />)
  rerender(<Example order={['b', 'a']} />)
  await waitFor(() => expect(controls).toHaveLength(2))
  rerender(<Example order={['b', 'a']} mode="off" />)
  expect(controls.every((control) => control.cancel.mock.calls.length === 1)).toBe(true)
  expect(screen.getByRole('textbox', { name: 'a' }).parentElement?.style.transform).toBe('')
  rerender(<Example order={['a', 'b']} mode="off" />)
  expect(controls).toHaveLength(2)
  unmount()
})

it('sin WAAPI conserva el contenido estático', () => {
  Element.prototype.animate = undefined as unknown as typeof Element.prototype.animate
  const { rerender } = render(<Example order={['a', 'b']} />)
  rerender(<Example order={['b', 'a']} />)
  expect(engine.animatePosition).not.toHaveBeenCalled()
})

it('cancela al desmontar antes de que llegue el motor', async () => {
  const ref = createRef<HTMLUListElement>()
  function Pending({ version }: { version: number }) {
    useLayoutTransition(ref, version)
    return (
      <ul ref={ref}>
        {(version ? ['b', 'a'] : ['a', 'b']).map((item) => (
          <li data-bl-layout key={item}>
            {item}
          </li>
        ))}
      </ul>
    )
  }
  const { rerender, unmount } = render(<Pending version={0} />)
  const element = ref.current?.firstElementChild as HTMLElement
  rerender(<Pending version={1} />)
  unmount()
  await Promise.resolve()
  expect(element.style.transform).toBe('')
  expect(engine.animatePosition).not.toHaveBeenCalled()
})

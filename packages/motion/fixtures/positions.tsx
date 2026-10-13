import { useRef } from 'react'
import { useLayoutTransition } from '../src/index'

export function PositionsFixture({ order = ['a', 'b'] }: { order?: string[] }) {
  const ref = useRef<HTMLUListElement>(null)
  useLayoutTransition(ref, order)
  return (
    <ul ref={ref}>
      {order.map((key) => (
        <li key={key} data-bl-layout>
          {key}
        </li>
      ))}
    </ul>
  )
}

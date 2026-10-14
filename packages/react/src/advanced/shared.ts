import { useState } from 'react'

/** Estado controlado o local. Los valores públicos siempre prevalecen. */
export function useValue<T>(value: T | undefined, initial: T, change?: (next: T) => void) {
  const [local, setLocal] = useState(initial)
  return [
    value === undefined ? local : value,
    (next: T) => {
      if (value === undefined) setLocal(next)
      change?.(next)
    },
  ] as const
}

export const normalizeSearch = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()

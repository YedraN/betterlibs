import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const getMedia = () =>
  typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : undefined

function subscribe(callback: () => void) {
  const media = getMedia()
  media?.addEventListener('change', callback)
  return () => media?.removeEventListener('change', callback)
}

/** `true` si el usuario ha pedido reducir el movimiento. En el servidor se asume `true`. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => getMedia()?.matches ?? false,
    () => true,
  )
}

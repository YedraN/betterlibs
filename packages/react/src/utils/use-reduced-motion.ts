import { type RefObject, useCallback, useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const getMedia = () =>
  typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : undefined

function subscribe(callback: () => void) {
  const media = getMedia()
  media?.addEventListener('change', callback)
  return () => media?.removeEventListener('change', callback)
}

/** Sistema y restricciones de un ancestro del elemento; SSR siempre estático. */
export function usePrefersReducedMotion(ref?: RefObject<HTMLElement | null>): boolean {
  const observe = useCallback(
    (notify: () => void) => {
      const unsubscribe = subscribe(notify)
      const observer = ref ? new MutationObserver(notify) : undefined
      observer?.observe(document.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-motion'],
      })
      return () => {
        unsubscribe()
        observer?.disconnect()
      }
    },
    [ref],
  )
  const snapshot = useCallback(
    () =>
      Boolean(
        getMedia()?.matches ||
          ref?.current?.closest('[data-motion="reduced"], [data-motion="off"]'),
      ),
    [ref],
  )
  return useSyncExternalStore(observe, snapshot, () => true)
}

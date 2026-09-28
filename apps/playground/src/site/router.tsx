import { type ComponentPropsWithRef, type MouseEvent, useSyncExternalStore } from 'react'

/*
 * Router mínimo con la History API: suficiente para enlazar las plantillas y demostrar `linkAs`.
 * En un proyecto real usarías el de tu framework (Next.js, React Router, Astro…).
 */

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

export function navigate(href: string) {
  const url = new URL(href, window.location.href)
  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  for (const listener of listeners) listener()
}

/** Ruta que se está prerenderizando en el build (ver `scripts/prerender.ts`). */
let serverPathname = '/'

export function setServerPathname(pathname: string) {
  serverPathname = pathname
}

export function usePathname() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    // En el navegador, la hidratación usa la ruta real (la misma con la que se prerenderizó).
    () => (typeof window === 'undefined' ? serverPathname : window.location.pathname),
  )
}

/**
 * Enlace del router. Se pasa a los componentes con `linkAs={RouterLink}`. Los enlaces externos,
 * las anclas y los clics con modificadores (abrir en otra pestaña) siguen el comportamiento normal.
 */
export function RouterLink({ href = '', onClick, ...props }: ComponentPropsWithRef<'a'>) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const internal = href.startsWith('/') && !href.startsWith('//')
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || !internal || modified || event.button !== 0) return
    event.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handleClick} {...props} />
}

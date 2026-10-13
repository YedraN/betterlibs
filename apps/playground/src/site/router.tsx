import {
  type ComponentPropsWithRef,
  type MouseEvent,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react'
import { flushSync } from 'react-dom'

// Demo adapter only. The library never owns a consumer's router or history.
const listeners = new Set<() => void>()
const positions = new Map<string, { x: number; y: number }>()
let serverPathname = '/'
let currentKey = ''
let intent: 'push' | 'pop' | 'hash' = 'push'
let previousRestoration: ScrollRestoration = 'auto'
let activeTransition: ViewTransition | undefined
let mediaQuery: MediaQueryList | undefined
let motionObserver: MutationObserver | undefined
const location = () => window.location.pathname + window.location.search + window.location.hash

function entryKey() {
  let key = window.history.state?.betterlibsEntry as string | undefined
  if (!key) {
    key = crypto.randomUUID()
    window.history.replaceState({ ...window.history.state, betterlibsEntry: key }, '')
  }
  return key
}
function savePosition() {
  if (currentKey) positions.set(currentKey, { x: window.scrollX, y: window.scrollY })
}
function notify() {
  for (const listener of listeners) listener()
}
function pop() {
  savePosition()
  currentKey = entryKey()
  intent = 'pop'
  activeTransition?.skipTransition()
  flushSync(notify)
}
function hashChanged() {
  currentKey = entryKey()
  intent = 'hash'
  notify()
}
function restrictMotion() {
  if (
    mediaQuery?.matches ||
    document.documentElement.matches('[data-motion="off"], [data-motion="reduced"]')
  )
    activeTransition?.skipTransition()
}
function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    currentKey = entryKey()
    previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.addEventListener('scroll', savePosition, { passive: true })
    window.addEventListener('popstate', pop)
    window.addEventListener('hashchange', hashChanged)
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', restrictMotion)
    motionObserver = new MutationObserver(restrictMotion)
    motionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-motion'],
    })
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.history.scrollRestoration = previousRestoration
      window.removeEventListener('scroll', savePosition)
      window.removeEventListener('popstate', pop)
      window.removeEventListener('hashchange', hashChanged)
      mediaQuery?.removeEventListener('change', restrictMotion)
      motionObserver?.disconnect()
      mediaQuery = undefined
      activeTransition?.skipTransition()
    }
  }
}

function hashTarget() {
  try {
    return document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
  } catch {
    return null
  }
}

/** Call once in the application's root. Pop restores scroll, push announces the new heading. */
export function useRouteNavigation(url: string) {
  const previous = useRef(url)
  useLayoutEffect(() => {
    if (previous.current === url) return
    previous.current = url
    const target = hashTarget()
    const heading = document.querySelector<HTMLElement>('main h1')
    const destination = target ?? heading
    if (destination && (intent !== 'hash' || target || !window.location.hash)) {
      if (!destination.hasAttribute('tabindex')) destination.tabIndex = -1
      destination.focus({ preventScroll: true })
    }
    const saved = intent === 'pop' ? positions.get(currentKey) : undefined
    if (saved) window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' })
    else if (target) target.scrollIntoView({ behavior: 'instant' })
    else if (intent === 'push' || !window.location.hash)
      window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
    // The URL includes queries and hashes; all navigation events must run this effect.
    void url
  }, [url])
}

export function navigate(href: string) {
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin) {
    window.location.assign(url.href)
    return
  }
  const next = url.pathname + url.search + url.hash
  if (next === location()) return
  savePosition()
  const routeChanged = url.pathname !== window.location.pathname
  const update = () => {
    currentKey = crypto.randomUUID()
    window.history.pushState({ betterlibsEntry: currentKey }, '', next)
    intent = routeChanged ? 'push' : 'hash'
    flushSync(notify)
  }
  activeTransition?.skipTransition()
  const restricted =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.matches('[data-motion="off"], [data-motion="reduced"]') ||
    document.activeElement?.closest('[data-motion="off"], [data-motion="reduced"]')
  if (!routeChanged || restricted || !document.startViewTransition) {
    update()
    return
  }
  let updated = false
  try {
    const transition = document.startViewTransition(() => {
      updated = true
      update()
    })
    activeTransition = transition
    // Skipped transitions can reject ready; DOM updates and navigation still succeed.
    void transition.ready.catch(() => {})
    void transition.updateCallbackDone.catch(() => {})
    void transition.finished
      .catch(() => {})
      .finally(() => {
        if (activeTransition === transition) activeTransition = undefined
      })
  } catch {
    if (!updated) update()
  }
}

export function setServerPathname(pathname: string) {
  serverPathname = pathname
}
export function useLocation() {
  return useSyncExternalStore(subscribe, location, () =>
    typeof window === 'undefined' ? serverPathname : location(),
  )
}
export function usePathname() {
  return useLocation().split(/[?#]/)[0] ?? '/'
}

/** Honor native external links, downloads, targets, anchors, modifiers and canceled clicks. */
export function RouterLink({
  href = '',
  onClick,
  target,
  download,
  ...props
}: ComponentPropsWithRef<'a'>) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (
      event.defaultPrevented ||
      modified ||
      event.button !== 0 ||
      event.currentTarget.hasAttribute('download') ||
      (event.currentTarget.target && event.currentTarget.target !== '_self')
    )
      return
    const url = new URL(event.currentTarget.href, window.location.href)
    if (url.origin !== window.location.origin || !['http:', 'https:'].includes(url.protocol)) return
    event.preventDefault()
    navigate(url.href)
  }
  return <a href={href} onClick={handleClick} target={target} download={download} {...props} />
}

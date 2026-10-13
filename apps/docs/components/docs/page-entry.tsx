'use client'

import { useMotionAnimation } from '@betterlibs/motion'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useRef } from 'react'

/** Recipe for Next: entry only. Link owns scroll/history, metadata stays in Server Components. */
export function PageEntry({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const previous = useRef(pathname)
  const main = useRef<HTMLElement>(null)
  const { play, cancel } = useMotionAnimation()
  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    const element = main.current
    if (!element) return
    let target: HTMLElement | null = null
    try {
      target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    } catch {}
    target ??= element.querySelector('h1')
    if (target) {
      target.tabIndex = -1
      target.focus({ preventScroll: true })
    }
    void play([element], 'fade')
    return cancel
  }, [pathname, play, cancel])
  return (
    <main
      id="main"
      ref={main}
      data-page-entry=""
      style={{ paddingBlock: '2rem', minHeight: '70vh' }}
    >
      {children}
    </main>
  )
}

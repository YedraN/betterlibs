'use client'

import { type ReactNode, useEffect, useState } from 'react'

/** Sigue el modo de color de Fumadocs (clase `dark` en `<html>`). */
function useDocsTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const root = document.documentElement
    const update = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light')
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return theme
}

/**
 * Lienzo para ejemplos en vivo: aplica los tokens de Betterlibs con el mismo modo de color
 * que la documentación.
 */
export function Preview({
  children,
  padded = true,
  align = 'start',
}: {
  children: ReactNode
  padded?: boolean
  align?: 'start' | 'center'
}) {
  const theme = useDocsTheme()
  return (
    <div
      data-theme={theme}
      className="not-prose my-6 overflow-hidden rounded-xl border"
      style={{
        background: 'var(--bl-color-bg)',
        color: 'var(--bl-color-text)',
        fontFamily: 'var(--bl-font-family-sans)',
      }}
    >
      <div
        className={align === 'center' ? 'flex flex-wrap items-center justify-center gap-4' : ''}
        style={{ padding: padded ? 'var(--bl-space-8)' : 0 }}
      >
        {children}
      </div>
    </div>
  )
}

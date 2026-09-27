'use client'

import { PortalProvider } from '@betterlibs/react'
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
 * Contenedor en `<body>` para los overlays de los ejemplos (diálogos, menús, tooltips,
 * notificaciones), con el mismo tema que la documentación. Va en `<body>` y no dentro del
 * ejemplo para que ningún contenedor de la página recorte o tape los overlays.
 */
function useThemedPortal(theme: 'light' | 'dark') {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const element = document.createElement('div')
    element.style.fontFamily = 'var(--bl-font-family-sans)'
    element.style.color = 'var(--bl-color-text)'
    document.body.append(element)
    setContainer(element)
    return () => element.remove()
  }, [])
  useEffect(() => {
    if (container) container.dataset.theme = theme
  }, [container, theme])
  return container
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
  const portal = useThemedPortal(theme)
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
        <PortalProvider container={portal}>{children}</PortalProvider>
      </div>
    </div>
  )
}

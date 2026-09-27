'use client'

import { createContext, type ReactNode, useContext } from 'react'

const PortalContext = createContext<HTMLElement | null>(null)

export type PortalProviderProps = {
  /**
   * Elemento donde se montan diálogos, menús, tooltips y notificaciones. Por defecto, `<body>`.
   * Útil si una zona de la página usa otro tema (`data-theme` o `createTheme` con `selector`):
   * los overlays abiertos desde ella lo heredan si se montan dentro.
   */
  container: HTMLElement | null
  children: ReactNode
}

/**
 * Cambia dónde se montan los overlays (portales) de los componentes que contiene.
 * @example
 * const [container, setContainer] = useState<HTMLElement | null>(null)
 * <div data-theme="dark">
 *   <PortalProvider container={container}>…</PortalProvider>
 *   <div ref={setContainer} />
 * </div>
 */
export function PortalProvider({ container, children }: PortalProviderProps) {
  return <PortalContext.Provider value={container}>{children}</PortalContext.Provider>
}

/** Contenedor de portales actual (`undefined` = `<body>`). */
export function usePortalContainer(): HTMLElement | undefined {
  return useContext(PortalContext) ?? undefined
}

'use client'

import { type MotionMode, MotionProvider, useMotionPreferences } from '@betterlibs/motion'
import { PortalProvider } from '@betterlibs/react'
import { createContext, type ReactNode, useContext, useEffect, useId, useState } from 'react'
import styles from './preview.module.css'

const Replay = createContext(0)
/** Changes without remounting a demo. Participants opt in with replayKey. */
export function usePreviewReplay() {
  return useContext(Replay)
}
export function useDocsTheme() {
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
function useThemedPortal(theme: string, preset: string, mode: MotionMode) {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const element = document.createElement('div')
    element.dataset.docsPreview = ''
    element.style.fontFamily = 'var(--bl-font-family-sans)'
    element.style.color = 'var(--bl-color-text)'
    document.body.append(element)
    setContainer(element)
    return () => element.remove()
  }, [])
  useEffect(() => {
    if (container) {
      container.dataset.theme = theme
      container.dataset.preset = preset
      container.dataset.motion = mode
    }
  }, [container, theme, preset, mode])
  return container
}

export function Preview({
  children,
  padded = true,
  align = 'start',
  preset = 'default',
  controls = false,
  replay = false,
  code,
  label = 'Ejemplo interactivo',
}: {
  children: ReactNode
  padded?: boolean
  align?: 'start' | 'center'
  preset?: 'default' | 'editorial'
  controls?: boolean
  replay?: boolean
  code?: string
  label?: string
}) {
  const docsTheme = useDocsTheme()
  const [choice, setChoice] = useState('docs')
  const [mode, setMode] = useState<MotionMode>('system')
  const [currentPreset, setPreset] = useState(preset)
  const [replayKey, setReplay] = useState(0)
  const [copy, setCopy] = useState<'idle' | 'copied' | 'error'>('idle')
  const { prefersReduced } = useMotionPreferences()
  const theme = choice === 'docs' ? docsTheme : choice
  const effectivePreset = controls ? currentPreset : preset
  const effectiveMode = mode === 'system' && prefersReduced ? 'reduced' : mode
  const portal = useThemedPortal(theme, effectivePreset, effectiveMode)
  const id = useId()
  async function copyCode() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(code ?? '')
      setCopy('copied')
    } catch {
      setCopy('error')
    }
  }
  return (
    <MotionProvider mode={mode}>
      <Replay value={replayKey}>
        <div
          className={`not-prose ${styles.root}`}
          data-docs-preview=""
          data-theme={theme}
          data-preset={effectivePreset}
          data-motion={effectiveMode}
          role="group"
          aria-label={label}
        >
          {controls && (
            <div className={styles.toolbar}>
              <label htmlFor={`${id}-theme`}>
                Tema
                <select
                  id={`${id}-theme`}
                  value={choice}
                  onChange={(event) => setChoice(event.target.value)}
                >
                  <option value="docs">Documentación</option>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
              </label>
              <label htmlFor={`${id}-preset`}>
                Estilo
                <select
                  id={`${id}-preset`}
                  value={currentPreset}
                  onChange={(event) => setPreset(event.target.value as typeof preset)}
                >
                  <option value="editorial">Editorial</option>
                  <option value="default">Base</option>
                </select>
              </label>
              <label htmlFor={`${id}-motion`}>
                Movimiento
                <select
                  id={`${id}-motion`}
                  value={mode}
                  onChange={(event) => setMode(event.target.value as MotionMode)}
                >
                  <option value="system">Sistema</option>
                  <option value="reduced">Reducido</option>
                  <option value="off">Desactivado</option>
                </select>
              </label>
              {replay && <ReplayButton onReplay={() => setReplay((value) => value + 1)} />}
            </div>
          )}
          <div
            className={align === 'center' ? styles.center : undefined}
            style={{ padding: padded ? 'var(--bl-space-6)' : 0 }}
          >
            <PortalProvider container={portal}>{children}</PortalProvider>
          </div>
          {code && (
            <div className={styles.source}>
              <details>
                <summary>Ver código</summary>
                <pre tabIndex={0} aria-label={`Código de ${label}`}>
                  <code>{code}</code>
                </pre>
              </details>
              <button type="button" onClick={copyCode}>
                Copiar código
              </button>
              <span role="status">
                {copy === 'copied'
                  ? 'Código copiado.'
                  : copy === 'error'
                    ? 'No se pudo copiar. Abre el código y selecciónalo.'
                    : ''}
              </span>
            </div>
          )}
        </div>
      </Replay>
    </MotionProvider>
  )
}
function ReplayButton({ onReplay }: { onReplay: () => void }) {
  const { enabled } = useMotionPreferences()
  return (
    <button type="button" onClick={onReplay} disabled={!enabled}>
      Repetir animación
    </button>
  )
}

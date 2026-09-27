'use client'

import { type ComponentPropsWithRef, type ReactNode, useEffect } from 'react'
import { Button } from '../../components/Button/Button'
import { cx } from '../../utils/cx'
import styles from './CookieConsent.module.css'
import {
  ensureConsentLoaded,
  openConsentPreferences,
  updateConsent,
  useConsentSnapshot,
} from './store'

export type ConsentGateProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  /** Categoría que necesita el contenido (`'marketing'` para un vídeo de YouTube, por ejemplo). */
  category: string
  /** El contenido de terceros: mapa, vídeo, widget… */
  children: ReactNode
  /** @default 'Contenido de terceros' */
  title?: ReactNode
  /** @default 'Este contenido lo ofrece un servicio externo que usa cookies. Para verlo, permite esas cookies.' */
  message?: ReactNode
  /** @default 'Permitir y mostrar' */
  allowLabel?: string
  /** @default 'Configurar cookies' */
  settingsLabel?: string
  /** Relación de aspecto del hueco (evita saltos al cargar el contenido). */
  ratio?: number
}

/**
 * Muestra un contenido de terceros (mapa, vídeo) solo si hay consentimiento para su categoría.
 * Mientras tanto, un aviso con botón para permitirlo en el momento. Así no se carga nada que
 * instale cookies antes de tiempo.
 *
 * @example
 * <ConsentGate category="marketing" ratio={16 / 9}>
 *   <iframe src="https://www.youtube-nocookie.com/embed/…" title="Presentación de la empresa" />
 * </ConsentGate>
 */
export function ConsentGate({
  category,
  children,
  title = 'Contenido de terceros',
  message = 'Este contenido lo ofrece un servicio externo que usa cookies. Para verlo, permite esas cookies.',
  allowLabel = 'Permitir y mostrar',
  settingsLabel = 'Configurar cookies',
  ratio,
  className,
  style,
  ...props
}: ConsentGateProps) {
  const { ready, consent } = useConsentSnapshot()
  useEffect(() => ensureConsentLoaded(), [])

  if (ready && consent?.[category] === true) return children

  return (
    <div
      className={cx(styles.gate, className)}
      style={{ ...(ratio ? { aspectRatio: String(ratio) } : {}), ...style }}
      {...props}
    >
      <p className={styles.gateTitle}>{title}</p>
      <p className={styles.gateMessage}>{message}</p>
      <div className={styles.gateActions}>
        <Button size="sm" onClick={() => updateConsent({ [category]: true })}>
          {allowLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={openConsentPreferences}>
          {settingsLabel}
        </Button>
      </div>
    </div>
  )
}

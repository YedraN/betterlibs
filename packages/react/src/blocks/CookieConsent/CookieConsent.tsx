'use client'

import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { Dialog, DialogContent } from '../../components/Dialog/Dialog'
import { Switch } from '../../components/Switch/Switch'
import styles from './CookieConsent.module.css'
import {
  type ConsentCategories,
  type ConsentConfig,
  closeConsentPreferences,
  configureConsent,
  openConsentPreferences,
  saveConsent,
  useConsentSnapshot,
} from './store'

export type CookieCategory = {
  /** Identificador: el que consultas con `hasConsent('analytics')`. */
  id: string
  label: ReactNode
  /** Para qué se usan y, si procede, de quién son. */
  description?: ReactNode
  /** Imprescindibles: siempre activas, no se pueden desactivar. */
  required?: boolean
}

/** Categorías habituales en una web corporativa. Adáptalas a las cookies que uses de verdad. */
export const defaultCookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    label: 'Necesarias',
    description:
      'Imprescindibles para que la web funcione: seguridad, sesión y guardar esta misma elección.',
    required: true,
  },
  {
    id: 'preferences',
    label: 'Preferencias',
    description: 'Recuerdan tus opciones, como el idioma o la región.',
  },
  {
    id: 'analytics',
    label: 'Analíticas',
    description: 'Nos ayudan a entender cómo se usa la web para mejorarla, con datos estadísticos.',
  },
  {
    id: 'marketing',
    label: 'Publicidad',
    description: 'Permiten mostrarte anuncios relevantes en otras webs y medir las campañas.',
  },
]

export type CookieConsentProps = Partial<ConsentConfig> & {
  /** URL de la política de cookies (obligatoria en la primera capa de información). */
  policyHref: string
  /** Categorías de cookies. @default defaultCookieCategories */
  categories?: CookieCategory[]
  /** @default 'Usamos cookies' */
  title?: ReactNode
  /** Texto del aviso. Explica qué cookies usas y para qué, en pocas líneas. */
  description?: ReactNode
  /** @default 'Política de cookies' */
  policyLabel?: ReactNode
  /** @default 'Aceptar todas' */
  acceptLabel?: string
  /** @default 'Rechazar todas' */
  rejectLabel?: string
  /** @default 'Configurar' */
  settingsLabel?: string
  /** @default 'Guardar mi selección' */
  saveLabel?: string
  /** @default 'Configurar cookies' */
  preferencesTitle?: ReactNode
  /** @default 'Elige qué cookies aceptas. Puedes cambiarlo cuando quieras desde el pie de la web.' */
  preferencesDescription?: ReactNode
  /** @default 'Siempre activas' */
  alwaysActiveLabel?: string
  /** Nombre de la región del aviso. @default 'Aviso de cookies' */
  label?: string
  /** Se llama con cada decisión. Úsalo para cargar o retirar scripts. */
  onChange?: (consent: ConsentCategories) => void
}

/**
 * Aviso y configuración de cookies conforme al RGPD, la LSSI y la guía de la AEPD:
 * - «Aceptar» y «Rechazar» con el mismo peso visual, en la primera capa.
 * - Configuración por categorías, sin casillas activadas de antemano.
 * - La decisión se guarda (con versión y caducidad) y se puede cambiar en cualquier momento con
 *   `cookieConsent.open()` (p. ej. desde el enlace «Configurar cookies» del pie).
 *
 * No bloquea la página ni roba el foco. Móntalo al principio del `<body>` para que sea lo primero
 * al navegar con el teclado. Carga los scripts no necesarios solo tras el consentimiento
 * (`useCookieConsent`, `ConsentGate`).
 */
export function CookieConsent({
  policyHref,
  categories = defaultCookieCategories,
  title = 'Usamos cookies',
  description = 'Usamos cookies propias y de terceros para que la web funcione y, si nos das permiso, para analizar su uso y mostrarte publicidad relevante. Puedes aceptarlas todas, rechazar las que no son necesarias o elegir cuáles aceptas.',
  policyLabel = 'Política de cookies',
  acceptLabel = 'Aceptar todas',
  rejectLabel = 'Rechazar todas',
  settingsLabel = 'Configurar',
  saveLabel = 'Guardar mi selección',
  preferencesTitle = 'Configurar cookies',
  preferencesDescription = 'Elige qué cookies aceptas. Puedes cambiarlo cuando quieras desde el pie de la web.',
  alwaysActiveLabel = 'Siempre activas',
  label = 'Aviso de cookies',
  storageKey,
  version,
  maxAgeDays,
  onChange,
}: CookieConsentProps) {
  const titleId = useId()
  const bannerRef = useRef<HTMLDivElement>(null)
  const { ready, consent, preferencesOpen } = useConsentSnapshot()
  const [draft, setDraft] = useState<ConsentCategories>({})

  useEffect(() => {
    configureConsent({
      ...(storageKey ? { storageKey } : {}),
      ...(version ? { version } : {}),
      ...(maxAgeDays ? { maxAgeDays } : {}),
    })
  }, [storageKey, version, maxAgeDays])

  const all = (value: boolean): ConsentCategories =>
    Object.fromEntries(
      categories.map((category) => [category.id, category.required ? true : value]),
    )

  // Al abrir la configuración se parte de la decisión guardada (o de todo desactivado).
  // biome-ignore lint/correctness/useExhaustiveDependencies: solo al abrir
  useEffect(() => {
    if (preferencesOpen) setDraft({ ...all(false), ...(consent ?? {}) })
  }, [preferencesOpen])

  const showBanner = ready && consent === null

  // El aviso fijo no debe tapar el elemento enfocado (WCAG 2.4.11): se reserva su alto.
  useEffect(() => {
    const banner = bannerRef.current
    if (!showBanner || !banner) return
    const root = document.documentElement
    const update = () => {
      root.style.scrollPaddingBottom = `${banner.offsetHeight + 16}px`
    }
    update()
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : undefined
    observer?.observe(banner)
    return () => {
      observer?.disconnect()
      root.style.scrollPaddingBottom = ''
    }
  }, [showBanner])

  const decide = (value: ConsentCategories) => {
    saveConsent(value)
    onChange?.(value)
  }

  return (
    <>
      {showBanner && (
        <div
          ref={bannerRef}
          className={styles.banner}
          role="region"
          aria-label={label}
          aria-describedby={titleId}
        >
          <div className={styles.inner}>
            <div className={styles.text}>
              <p id={titleId} className={styles.title}>
                {title}
              </p>
              <p className={styles.description}>
                {description} <a href={policyHref}>{policyLabel}</a>
              </p>
            </div>
            <div className={styles.actions}>
              <Button variant="ghost" onClick={openConsentPreferences}>
                {settingsLabel}
              </Button>
              {/* Rechazar y aceptar con el mismo peso visual (guía de la AEPD). */}
              <Button onClick={() => decide(all(false))}>{rejectLabel}</Button>
              <Button onClick={() => decide(all(true))}>{acceptLabel}</Button>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={preferencesOpen}
        onOpenChange={(open) => (open ? openConsentPreferences() : closeConsentPreferences())}
      >
        <DialogContent
          title={preferencesTitle}
          description={preferencesDescription}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => decide(draft)}>
                {saveLabel}
              </Button>
              <Button onClick={() => decide(all(false))}>{rejectLabel}</Button>
              <Button onClick={() => decide(all(true))}>{acceptLabel}</Button>
            </>
          }
        >
          <ul className={styles.categories}>
            {categories.map((category) => (
              <li key={category.id} className={styles.category}>
                <Switch
                  label={
                    <span className={styles.categoryLabel}>
                      {category.label}
                      {category.required && (
                        <Badge size="sm" tone="success">
                          {alwaysActiveLabel}
                        </Badge>
                      )}
                    </span>
                  }
                  description={category.description}
                  labelPosition="start"
                  checked={category.required ? true : Boolean(draft[category.id])}
                  disabled={category.required}
                  onCheckedChange={(checked) =>
                    setDraft((current) => ({ ...current, [category.id]: checked }))
                  }
                />
              </li>
            ))}
          </ul>
          <p className={styles.policy}>
            <a href={policyHref}>{policyLabel}</a>
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}

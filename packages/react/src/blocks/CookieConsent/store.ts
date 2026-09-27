'use client'

import { useSyncExternalStore } from 'react'

/** Consentimiento por categoría (`{ analytics: true, marketing: false }`). */
export type ConsentCategories = Record<string, boolean>

type Stored = { categories: ConsentCategories; version: string; date: string }

export type ConsentConfig = {
  /** Clave en `localStorage`. @default 'bl-cookie-consent' */
  storageKey: string
  /** Cámbiala cuando cambien las categorías o los proveedores: se vuelve a preguntar. @default '1' */
  version: string
  /** Días de validez del consentimiento; después se vuelve a preguntar. @default 365 */
  maxAgeDays: number
}

type Snapshot = {
  /** Ya se ha leído el almacenamiento (solo en el cliente). */
  ready: boolean
  consent: ConsentCategories | null
  preferencesOpen: boolean
}

const DAY = 24 * 60 * 60 * 1000
const serverSnapshot: Snapshot = { ready: false, consent: null, preferencesOpen: false }

let config: ConsentConfig = { storageKey: 'bl-cookie-consent', version: '1', maxAgeDays: 365 }
let snapshot: Snapshot = serverSnapshot
const listeners = new Set<() => void>()

function set(partial: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...partial }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function read(): ConsentCategories | null {
  try {
    const raw = window.localStorage.getItem(config.storageKey)
    if (!raw) return null
    const stored = JSON.parse(raw) as Stored
    const age = Date.now() - Date.parse(stored.date)
    if (stored.version !== config.version || !(age < config.maxAgeDays * DAY)) return null
    return stored.categories
  } catch {
    return null
  }
}

/** Aplica la configuración y lee el consentimiento guardado. */
export function configureConsent(next: Partial<ConsentConfig>) {
  config = { ...config, ...next }
  set({ ready: true, consent: read() })
}

/** Lee el consentimiento guardado si aún no se ha hecho. */
export function ensureConsentLoaded() {
  if (!snapshot.ready) set({ ready: true, consent: read() })
}

/** Guarda la decisión y cierra la configuración. */
export function saveConsent(categories: ConsentCategories) {
  const stored: Stored = { categories, version: config.version, date: new Date().toISOString() }
  try {
    window.localStorage.setItem(config.storageKey, JSON.stringify(stored))
  } catch {
    // Sin almacenamiento: la decisión vale solo para esta visita.
  }
  set({ consent: categories, preferencesOpen: false, ready: true })
}

/** Cambia algunas categorías manteniendo el resto. */
export function updateConsent(partial: ConsentCategories) {
  saveConsent({ ...(snapshot.consent ?? {}), ...partial })
}

/** Abre la ventana de configuración (p. ej. desde el enlace «Configurar cookies» del pie). */
export function openConsentPreferences() {
  set({ preferencesOpen: true })
}

export function closeConsentPreferences() {
  set({ preferencesOpen: false })
}

/** Borra la decisión: el aviso vuelve a aparecer. */
export function resetConsent() {
  try {
    window.localStorage.removeItem(config.storageKey)
  } catch {
    // Nada que borrar.
  }
  set({ consent: null })
}

export function useConsentSnapshot() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  )
}

/**
 * Lee el consentimiento de cookies para cargar (o no) scripts y contenidos de terceros.
 *
 * @example
 * const { hasConsent } = useCookieConsent()
 * useEffect(() => { if (hasConsent('analytics')) cargarAnalitica() }, [hasConsent])
 */
export function useCookieConsent() {
  const { ready, consent } = useConsentSnapshot()
  return {
    /** `false` hasta leer el almacenamiento en el cliente. */
    ready,
    /** El usuario ya ha aceptado, rechazado o configurado. */
    decided: consent !== null,
    consent,
    hasConsent: (category: string) => consent?.[category] === true,
    openPreferences: openConsentPreferences,
    update: updateConsent,
    reset: resetConsent,
  }
}

/** Acciones fuera de React: `cookieConsent.open()` desde un enlace del pie, por ejemplo. */
export const cookieConsent = {
  open: openConsentPreferences,
  reset: resetConsent,
  update: updateConsent,
  get: () => snapshot.consent,
}

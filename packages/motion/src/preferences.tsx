'use client'

import { createContext, type ReactNode, useContext, useSyncExternalStore } from 'react'

export type MotionMode = 'system' | 'reduced' | 'off'
export type MotionIntensity = 'subtle' | 'standard'
const query = '(prefers-reduced-motion: reduce)'
function subscribe(notify: () => void) {
  const media = window.matchMedia?.(query)
  media?.addEventListener('change', notify)
  return () => media?.removeEventListener('change', notify)
}
const snapshot = () => window.matchMedia?.(query).matches ?? true
const serverSnapshot = () => true
const Preferences = createContext<{ mode: MotionMode; intensity: MotionIntensity } | null>(null)

/** Does not introduce a DOM wrapper. Nested providers cannot undo a parent's restrictions. */
export function MotionProvider({
  children,
  mode = 'system',
  intensity = 'subtle',
}: {
  children: ReactNode
  mode?: MotionMode
  intensity?: MotionIntensity
}) {
  const parent = useContext(Preferences)
  const effectiveMode =
    parent?.mode === 'off' ? 'off' : parent?.mode === 'reduced' && mode !== 'off' ? 'reduced' : mode
  return <Preferences value={{ mode: effectiveMode, intensity }}>{children}</Preferences>
}

/** Safe without a provider; the OS preference always takes precedence. */
export function useMotionPreferences() {
  const preferences = useContext(Preferences)
  const prefersReduced = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const mode = preferences?.mode ?? 'system'
  const effectiveMode: MotionMode =
    mode === 'off' ? 'off' : mode === 'reduced' || prefersReduced ? 'reduced' : 'system'
  return {
    mode: effectiveMode,
    intensity: preferences?.intensity ?? 'subtle',
    prefersReduced,
    enabled: effectiveMode === 'system',
  }
}

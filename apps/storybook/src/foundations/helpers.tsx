import { contrast } from '@betterlibs/tokens'
import { type CSSProperties, type ReactNode, useLayoutEffect, useState } from 'react'

const mono: CSSProperties = {
  fontFamily: 'var(--bl-font-family-mono)',
  fontSize: 'var(--bl-font-size-xs)',
}

export const styles = {
  mono,
  muted: {
    color: 'var(--bl-color-text-muted)',
    fontSize: 'var(--bl-font-size-sm)',
  } as CSSProperties,
  grid: (min: string): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
    gap: 'var(--bl-space-4)',
  }),
}

export function Page({
  title,
  intro,
  children,
}: {
  title: string
  intro: ReactNode
  children: ReactNode
}) {
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-10)', maxWidth: 'var(--bl-container-xl)' }}>
      <header style={{ display: 'grid', gap: 'var(--bl-space-3)' }}>
        <h1 style={{ fontSize: 'var(--bl-font-size-4xl)' }}>{title}</h1>
        <p
          style={{
            ...styles.muted,
            fontSize: 'var(--bl-font-size-lg)',
            maxWidth: 'var(--bl-container-prose)',
          }}
        >
          {intro}
        </p>
      </header>
      {children}
    </div>
  )
}

export function Block({
  title,
  description,
  children,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <section style={{ display: 'grid', gap: 'var(--bl-space-4)' }}>
      <div style={{ display: 'grid', gap: 'var(--bl-space-1)' }}>
        <h2 style={{ fontSize: 'var(--bl-font-size-2xl)' }}>{title}</h2>
        {description && (
          <p style={{ ...styles.muted, maxWidth: 'var(--bl-container-prose)' }}>{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

const toHex = (rgb: string) => {
  const parts = rgb
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number) ?? [0, 0, 0]
  return `#${parts.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('')}`
}

/**
 * Lee el valor real (resuelto) de variables CSS de color dentro de `scope`
 * (por defecto el documento), para mostrar hex y calcular contrastes en vivo.
 */
export function useResolvedColors(
  vars: string[],
  scope?: HTMLElement | null,
): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({})
  const key = vars.join('|')
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` representa `vars`.
  useLayoutEffect(() => {
    const probe = document.createElement('span')
    probe.style.display = 'none'
    ;(scope ?? document.body).append(probe)
    const next: Record<string, string> = {}
    for (const name of vars) {
      probe.style.color = `var(${name})`
      next[name] = toHex(getComputedStyle(probe).color)
    }
    probe.remove()
    setValues(next)
  }, [key, scope])
  return values
}

export function Swatch({ name, value, label }: { name: string; value?: string; label?: string }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-2)' }}>
      <div
        style={{
          height: '4rem',
          borderRadius: 'var(--bl-radius-md)',
          background: `var(${name})`,
          boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.08)',
        }}
      />
      <div style={{ display: 'grid', gap: '2px' }}>
        <strong style={{ fontSize: 'var(--bl-font-size-sm)' }}>{label ?? name}</strong>
        <code style={{ ...mono, color: 'var(--bl-color-text-muted)' }}>{name}</code>
        {value && <code style={{ ...mono, color: 'var(--bl-color-text-subtle)' }}>{value}</code>}
      </div>
    </div>
  )
}

export function ContrastBadge({ fg, bg, min }: { fg?: string; bg?: string; min: number }) {
  if (!fg || !bg) return null
  const ratio = contrast(fg, bg)
  const pass = ratio >= min
  return (
    <span
      style={{
        ...mono,
        display: 'inline-flex',
        gap: 'var(--bl-space-1)',
        padding: '2px var(--bl-space-2)',
        borderRadius: 'var(--bl-radius-full)',
        background: pass ? 'var(--bl-color-success-bg)' : 'var(--bl-color-danger-bg)',
        color: pass ? 'var(--bl-color-success-text)' : 'var(--bl-color-danger-text)',
        border: `1px solid ${pass ? 'var(--bl-color-success-border)' : 'var(--bl-color-danger-border)'}`,
      }}
    >
      {pass ? '✓' : '✕'} {ratio.toFixed(2)}:1
      <span style={{ opacity: 0.8 }}>(mín. {min})</span>
    </span>
  )
}

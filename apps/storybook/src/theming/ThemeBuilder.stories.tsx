import { createTheme, type RadiusPreset } from '@betterlibs/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useState } from 'react'
import { Block, Page, styles } from '../foundations/helpers'

type Args = { brand: string; radius: RadiusPreset; fontSans: string }

const meta: Meta<Args> = {
  title: 'Theming/Generador de tema',
  args: { brand: '#0a5cff', radius: 'soft', fontSans: '' },
  argTypes: {
    brand: { control: 'color', description: 'Color principal de la marca (hex)' },
    radius: {
      control: 'inline-radio',
      options: ['sharp', 'soft', 'round'],
      description: 'Redondeo global',
    },
    fontSans: { control: 'text', description: "Familia tipográfica, p. ej. 'Inter, sans-serif'" },
  },
}
export default meta

const SCOPE = '[data-bl-theme-preview]'

const button = (variant: 'solid' | 'subtle'): CSSProperties => ({
  minHeight: 'var(--bl-control-height-md)',
  paddingInline: 'var(--bl-space-5)',
  borderRadius: 'var(--bl-radius-md)',
  border: 0,
  fontWeight: 600,
  background: variant === 'solid' ? 'var(--bl-color-accent)' : 'var(--bl-color-accent-subtle)',
  color: variant === 'solid' ? 'var(--bl-color-on-accent)' : 'var(--bl-color-accent-text)',
})

function Preview() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--bl-space-4)',
        padding: 'var(--bl-space-8)',
        background: 'var(--bl-color-bg)',
        color: 'var(--bl-color-text)',
        fontFamily: 'var(--bl-font-family-sans)',
        border: '1px solid var(--bl-color-border)',
        borderRadius: 'var(--bl-radius-xl)',
      }}
    >
      <span
        style={{
          ...styles.mono,
          color: 'var(--bl-color-accent-text)',
          letterSpacing: 'var(--bl-tracking-wide)',
        }}
      >
        CONSULTORÍA
      </span>
      <h2
        style={{ fontSize: 'var(--bl-font-size-4xl)', fontFamily: 'var(--bl-font-family-display)' }}
      >
        Estrategia digital para empresas que quieren crecer
      </h2>
      <p style={{ color: 'var(--bl-color-text-muted)', maxWidth: 'var(--bl-container-prose)' }}>
        Te ayudamos a ordenar procesos, datos y equipos.{' '}
        <a href="#casos">Conoce nuestros casos de éxito</a>.
      </p>
      <div style={{ display: 'flex', gap: 'var(--bl-space-3)', flexWrap: 'wrap' }}>
        <button type="button" style={button('solid')}>
          Solicitar propuesta
        </button>
        <button type="button" style={button('subtle')}>
          Ver servicios
        </button>
      </div>
      <label
        style={{
          display: 'grid',
          gap: 'var(--bl-space-1)',
          maxWidth: '22rem',
          fontSize: 'var(--bl-font-size-sm)',
          fontWeight: 500,
        }}
      >
        Correo corporativo
        <input
          type="email"
          placeholder="nombre@empresa.com"
          style={{
            minHeight: 'var(--bl-control-height-md)',
            paddingInline: 'var(--bl-space-3)',
            borderRadius: 'var(--bl-radius-md)',
            border: '1px solid var(--bl-color-border-input)',
            background: 'var(--bl-color-surface)',
          }}
        />
      </label>
      <p
        style={{
          padding: 'var(--bl-space-3) var(--bl-space-4)',
          borderRadius: 'var(--bl-radius-md)',
          background: 'var(--bl-color-success-bg)',
          color: 'var(--bl-color-success-text)',
          border: '1px solid var(--bl-color-success-border)',
        }}
      >
        ✓ Mensaje enviado. Te responderemos en menos de 24 horas.
      </p>
    </div>
  )
}

function buildTheme({ brand, radius, fontSans }: Args) {
  try {
    return {
      theme: createTheme({
        brand,
        radius,
        fontSans: fontSans || undefined,
        selector: SCOPE,
        strict: false,
      }),
    }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

function Builder(args: Args) {
  const [copied, setCopied] = useState(false)
  const { theme, error } = buildTheme(args)
  const failures = theme?.contrast.filter((r) => !r.pass) ?? []
  const options = {
    brand: args.brand,
    radius: args.radius,
    ...(args.fontSans ? { fontSans: args.fontSans } : {}),
  }
  const code = `import { createTheme } from '@betterlibs/tokens'

const theme = createTheme(${JSON.stringify(options, null, 2)})
// theme.css → inyéctalo en tu layout o guárdalo como .css`

  const copy = async () => {
    await navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Page
      title="Generador de tema"
      intro="Elige el color de tu marca en los controles. createTheme() genera la escala completa en OKLCH, escoge automáticamente los tonos que cumplen WCAG AA para botones, enlaces y foco, y te avisa si algo no llega."
    >
      {error && (
        <p role="alert" style={{ color: 'var(--bl-color-danger-text)' }}>
          {error}
        </p>
      )}
      {theme && (
        <>
          <style>{theme.css}</style>
          <Block title="Vista previa">
            <div data-bl-theme-preview="">
              <Preview />
            </div>
          </Block>

          <Block title="Escala generada" description="El paso con borde conserva tu color exacto.">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
                gap: 'var(--bl-space-1)',
              }}
            >
              {Object.entries(theme.brand).map(([step, hex]) => (
                <div key={step} style={{ display: 'grid', gap: 'var(--bl-space-1)' }}>
                  <div
                    style={{
                      height: '3.5rem',
                      background: hex,
                      borderRadius: 'var(--bl-radius-sm)',
                      outline:
                        hex === args.brand.toLowerCase()
                          ? '2px solid var(--bl-color-text)'
                          : undefined,
                      outlineOffset: 2,
                    }}
                  />
                  <code style={{ ...styles.mono, fontSize: '0.65rem' }}>{step}</code>
                </div>
              ))}
            </div>
          </Block>

          <Block
            title="Accesibilidad"
            description={
              failures.length === 0
                ? `✓ Los ${theme.contrast.length} pares de contraste cumplen WCAG 2.2 AA en modo claro y oscuro.`
                : `✕ ${failures.length} pares no cumplen WCAG AA. Con strict: true (por defecto) este tema lanzaría un error.`
            }
          >
            {failures.length > 0 && (
              <ul
                style={{
                  display: 'grid',
                  gap: 'var(--bl-space-1)',
                  color: 'var(--bl-color-danger-text)',
                }}
              >
                {failures.map((f) => (
                  <li key={`${f.mode}-${f.fg}-${f.bg}`}>
                    [{f.mode}] {f.usage}: {f.ratio}:1 (mínimo {f.min}:1)
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block title="Código">
            <div style={{ position: 'relative' }}>
              <pre
                style={{
                  padding: 'var(--bl-space-5)',
                  background: 'var(--bl-color-bg-inverse)',
                  color: 'var(--bl-color-text-inverse)',
                  borderRadius: 'var(--bl-radius-lg)',
                  overflowX: 'auto',
                }}
              >
                <code>{code}</code>
              </pre>
              <button
                type="button"
                onClick={copy}
                style={{
                  position: 'absolute',
                  insetBlockStart: 'var(--bl-space-3)',
                  insetInlineEnd: 'var(--bl-space-3)',
                  minHeight: 'var(--bl-control-height-sm)',
                  paddingInline: 'var(--bl-space-3)',
                  borderRadius: 'var(--bl-radius-md)',
                  border: '1px solid var(--bl-color-border-strong)',
                  background: 'var(--bl-color-surface)',
                  color: 'var(--bl-color-text)',
                }}
              >
                <span aria-live="polite">{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </Block>
        </>
      )}
    </Page>
  )
}

export const Generador: StoryObj<Args> = {
  render: (args) => <Builder {...args} />,
}

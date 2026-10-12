import '@betterlibs/react/styles.css'
import { Button, Card, Field, Input, Stack, Text } from '@betterlibs/react'
import { createTheme, editorial } from '@betterlibs/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = { title: 'Fundamentos/Preset editorial', parameters: { layout: 'fullscreen' } }
export default meta

function Sample({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <section
      data-preset="editorial"
      data-theme={mode}
      aria-label={`Editorial ${mode === 'light' ? 'claro' : 'oscuro'}`}
      style={{
        background: 'var(--bl-color-bg)',
        color: 'var(--bl-color-text)',
        padding: 'var(--bl-space-8)',
        minWidth: 0,
      }}
    >
      <Stack gap="6">
        <Text size="sm" tone="muted">
          MARFIL · CARBÓN · LIMA
        </Text>
        <h2
          style={{
            fontSize: 'var(--bl-type-heading-size)',
            lineHeight: 'var(--bl-type-heading-leading)',
            letterSpacing: 'var(--bl-type-display-tracking)',
            overflowWrap: 'anywhere',
          }}
        >
          Diseña con intención.
        </h2>
        <Text tone="muted">
          Superficies planas, tipografía expresiva y controles legibles. El acento acompaña las
          acciones; la jerarquía organiza el contenido.
        </Text>
        <Card padding="6">
          <Stack gap="4">
            <Text weight="semibold">Tu próxima colección</Text>
            <Text tone="muted">
              Una tarjeta con contenido más largo mantiene el ritmo de lectura, permite que el texto
              crezca y conserva el espacio necesario para interactuar.
            </Text>
            <Field label="Nombre de la colección" description="Puedes cambiarlo después.">
              <Input placeholder="Interfaces que se sienten vivas" />
            </Field>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bl-space-3)' }}>
              <Button>Crear colección</Button>
              <Button variant="secondary">Ver ejemplos</Button>
            </div>
          </Stack>
        </Card>
      </Stack>
    </section>
  )
}

export const ClaroYOscuro: StoryObj = {
  name: 'Claro y oscuro',
  render: () => (
    <main>
      <h1 style={{ fontSize: 'var(--bl-font-size-2xl)', padding: 'var(--bl-space-6)' }}>
        Preset editorial
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))',
        }}
      >
        <Sample mode="light" />
        <Sample mode="dark" />
      </div>
    </main>
  ),
}

export const Contraste: StoryObj = {
  render: () => {
    const theme = createTheme({ preset: editorial })
    return (
      <main style={{ padding: 'var(--bl-space-6)' }}>
        <h1 style={{ fontSize: 'var(--bl-font-size-2xl)' }}>Contraste del preset editorial</h1>
        <p>
          {theme.contrast.length} pares verificados en claro y oscuro. Los ratios se muestran
          redondeados; la validación usa el valor completo.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'start', borderSpacing: '1rem' }}>
            <caption>Texto, acciones y controles</caption>
            <thead>
              <tr>
                {['Modo', 'Uso', 'Ratio', 'Mínimo', 'Resultado'].map((label) => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {theme.contrast.map((pair) => (
                <tr key={`${pair.mode}-${pair.fg}-${pair.bg}`}>
                  <td>{pair.mode}</td>
                  <td>{pair.usage}</td>
                  <td>{pair.ratio}:1</td>
                  <td>{pair.min}:1</td>
                  <td>{pair.pass ? 'Cumple' : 'Revisar'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    )
  },
}

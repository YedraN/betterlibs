'use client'

import { ArrowRightIcon } from '@betterlibs/icons'
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Field,
  Grid,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  VisuallyHidden,
} from '@betterlibs/react'
import { createTheme, type RadiusPreset } from '@betterlibs/tokens'
import { useMemo, useState } from 'react'

const SCOPE = '[data-bl-theme-preview]'

function build(brand: string, radius: RadiusPreset, fontSans: string, selector: string) {
  try {
    return {
      theme: createTheme({
        brand,
        radius,
        fontSans: fontSans.trim() || undefined,
        selector,
        strict: false,
      }),
    }
  } catch (error) {
    return { error: (error as Error).message }
  }
}

function Sample() {
  return (
    <Stack gap="5">
      <Text variant="eyebrow">Consultoría</Text>
      <Heading level={3} size="3xl">
        Estrategia para empresas que quieren crecer
      </Heading>
      <Text tone="muted">
        Te ayudamos a ordenar procesos, datos y equipos.{' '}
        <Link href="#casos">Conoce nuestros casos de éxito</Link>.
      </Text>
      <ButtonGroup>
        <Button iconEnd={<ArrowRightIcon />}>Solicitar propuesta</Button>
        <Button variant="secondary">Ver servicios</Button>
        <Button variant="outline">Contacto</Button>
      </ButtonGroup>
      <Grid columns={{ base: 1, sm: 2 }} gap="5">
        <Field label="Email de trabajo" required>
          <Input type="email" placeholder="nombre@empresa.com" />
        </Field>
        <Field label="Con error" error="Introduce un email válido">
          <Input defaultValue="nombre@empresa" />
        </Field>
      </Grid>
      <Stack direction="row" gap="6" wrap>
        <Checkbox label="Casilla marcada" defaultChecked />
        <Switch label="Interruptor" defaultChecked />
      </Stack>
      <Stack direction="row" gap="2" wrap>
        <Badge tone="accent">Nuevo</Badge>
        <Badge tone="success" dot>
          Disponible
        </Badge>
        <Badge tone="warning">Plazas limitadas</Badge>
        <Badge tone="danger">Agotado</Badge>
      </Stack>
      <Alert tone="success" title="Mensaje enviado">
        Te responderemos en menos de 24 horas.
      </Alert>
    </Stack>
  )
}

/**
 * Generador de tema: elige la marca, el redondeo y la tipografía y mira el resultado con los
 * componentes reales, en claro y en oscuro, con el informe de contraste y el código.
 */
export function ThemeBuilder() {
  const [brand, setBrand] = useState('#0a5cff')
  const [draft, setDraft] = useState('#0a5cff')
  const [radius, setRadius] = useState<RadiusPreset>('soft')
  const [fontSans, setFontSans] = useState('')
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [copied, setCopied] = useState<'code' | 'css' | null>(null)

  const preview = useMemo(() => build(brand, radius, fontSans, SCOPE), [brand, radius, fontSans])
  const exported = useMemo(() => build(brand, radius, fontSans, ':root'), [brand, radius, fontSans])
  const theme = preview.theme
  const failures = theme?.contrast.filter((result) => !result.pass) ?? []

  const options = { brand, radius, ...(fontSans.trim() ? { fontSans: fontSans.trim() } : {}) }
  const code = `import { createTheme } from '@betterlibs/tokens'

export const theme = createTheme(${JSON.stringify(options, null, 2)})
// theme.css → inyéctalo en tu layout (<style>) o guárdalo como archivo .css`

  const copy = async (kind: 'code' | 'css') => {
    const text = kind === 'code' ? code : (exported.theme?.css ?? '')
    await navigator.clipboard?.writeText(text)
    setCopied(kind)
    setTimeout(() => setCopied(null), 2000)
  }

  const updateBrand = (value: string) => {
    setDraft(value)
    if (/^#[0-9a-f]{6}$/i.test(value)) setBrand(value.toLowerCase())
  }

  return (
    <Stack gap="8">
      <Grid columns={{ base: 1, md: 2 }} gap="5">
        <Stack direction="row" gap="3" align="end">
          <Field
            label="Color de marca"
            description="Hexadecimal, p. ej. #0a5cff."
            style={{ flex: 1 }}
          >
            <Input value={draft} onChange={(event) => updateBrand(event.target.value)} />
          </Field>
          <input
            type="color"
            aria-label="Elegir color de marca con el selector"
            value={brand}
            onChange={(event) => updateBrand(event.target.value)}
            style={{
              inlineSize: 'var(--bl-control-height-md)',
              blockSize: 'var(--bl-control-height-md)',
              padding: 2,
              border: '1px solid var(--bl-color-border-input)',
              borderRadius: 'var(--bl-radius-md)',
              background: 'var(--bl-color-bg)',
              cursor: 'pointer',
            }}
          />
        </Stack>
        <Field label="Redondeo">
          <Select
            value={radius}
            onChange={(event) => setRadius(event.target.value as RadiusPreset)}
            options={[
              { value: 'sharp', label: 'Recto (sharp)' },
              { value: 'soft', label: 'Suave (soft)' },
              { value: 'round', label: 'Redondeado (round)' },
            ]}
          />
        </Field>
        <Field
          label="Tipografía"
          indicator="optional"
          description="Recuerda cargar la fuente en tu web."
        >
          <Input
            value={fontSans}
            onChange={(event) => setFontSans(event.target.value)}
            placeholder="'Inter', system-ui, sans-serif"
          />
        </Field>
        <RadioGroup
          label="Vista previa"
          name="modo"
          value={mode}
          onValueChange={(value) => setMode(value as 'light' | 'dark')}
          orientation="horizontal"
        >
          <Radio value="light" label="Claro" />
          <Radio value="dark" label="Oscuro" />
        </RadioGroup>
      </Grid>

      {preview.error && (
        <Alert tone="danger" title="No se puede generar el tema" role="alert">
          {preview.error}
        </Alert>
      )}

      {theme && (
        <>
          <style>{theme.css}</style>
          <div
            data-bl-theme-preview=""
            data-theme={mode}
            style={{
              padding: 'var(--bl-space-8)',
              border: '1px solid var(--bl-color-border)',
              borderRadius: 'var(--bl-radius-xl)',
              background: 'var(--bl-color-bg)',
              color: 'var(--bl-color-text)',
              fontFamily: 'var(--bl-font-family-sans)',
            }}
          >
            <Sample />
          </div>

          <Stack gap="3">
            <Heading level={3} size="md">
              Escala generada
            </Heading>
            <Text size="sm" tone="muted">
              El paso marcado conserva tu color exacto; el resto se calcula en OKLCH.
            </Text>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
                gap: '0.25rem',
              }}
            >
              {Object.entries(theme.brand).map(([step, hex]) => (
                <div key={step} style={{ display: 'grid', gap: '0.25rem', textAlign: 'center' }}>
                  <div
                    title={hex}
                    style={{
                      blockSize: '3rem',
                      borderRadius: 'var(--bl-radius-sm)',
                      background: hex,
                      outline: hex === brand ? '2px solid var(--bl-color-text)' : undefined,
                      outlineOffset: 2,
                    }}
                  />
                  <code style={{ fontSize: '0.65rem' }}>{step}</code>
                </div>
              ))}
            </div>
          </Stack>

          {failures.length === 0 ? (
            <Alert tone="success" title="Contraste correcto">
              Los {theme.contrast.length} pares de contraste cumplen WCAG 2.2 AA en modo claro y
              oscuro.
            </Alert>
          ) : (
            <Alert tone="warning" title={`${failures.length} pares no cumplen WCAG AA`}>
              <p>
                Con <code>strict: true</code> (por defecto) este tema lanzaría un error. Prueba con
                un color más oscuro o más saturado.
              </p>
              <ul>
                {failures.map((failure) => (
                  <li key={`${failure.mode}-${failure.fg}-${failure.bg}`}>
                    [{failure.mode === 'light' ? 'claro' : 'oscuro'}] {failure.usage}:{' '}
                    {failure.ratio}:1 (mínimo {failure.min}:1)
                  </li>
                ))}
              </ul>
            </Alert>
          )}

          <Stack gap="3">
            <Heading level={3} size="md">
              Código
            </Heading>
            <pre
              style={{
                margin: 0,
                padding: 'var(--bl-space-5)',
                overflowX: 'auto',
                borderRadius: 'var(--bl-radius-lg)',
                background: 'var(--bl-color-bg-inverse)',
                color: 'var(--bl-color-text-inverse)',
                fontSize: 'var(--bl-font-size-sm)',
              }}
            >
              <code>{code}</code>
            </pre>
            <ButtonGroup>
              <Button variant="outline" onClick={() => copy('code')}>
                {copied === 'code' ? 'Código copiado' : 'Copiar código'}
              </Button>
              <Button variant="outline" onClick={() => copy('css')} disabled={!exported.theme}>
                {copied === 'css' ? 'CSS copiado' : 'Copiar CSS generado'}
              </Button>
            </ButtonGroup>
            <VisuallyHidden aria-live="polite">
              {copied ? 'Copiado al portapapeles' : ''}
            </VisuallyHidden>
          </Stack>
        </>
      )}
    </Stack>
  )
}

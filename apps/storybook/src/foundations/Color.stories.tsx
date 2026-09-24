import { color, contrastPairs, light } from '@betterlibs/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, ContrastBadge, Page, Swatch, styles, useResolvedColors } from './helpers'

const meta: Meta = {
  title: 'Fundamentos/Color',
  parameters: { layout: 'padded' },
}
export default meta

const scales = ['brand', 'neutral', 'success', 'warning', 'danger', 'info'] as const

export const Primitivos: StoryObj = {
  render: () => (
    <Page
      title="Color · primitivos"
      intro="Las escalas en bruto. Los componentes no las usan directamente: usan tokens semánticos, que son los que cambian con el tema y la marca. Cambia la marca en la barra superior para ver la escala generada."
    >
      {scales.map((scale) => {
        const steps = Object.keys(color[scale]) as unknown as number[]
        return (
          <Block key={scale} title={scale}>
            <div style={styles.grid('6.5rem')}>
              {steps.map((step) => (
                <Swatch key={step} name={`--bl-color-${scale}-${step}`} label={String(step)} />
              ))}
            </div>
          </Block>
        )
      })}
    </Page>
  ),
}

const groups: { title: string; description: string; prefix: RegExp }[] = [
  {
    title: 'Fondos y superficies',
    description: 'Dónde se apoya el contenido.',
    prefix: /^(bg|surface|overlay)/,
  },
  {
    title: 'Texto',
    description: 'Jerarquía de lectura: principal, secundario y terciario.',
    prefix: /^text/,
  },
  {
    title: 'Bordes',
    description: '`border-input` cumple 3:1 para que los campos se distingan.',
    prefix: /^border/,
  },
  {
    title: 'Acento',
    description: 'El color de marca aplicado a acciones y enlaces.',
    prefix: /^(accent|on-accent|focus)/,
  },
  {
    title: 'Estados',
    description: 'Éxito, aviso, error e información. Nunca comuniques un estado solo con color.',
    prefix: /^(success|warning|danger|info|on-(success|warning|danger|info))/,
  },
]

export const Semanticos: StoryObj = {
  name: 'Semánticos',
  render: () => {
    const names = Object.keys(light).map((k) => `--bl-color-${k}`)
    const resolved = useResolvedColors(names)
    return (
      <Page
        title="Color · semánticos"
        intro="Describen la intención, no el valor. Usa siempre estos tokens en tus estilos: así tu interfaz funciona en modo claro, oscuro y con cualquier marca sin tocar código."
      >
        {groups.map((group) => (
          <Block key={group.title} title={group.title} description={group.description}>
            <div style={styles.grid('10rem')}>
              {Object.keys(light)
                .filter((k) => group.prefix.test(k))
                .map((k) => (
                  <Swatch
                    key={k}
                    name={`--bl-color-${k}`}
                    label={k}
                    value={resolved[`--bl-color-${k}`]}
                  />
                ))}
            </div>
          </Block>
        ))}
      </Page>
    )
  },
}

export const Contraste: StoryObj = {
  render: () => {
    const names = [...new Set(contrastPairs.flatMap((p) => [p.fg, p.bg]))].map(
      (k) => `--bl-color-${k}`,
    )
    const resolved = useResolvedColors(names)
    return (
      <Page
        title="Color · contraste"
        intro="Todos los pares que usa la librería se verifican automáticamente contra WCAG 2.2 AA (4.5:1 para texto, 3:1 para bordes de campos y foco). Si un tema no cumple, el build falla."
      >
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--bl-font-size-sm)' }}
        >
          <caption
            style={{ ...styles.muted, textAlign: 'start', paddingBlockEnd: 'var(--bl-space-3)' }}
          >
            Pares de contraste del tema activo
          </caption>
          <thead>
            <tr
              style={{
                textAlign: 'start',
                borderBlockEnd: '1px solid var(--bl-color-border-strong)',
              }}
            >
              {['Muestra', 'Uso', 'Tokens', 'Ratio'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  style={{ textAlign: 'start', padding: 'var(--bl-space-2)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contrastPairs.map((pair) => (
              <tr
                key={`${pair.fg}-${pair.bg}`}
                style={{ borderBlockEnd: '1px solid var(--bl-color-border)' }}
              >
                <td style={{ padding: 'var(--bl-space-2)' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: 'var(--bl-space-1) var(--bl-space-3)',
                      borderRadius: 'var(--bl-radius-md)',
                      background: `var(--bl-color-${pair.bg})`,
                      color: `var(--bl-color-${pair.fg})`,
                      border:
                        pair.fg.startsWith('border') || pair.fg === 'focus-ring'
                          ? `2px solid var(--bl-color-${pair.fg})`
                          : undefined,
                      fontWeight: 600,
                    }}
                  >
                    Aa
                  </span>
                </td>
                <td style={{ padding: 'var(--bl-space-2)' }}>{pair.usage}</td>
                <td style={{ padding: 'var(--bl-space-2)', ...styles.mono }}>
                  {pair.fg} / {pair.bg}
                </td>
                <td style={{ padding: 'var(--bl-space-2)' }}>
                  <ContrastBadge
                    fg={resolved[`--bl-color-${pair.fg}`]}
                    bg={resolved[`--bl-color-${pair.bg}`]}
                    min={pair.min}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
    )
  },
}

import { container, radius, section, shadow, space, zIndex } from '@betterlibs/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Page, styles } from './helpers'

const meta: Meta = { title: 'Fundamentos/Espaciado y forma' }
export default meta

export const Espaciado: StoryObj = {
  render: () => (
    <Page
      title="Espaciado"
      intro="Escala en base 4px. Usa pasos pequeños (1–4) dentro de componentes, medianos (6–12) entre grupos y los tokens de sección para separar bloques de página."
    >
      <Block title="Escala">
        <div style={{ display: 'grid', gap: 'var(--bl-space-2)' }}>
          {Object.entries(space).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'grid',
                gridTemplateColumns: '9rem 5rem 1fr',
                alignItems: 'center',
                gap: 'var(--bl-space-4)',
              }}
            >
              <code style={styles.mono}>--bl-space-{key}</code>
              <code style={{ ...styles.mono, color: 'var(--bl-color-text-muted)' }}>{value}</code>
              <div
                style={{
                  width: value,
                  height: 'var(--bl-space-4)',
                  background: 'var(--bl-color-accent)',
                  borderRadius: 'var(--bl-radius-sm)',
                }}
              />
            </div>
          ))}
        </div>
      </Block>
      <Block
        title="Secciones y contenedores"
        description="Valores fluidos para el ritmo vertical de la página y anchos máximos de contenido."
      >
        <ul
          style={{
            display: 'grid',
            gap: 'var(--bl-space-2)',
            paddingInlineStart: 'var(--bl-space-5)',
          }}
        >
          {Object.entries({
            ...Object.fromEntries(Object.entries(section).map(([k, v]) => [`section-${k}`, v])),
            ...Object.fromEntries(Object.entries(container).map(([k, v]) => [`container-${k}`, v])),
          }).map(([k, v]) => (
            <li key={k}>
              <code style={styles.mono}>--bl-{k}</code> <span style={styles.muted}>{v}</span>
            </li>
          ))}
        </ul>
      </Block>
    </Page>
  ),
}

export const RadiosYSombras: StoryObj = {
  name: 'Radios y sombras',
  render: () => (
    <Page
      title="Radios y sombras"
      intro="Cambia el redondeo global con createTheme({ radius: 'sharp' | 'soft' | 'round' }). Las sombras se oscurecen automáticamente en modo oscuro."
    >
      <Block title="Radios">
        <div style={styles.grid('8rem')}>
          {Object.keys(radius).map((key) => (
            <div key={key} style={{ display: 'grid', gap: 'var(--bl-space-2)' }}>
              <div
                style={{
                  height: '5rem',
                  background: 'var(--bl-color-accent-subtle)',
                  border: '2px solid var(--bl-color-accent)',
                  borderRadius: `var(--bl-radius-${key})`,
                }}
              />
              <code style={styles.mono}>--bl-radius-{key}</code>
            </div>
          ))}
        </div>
      </Block>
      <Block
        title="Sombras"
        description="Úsalas con moderación: indican elevación (menús, diálogos), no decoración."
      >
        <div
          style={{
            ...styles.grid('10rem'),
            padding: 'var(--bl-space-4)',
            background: 'var(--bl-color-bg-subtle)',
            borderRadius: 'var(--bl-radius-lg)',
          }}
        >
          {Object.keys(shadow).map((key) => (
            <div
              key={key}
              style={{
                display: 'grid',
                placeItems: 'center',
                height: '6rem',
                background: 'var(--bl-color-surface-raised)',
                borderRadius: 'var(--bl-radius-lg)',
                boxShadow: `var(--bl-shadow-${key})`,
              }}
            >
              <code style={styles.mono}>--bl-shadow-{key}</code>
            </div>
          ))}
        </div>
      </Block>
      <Block
        title="Capas (z-index)"
        description="Orden fijo de apilado para que menús, diálogos, toasts y tooltips nunca se tapen entre sí."
      >
        <ol
          style={{
            display: 'grid',
            gap: 'var(--bl-space-1)',
            paddingInlineStart: 'var(--bl-space-5)',
          }}
        >
          {Object.entries(zIndex).map(([k, v]) => (
            <li key={k}>
              <code style={styles.mono}>--bl-z-{k}</code> <span style={styles.muted}>{v}</span>
            </li>
          ))}
        </ol>
      </Block>
    </Page>
  ),
}

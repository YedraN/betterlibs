import { font } from '@betterlibs/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Block, Page, styles } from './helpers'

const meta: Meta = { title: 'Fundamentos/Tipografía' }
export default meta

const sizes = Object.keys(font.size).reverse()

export const Escala: StoryObj = {
  render: () => (
    <Page
      title="Tipografía"
      intro="Escala fluida: los tamaños grandes crecen suavemente entre móvil (360px) y escritorio (1280px) con clamp(), sin saltos entre breakpoints. Usa rem, así que respeta el zoom del usuario."
    >
      <Block
        title="Tamaños"
        description="Redimensiona la ventana para ver cómo se adaptan los titulares."
      >
        <div style={{ display: 'grid', gap: 'var(--bl-space-5)' }}>
          {sizes.map((size) => (
            <div
              key={size}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(6rem, 10rem) 1fr',
                gap: 'var(--bl-space-4)',
                alignItems: 'baseline',
              }}
            >
              <code style={{ ...styles.mono, color: 'var(--bl-color-text-muted)' }}>
                --bl-font-size-{size}
              </code>
              <span
                style={{
                  fontSize: `var(--bl-font-size-${size})`,
                  lineHeight: 'var(--bl-leading-snug)',
                  letterSpacing: ['4xl', '5xl', '6xl'].includes(size)
                    ? 'var(--bl-tracking-tighter)'
                    : undefined,
                  fontFamily: 'var(--bl-font-family-display)',
                  fontWeight: 600,
                }}
              >
                Soluciones para tu empresa
              </span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Pesos">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--bl-space-8)' }}>
          {Object.entries(font.weight).map(([name, weight]) => (
            <div key={name} style={{ display: 'grid', gap: 'var(--bl-space-1)' }}>
              <span style={{ fontSize: 'var(--bl-font-size-2xl)', fontWeight: Number(weight) }}>
                Aa
              </span>
              <code style={styles.mono}>
                {name} · {weight}
              </code>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="Texto de lectura"
        description="Limita el ancho a ~65 caracteres (--bl-container-prose) y usa interlineado relajado en párrafos largos."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--bl-space-4)',
            maxWidth: 'var(--bl-container-prose)',
          }}
        >
          <h2 style={{ fontSize: 'var(--bl-font-size-3xl)' }}>
            Acompañamos a empresas que quieren crecer
          </h2>
          <p
            style={{
              fontSize: 'var(--bl-font-size-lg)',
              lineHeight: 'var(--bl-leading-relaxed)',
              color: 'var(--bl-color-text-muted)',
            }}
          >
            Más de 20 años ayudando a organizaciones a transformar sus procesos, con equipos
            cercanos y resultados medibles desde el primer trimestre.
          </p>
          <p style={{ lineHeight: 'var(--bl-leading-relaxed)' }}>
            Un buen texto corporativo va al grano: explica qué haces, para quién y por qué debería
            importarle. Los párrafos cortos y los titulares claros ayudan a que la página se escanee
            en segundos. Si necesitas destacar algo, <a href="#enlace">usa un enlace descriptivo</a>{' '}
            en lugar de «haz clic aquí».
          </p>
        </div>
      </Block>

      <Block title="Familias">
        <div style={{ display: 'grid', gap: 'var(--bl-space-3)' }}>
          {Object.keys(font.family).map((family) => (
            <div
              key={family}
              style={{
                fontFamily: `var(--bl-font-family-${family})`,
                fontSize: 'var(--bl-font-size-xl)',
              }}
            >
              {family} — La calidad está en los detalles 0123456789
            </div>
          ))}
        </div>
      </Block>
    </Page>
  ),
}

import { motion } from '@betterlibs/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Block, Page, styles } from './helpers'

const meta: Meta = { title: 'Fundamentos/Movimiento' }
export default meta

function Demo() {
  const [on, setOn] = useState(false)
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-6)' }}>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        style={{
          justifySelf: 'start',
          minHeight: 'var(--bl-control-height-md)',
          paddingInline: 'var(--bl-space-5)',
          border: 0,
          borderRadius: 'var(--bl-radius-md)',
          background: 'var(--bl-color-accent)',
          color: 'var(--bl-color-on-accent)',
          fontWeight: 600,
        }}
      >
        {on ? 'Volver' : 'Reproducir'}
      </button>
      {Object.keys(motion.ease).map((ease) =>
        Object.keys(motion.duration)
          .filter((d) => d !== 'instant')
          .map((duration) => (
            <div
              key={`${ease}-${duration}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '14rem 1fr',
                gap: 'var(--bl-space-4)',
                alignItems: 'center',
              }}
            >
              <code style={styles.mono}>
                {ease} · {duration}
              </code>
              <div
                style={{
                  background: 'var(--bl-color-bg-muted)',
                  borderRadius: 'var(--bl-radius-full)',
                  padding: '4px',
                }}
              >
                <div
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: 'var(--bl-radius-full)',
                    background: 'var(--bl-color-accent)',
                    marginInlineStart: on ? 'calc(100% - 1.5rem)' : 0,
                    transition: `margin-inline-start var(--bl-duration-${duration}) var(--bl-ease-${ease})`,
                  }}
                />
              </div>
            </div>
          )),
      )}
    </div>
  )
}

export const DuracionesYCurvas: StoryObj = {
  name: 'Duraciones y curvas',
  render: () => (
    <Page
      title="Movimiento"
      intro="El movimiento explica cambios (qué aparece, de dónde viene), nunca decora. Duraciones cortas: fast para hover, normal para la mayoría de transiciones, slow para overlays. Todo se desactiva con prefers-reduced-motion."
    >
      <Block
        title="Pruébalo"
        description="enter para elementos que aparecen, exit para los que se van, standard para cambios de estado."
      >
        <Demo />
      </Block>
    </Page>
  ),
}

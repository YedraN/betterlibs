'use client'

import { AnimatedNumber, Reveal, Stagger, TextReveal } from '@betterlibs/motion'
import { Card } from '@betterlibs/react'

export function RevealExample({ replayKey = 0 }: { replayKey?: number }) {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <h3 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}>
        <TextReveal lines={['Una idea clara.', 'Un ritmo propio.']} replayKey={replayKey} />
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,160px),1fr))',
          gap: 12,
        }}
      >
        <Stagger>
          {['Identidad', 'Composición'].map((title) => (
            <Reveal key={title} replayKey={replayKey}>
              <Card padding="4">
                <strong>{title}</strong>
                <p>Visible desde el servidor.</p>
              </Card>
            </Reveal>
          ))}
        </Stagger>
      </div>
      <p>
        <AnimatedNumber value={24} startValue={0} replayKey={replayKey} /> piezas de tu próxima
        colección
      </p>
    </div>
  )
}

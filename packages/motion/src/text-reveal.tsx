'use client'

import type { ComponentPropsWithRef, CSSProperties } from 'react'
import { Reveal, Stagger } from './primitives'

const hidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
}

export type TextRevealProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Líneas editoriales explícitas. Cada una puede envolver texto en pantallas estrechas. */
  lines: string[]
  interval?: number
  once?: boolean
  replayKey?: string | number
}

/** Texto visible en SSR; una sola copia accesible. No mide ni divide nodos interactivos. */
export function TextReveal({ lines, interval, once, replayKey, style, ...props }: TextRevealProps) {
  return (
    <span {...props} style={{ display: 'block', ...style }} data-bl-text-reveal="">
      <span style={hidden}>{lines.join(' ')}</span>
      <span aria-hidden="true">
        <Stagger interval={interval}>
          {lines.map((line, index) => (
            <Reveal
              as="span"
              // biome-ignore lint/suspicious/noArrayIndexKey: explicit presentation lines, no state.
              key={index}
              once={once}
              replayKey={replayKey}
              style={{ display: 'block' }}
            >
              {line}
            </Reveal>
          ))}
        </Stagger>
      </span>
    </span>
  )
}

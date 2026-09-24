import * as icons from '@betterlibs/icons'
import {
  color,
  container,
  contrastPairs,
  dark,
  font,
  light,
  motion,
  radius,
  resolveColor,
  shadow,
  space,
  contrast as wcagContrast,
  zIndex,
} from '@betterlibs/tokens'
import type { ReactNode } from 'react'
import { Preview } from './preview'

const mono = 'font-mono text-xs'

function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-fd-muted text-left">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  )
}

/** Escalas de color primitivas. */
export function ColorScales() {
  const scales = ['brand', 'neutral', 'success', 'warning', 'danger', 'info'] as const
  return (
    <div className="not-prose my-6 grid gap-6">
      {scales.map((name) => (
        <div key={name} className="grid gap-2">
          <p className="text-sm font-medium">{name}</p>
          <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-11">
            {Object.entries(color[name]).map(([step, hex]) => (
              <div key={step} className="grid gap-1">
                <div className="h-12 rounded-md border" style={{ background: hex }} />
                <span className={mono}>{step}</span>
                <span className={`${mono} text-fd-muted-foreground`}>{hex}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Tokens semánticos con sus valores en claro y oscuro. */
export function SemanticColors({ filter }: { filter?: string }) {
  const keys = Object.keys(light).filter((k) => !filter || new RegExp(filter).test(k))
  const swatch = (ref: string) => {
    const value = resolveColor(ref)
    return (
      <span className="flex items-center gap-2">
        <span
          className="inline-block size-5 shrink-0 rounded border"
          style={{ background: value }}
        />
        <code className={mono}>{ref}</code>
      </span>
    )
  }
  return (
    <Table head={['Token', 'Claro', 'Oscuro']}>
      {keys.map((k) => (
        <tr key={k}>
          <td className="px-4 py-2">
            <code className={mono}>--bl-color-{k}</code>
          </td>
          <td className="px-4 py-2">{swatch(light[k] ?? '')}</td>
          <td className="px-4 py-2">{swatch(dark[k] ?? '')}</td>
        </tr>
      ))}
    </Table>
  )
}

/** Informe de contraste WCAG del tema por defecto. */
export function ContrastReport() {
  const ratio = (mode: typeof light, fg: string, bg: string) =>
    wcagContrast(resolveColor(mode[fg] ?? ''), resolveColor(mode[bg] ?? ''))
  return (
    <Table head={['Uso', 'Tokens', 'Mínimo', 'Claro', 'Oscuro']}>
      {contrastPairs.map((p) => (
        <tr key={`${p.fg}-${p.bg}`}>
          <td className="px-4 py-2">{p.usage}</td>
          <td className="px-4 py-2">
            <code className={mono}>
              {p.fg} / {p.bg}
            </code>
          </td>
          <td className="px-4 py-2">{p.min}:1</td>
          {[light, dark].map((mode, i) => {
            const r = ratio(mode, p.fg, p.bg)
            return (
              <td key={i === 0 ? 'l' : 'd'} className="px-4 py-2">
                {r >= p.min ? '✓' : '✕'} {r.toFixed(2)}:1
              </td>
            )
          })}
        </tr>
      ))}
    </Table>
  )
}

export function TypeScale() {
  return (
    <Preview>
      <div className="grid gap-4">
        {Object.entries(font.size)
          .reverse()
          .map(([name, value]) => (
            <div key={name} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-baseline">
              <code className={mono} style={{ color: 'var(--bl-color-text-muted)' }}>
                font-size-{name}
              </code>
              <span
                style={{
                  fontSize: `var(--bl-font-size-${name})`,
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
                title={value}
              >
                Soluciones para tu empresa
              </span>
            </div>
          ))}
      </div>
    </Preview>
  )
}

export function TokenTable({
  group,
}: {
  group:
    | 'space'
    | 'radius'
    | 'shadow'
    | 'duration'
    | 'ease'
    | 'z'
    | 'container'
    | 'weight'
    | 'leading'
}) {
  const sources: Record<typeof group, [string, Record<string, string>]> = {
    space: ['space', space],
    radius: ['radius', radius],
    shadow: ['shadow', shadow],
    duration: ['duration', motion.duration],
    ease: ['ease', motion.ease],
    z: ['z', zIndex],
    container: ['container', container],
    weight: ['font-weight', font.weight],
    leading: ['leading', font.leading],
  }
  const [prefix, values] = sources[group]
  return (
    <Table head={['Token', 'Valor', 'Muestra']}>
      {Object.entries(values).map(([key, value]) => (
        <tr key={key}>
          <td className="px-4 py-2">
            <code className={mono}>
              --bl-{prefix}-{key}
            </code>
          </td>
          <td className="px-4 py-2">
            <code className={`${mono} text-fd-muted-foreground`}>{value}</code>
          </td>
          <td className="px-4 py-2">
            {group === 'space' && (
              <span className="block h-3 rounded-sm bg-fd-primary" style={{ width: value }} />
            )}
            {group === 'radius' && (
              <span
                className="block size-10 border-2 border-fd-primary bg-fd-accent"
                style={{ borderRadius: value }}
              />
            )}
            {group === 'shadow' && (
              <span
                className="block h-10 w-20 rounded-lg bg-fd-card"
                style={{ boxShadow: value }}
              />
            )}
          </td>
        </tr>
      ))}
    </Table>
  )
}

/** Galería con todos los iconos del paquete. */
export function IconGallery() {
  const entries = Object.entries(icons).filter(
    ([name]) => name.endsWith('Icon') && name !== 'createIcon',
  ) as [string, (props: { size?: number }) => ReactNode][]
  return (
    <Preview>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {entries.map(([name, Icon]) => (
          <li
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg p-3 text-center"
            style={{ border: '1px solid var(--bl-color-border)' }}
          >
            <Icon size={24} />
            <code className="text-[0.7rem] break-all">{name}</code>
          </li>
        ))}
      </ul>
    </Preview>
  )
}

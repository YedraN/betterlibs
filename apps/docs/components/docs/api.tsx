import { TypeTable } from 'fumadocs-ui/components/type-table'
import type { ReactNode } from 'react'
import api from '@/generated/api.json'

type PropDoc = {
  name: string
  type: string
  expanded?: string
  required: boolean
  description?: string
  default?: string
  source: string
}

type CssDoc = { classes: string[]; tokens: string[] }

const props = api.props as Record<string, PropDoc[]>
const css = api.css as Record<string, CssDoc>

/** Convierte el `código` de los comentarios JSDoc en <code>. */
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: texto estático
      <code key={index}>{part.slice(1, -1)}</code>
    ) : (
      part
    ),
  )
}

/**
 * Tabla de props generada desde los tipos de la librería (solo las props propias; las del
 * elemento HTML se pasan tal cual). Falla en el build si el tipo no existe.
 */
export function PropsTable({
  name,
  omit = [],
  hideBlockBase = false,
}: {
  name: string
  omit?: string[]
  /** Oculta las props comunes de los bloques (`BlockBaseProps`). */
  hideBlockBase?: boolean
}) {
  const list = props[name]
  if (!list) throw new Error(`PropsTable: no existe el tipo "${name}" en la API generada`)
  const type = Object.fromEntries(
    list
      .filter((prop) => !omit.includes(prop.name))
      .filter((prop) => !(hideBlockBase && prop.source === 'blocks/shared.tsx'))
      .map((prop) => [
        prop.name,
        {
          type: <code>{prop.type}</code>,
          typeDescription: prop.expanded ? <code>{prop.expanded}</code> : undefined,
          description: prop.description ? inline(prop.description) : undefined,
          default: prop.default ? <code>{prop.default}</code> : undefined,
          required: prop.required,
        },
      ]),
  )
  return <TypeTable type={type} />
}

/**
 * Clases públicas de un CSS Module (para sobrescribir estilos) y tokens que usa (para
 * personalizarlo desde el tema). Falla en el build si el módulo no existe.
 */
export function CssReference({ module }: { module: string }) {
  const doc = css[module]
  if (!doc) throw new Error(`CssReference: no existe el módulo CSS "${module}"`)
  return (
    <div className="not-prose my-6 grid gap-4 text-sm">
      <div>
        <p className="mb-2 font-semibold">Clases</p>
        <ul className="flex flex-wrap gap-2">
          {doc.classes.map((name) => (
            <li key={name}>
              <code className="rounded bg-fd-muted px-1.5 py-0.5">.{name}</code>
            </li>
          ))}
        </ul>
      </div>
      <details className="rounded-lg border p-3">
        <summary className="cursor-pointer font-semibold">
          Tokens que usa ({doc.tokens.length})
        </summary>
        <ul className="mt-3 flex flex-wrap gap-2">
          {doc.tokens.map((token) => (
            <li key={token}>
              <code className="rounded bg-fd-muted px-1.5 py-0.5">{token}</code>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

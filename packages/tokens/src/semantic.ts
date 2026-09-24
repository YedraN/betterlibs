/**
 * Tokens semánticos: describen la INTENCIÓN (fondo, texto, acento…) y no el valor.
 * Son los únicos tokens de color que deben usar los componentes.
 *
 * Cada valor es una referencia a un primitivo (`'neutral.900'`) o un color literal.
 */
import { color } from './primitives.ts'

export type ColorRef = string
export type SemanticColors = Record<string, ColorRef>

const statuses = ['success', 'warning', 'danger', 'info'] as const

function statusTokens(mode: 'light' | 'dark'): SemanticColors {
  const tokens: SemanticColors = {}
  for (const s of statuses) {
    if (mode === 'light') {
      tokens[`${s}-bg`] = `${s}.50`
      tokens[`${s}-border`] = `${s}.300`
      tokens[`${s}-text`] = `${s}.${s === 'warning' ? 800 : 700}`
      tokens[`${s}-solid`] = `${s}.700`
      tokens[`on-${s}`] = 'white'
    } else {
      tokens[`${s}-bg`] = `${s}.900`
      tokens[`${s}-border`] = `${s}.700`
      tokens[`${s}-text`] = `${s}.300`
      tokens[`${s}-solid`] = `${s}.500`
      tokens[`on-${s}`] = 'neutral.950'
    }
  }
  return tokens
}

export const light: SemanticColors = {
  bg: 'white',
  'bg-subtle': 'neutral.50',
  'bg-muted': 'neutral.100',
  'bg-inverse': 'neutral.900',
  surface: 'white',
  'surface-raised': 'white',
  overlay: 'rgb(12 16 23 / 0.6)',

  text: 'neutral.900',
  'text-muted': 'neutral.600',
  'text-subtle': 'neutral.500',
  'text-inverse': 'white',
  'text-disabled': 'neutral.400',

  border: 'neutral.200',
  'border-strong': 'neutral.300',
  /** Bordes de campos de formulario: ≥ 3:1 sobre el fondo (WCAG 1.4.11). */
  'border-input': 'neutral.500',

  accent: 'brand.600',
  'accent-hover': 'brand.700',
  'accent-active': 'brand.800',
  'on-accent': 'white',
  'accent-subtle': 'brand.50',
  'accent-subtle-hover': 'brand.100',
  /** Enlaces y texto de acento sobre fondos claros. */
  'accent-text': 'brand.700',
  'focus-ring': 'brand.500',

  ...statusTokens('light'),
}

export const dark: SemanticColors = {
  bg: 'neutral.950',
  'bg-subtle': 'neutral.900',
  'bg-muted': 'neutral.800',
  'bg-inverse': 'neutral.50',
  surface: 'neutral.900',
  'surface-raised': 'neutral.800',
  overlay: 'rgb(0 0 0 / 0.7)',

  text: 'neutral.50',
  'text-muted': 'neutral.300',
  'text-subtle': 'neutral.400',
  'text-inverse': 'neutral.950',
  'text-disabled': 'neutral.600',

  border: 'neutral.800',
  'border-strong': 'neutral.700',
  'border-input': 'neutral.500',

  accent: 'brand.400',
  'accent-hover': 'brand.300',
  'accent-active': 'brand.200',
  'on-accent': 'neutral.950',
  'accent-subtle': 'brand.950',
  'accent-subtle-hover': 'brand.900',
  'accent-text': 'brand.300',
  'focus-ring': 'brand.400',

  ...statusTokens('dark'),
}

/** Pares que deben cumplir contraste. `min` es el ratio WCAG exigido. */
export type ContrastPair = { fg: string; bg: string; min: number; usage: string }

export const contrastPairs: ContrastPair[] = [
  { fg: 'text', bg: 'bg', min: 4.5, usage: 'Texto principal' },
  { fg: 'text', bg: 'surface-raised', min: 4.5, usage: 'Texto en tarjetas elevadas' },
  { fg: 'text-muted', bg: 'bg', min: 4.5, usage: 'Texto secundario' },
  { fg: 'text-muted', bg: 'bg-subtle', min: 4.5, usage: 'Texto secundario en fondo sutil' },
  { fg: 'text-subtle', bg: 'bg', min: 4.5, usage: 'Texto terciario' },
  { fg: 'text-inverse', bg: 'bg-inverse', min: 4.5, usage: 'Texto en bloques invertidos' },
  { fg: 'border-input', bg: 'bg', min: 3, usage: 'Borde de campos de formulario' },
  { fg: 'on-accent', bg: 'accent', min: 4.5, usage: 'Texto en botón primario' },
  { fg: 'on-accent', bg: 'accent-hover', min: 4.5, usage: 'Texto en botón primario (hover)' },
  { fg: 'accent-text', bg: 'bg', min: 4.5, usage: 'Enlaces' },
  { fg: 'accent-text', bg: 'bg-subtle', min: 4.5, usage: 'Enlaces en fondo sutil' },
  {
    fg: 'accent-text',
    bg: 'accent-subtle',
    min: 4.5,
    usage: 'Texto de acento en fondo de acento suave',
  },
  { fg: 'focus-ring', bg: 'bg', min: 3, usage: 'Anillo de foco' },
  ...statuses.flatMap((s) => [
    { fg: `${s}-text`, bg: `${s}-bg`, min: 4.5, usage: `Mensaje ${s}` },
    { fg: `on-${s}`, bg: `${s}-solid`, min: 4.5, usage: `Insignia ${s}` },
  ]),
]

type Palette = typeof color

/** Resuelve una referencia (`'brand.600'`, `'white'`) a su color hex real. */
export function resolveColor(ref: ColorRef, palette: Palette = color): string {
  if (ref.startsWith('#') || ref.startsWith('rgb')) return ref
  const [group, step] = ref.split('.') as [keyof Palette, string | undefined]
  const value =
    step === undefined ? palette[group] : (palette[group] as Record<string, string>)[step]
  if (typeof value !== 'string') throw new Error(`Referencia de color desconocida: "${ref}"`)
  return value
}

/** Convierte una referencia en su valor CSS (`var(--bl-color-brand-600)`). */
export function refToCss(ref: ColorRef): string {
  if (ref.startsWith('#') || ref.startsWith('rgb')) return ref
  return `var(--bl-color-${ref.replace('.', '-')})`
}

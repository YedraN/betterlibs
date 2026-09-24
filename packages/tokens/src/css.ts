import { contrast } from './color.ts'
import {
  breakpoint,
  color,
  container,
  control,
  focus,
  font,
  motion,
  radius,
  section,
  shadow,
  shadowDark,
  space,
  zIndex,
} from './primitives.ts'
import {
  type ContrastPair,
  contrastPairs,
  dark,
  light,
  refToCss,
  resolveColor,
  type SemanticColors,
} from './semantic.ts'

export const PREFIX = '--bl'

export type CssVars = Record<string, string>

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

function flatten(group: string, values: Record<string, string | number>, suffix = ''): CssVars {
  const vars: CssVars = {}
  for (const [key, value] of Object.entries(values)) {
    vars[`${PREFIX}-${group}-${kebab(key)}`] = `${value}${suffix}`
  }
  return vars
}

export function colorVars(palette: typeof color = color): CssVars {
  const vars: CssVars = {
    [`${PREFIX}-color-white`]: palette.white,
    [`${PREFIX}-color-black`]: palette.black,
  }
  for (const name of ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const) {
    Object.assign(vars, flatten(`color-${name}`, palette[name]))
  }
  return vars
}

export function radiusVars(values: typeof radius = radius): CssVars {
  return flatten('radius', values)
}

/** Todos los tokens primitivos como variables CSS (independientes del tema). */
export function primitiveVars(): CssVars {
  return {
    ...colorVars(),
    ...flatten('font-family', font.family),
    ...flatten('font-size', font.size),
    ...flatten('font-weight', font.weight),
    ...flatten('leading', font.leading),
    ...flatten('tracking', font.tracking),
    ...flatten('space', space),
    ...flatten('section', section),
    ...radiusVars(),
    ...flatten('duration', motion.duration),
    ...flatten('ease', motion.ease),
    ...flatten('breakpoint', breakpoint, 'px'),
    ...flatten('container', container),
    ...flatten('z', zIndex),
    ...flatten('control-height', control.height),
    ...flatten('focus', focus),
  }
}

/** Tokens semánticos de un modo (claro u oscuro) como variables CSS. */
export function semanticVars(mode: 'light' | 'dark', semantic?: SemanticColors): CssVars {
  const map = semantic ?? (mode === 'light' ? light : dark)
  return {
    'color-scheme': mode,
    ...Object.fromEntries(
      Object.entries(map).map(([key, ref]) => [`${PREFIX}-color-${key}`, refToCss(ref)]),
    ),
    ...flatten('shadow', mode === 'light' ? shadow : shadowDark),
  }
}

export function cssBlock(selector: string, vars: CssVars, indent = ''): string {
  const body = Object.entries(vars)
    .map(([k, v]) => `${indent}  ${k}: ${v};`)
    .join('\n')
  return `${indent}${selector} {\n${body}\n${indent}}`
}

/**
 * Selectores para el modo oscuro de un ámbito:
 * - explícito con `data-theme="dark"`
 * - automático con `prefers-color-scheme: dark`, salvo que se fuerce `data-theme="light"`
 */
export function darkSelectors(scope = ':root') {
  if (scope === ':root') {
    return {
      explicit: ':root[data-theme="dark"], [data-theme="dark"]',
      auto: ':root:not([data-theme="light"])',
      nestedLight: '[data-theme="light"]',
    }
  }
  return {
    explicit: `[data-theme="dark"] ${scope}, ${scope}[data-theme="dark"], ${scope} [data-theme="dark"]`,
    auto: `:root:not([data-theme="light"]) ${scope}:not([data-theme="light"])`,
    nestedLight: `${scope}[data-theme="light"], ${scope} [data-theme="light"]`,
  }
}

/**
 * CSS de un tema completo. `data-theme="dark" | "light"` funciona en `<html>` y también
 * en cualquier elemento anidado (p. ej. una sección oscura dentro de una página clara).
 *
 * @param nestedLightVars variables para re-aplicar el modo claro en elementos anidados
 * (por defecto, las mismas que `lightVars`).
 */
export function themeCss(
  scope: string,
  lightVars: CssVars,
  darkVars: CssVars,
  nestedLightVars: CssVars = lightVars,
): string {
  const { explicit, auto, nestedLight } = darkSelectors(scope)
  return [
    cssBlock(scope, lightVars),
    `@media (prefers-color-scheme: dark) {\n${cssBlock(auto, darkVars, '  ')}\n}`,
    cssBlock(explicit, darkVars),
    cssBlock(nestedLight, nestedLightVars),
  ].join('\n\n')
}

export type ContrastResult = ContrastPair & {
  mode: 'light' | 'dark'
  ratio: number
  pass: boolean
}

/** Comprueba los pares de contraste obligatorios de un tema. */
export function checkContrast(
  mode: 'light' | 'dark',
  semantic: SemanticColors,
  palette: typeof color = color,
): ContrastResult[] {
  return contrastPairs.map((pair) => {
    const fg = resolveColor(semantic[pair.fg] ?? '', palette)
    const bg = resolveColor(semantic[pair.bg] ?? '', palette)
    const ratio = Math.round(contrast(fg, bg) * 100) / 100
    return { ...pair, mode, ratio, pass: ratio >= pair.min }
  })
}

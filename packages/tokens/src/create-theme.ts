import { contrast, generateScale } from './color.ts'
import {
  type ContrastResult,
  type CssVars,
  checkContrast,
  colorVars,
  PREFIX,
  radiusVars,
  semanticVars,
  themeCss,
} from './css.ts'
import {
  type ColorScale,
  type ColorStep,
  color,
  colorSteps,
  type RadiusPreset,
  radiusPresets,
} from './primitives.ts'
import { dark, light, type SemanticColors } from './semantic.ts'

export type ThemeOptions = {
  /** Color principal de la marca en hex (`#0a5cff`). Genera toda la escala `brand`. */
  brand?: string
  /** Redondeo general de la interfaz. Por defecto `soft`. */
  radius?: RadiusPreset
  /** Familia tipográfica para textos. Recuerda cargar la fuente (p. ej. con `next/font`). */
  fontSans?: string
  /** Familia tipográfica para titulares. Por defecto, la misma que `fontSans`. */
  fontDisplay?: string
  /** Familia monoespaciada para código. */
  fontMono?: string
  /**
   * Selector donde se aplica el tema. Por defecto `:root`.
   * Usa otro (`[data-brand="acme"]`) para convivir con varias marcas en la misma página.
   */
  selector?: string
  /**
   * Si es `true` (por defecto), lanza `ThemeContrastError` cuando algún par de colores
   * no cumple WCAG AA. Con `false`, devuelve el informe para que decidas tú.
   */
  strict?: boolean
}

export type Theme = {
  /** CSS listo para inyectar en una hoja de estilos o en un `<style>`. */
  css: string
  /** Escala de marca generada. */
  brand: ColorScale
  /** Tokens semánticos resultantes por modo. */
  semantic: { light: SemanticColors; dark: SemanticColors }
  /** Informe de contraste de todos los pares obligatorios en ambos modos. */
  contrast: ContrastResult[]
  /** `true` si todos los pares cumplen WCAG AA. */
  accessible: boolean
}

export class ThemeContrastError extends Error {
  readonly failures: ContrastResult[]
  constructor(failures: ContrastResult[]) {
    super(
      `El tema no cumple el contraste mínimo WCAG AA:\n${failures
        .map(
          (f) =>
            `  · [${f.mode}] ${f.usage} (${f.fg} sobre ${f.bg}): ${f.ratio}:1, mínimo ${f.min}:1`,
        )
        .join('\n')}\nPrueba con un color de marca más oscuro o usa { strict: false }.`,
    )
    this.name = 'ThemeContrastError'
    this.failures = failures
  }
}

const neighbour = (step: ColorStep, offset: number): ColorStep | undefined =>
  colorSteps[colorSteps.indexOf(step) + offset]

const byDistance = (anchor: ColorStep, candidates: ColorStep[]) =>
  [...candidates].sort(
    (a, b) =>
      Math.abs(colorSteps.indexOf(a) - colorSteps.indexOf(anchor)) -
      Math.abs(colorSteps.indexOf(b) - colorSteps.indexOf(anchor)),
  )

/** Elige el texto (claro u oscuro) que mejor contraste da sobre todos los fondos indicados. */
function pickOnColor(backgrounds: string[], preferLight: boolean): string | undefined {
  const options = preferLight ? ['white', 'neutral.950'] : ['neutral.950', 'white']
  return options.find((ref) => {
    const hex = ref === 'white' ? color.white : color.neutral[950]
    return backgrounds.every((bg) => contrast(hex, bg) >= 4.5)
  })
}

function firstPassing(
  scale: ColorScale,
  candidates: ColorStep[],
  backgrounds: string[],
  min: number,
): ColorStep | undefined {
  return candidates.find((step) => backgrounds.every((bg) => contrast(scale[step], bg) >= min))
}

function accentTokens(scale: ColorScale, anchor: ColorStep, mode: 'light' | 'dark') {
  const tokens: SemanticColors = {}
  const direction = mode === 'light' ? 1 : -1
  const candidates: ColorStep[] =
    mode === 'light'
      ? byDistance(anchor, [300, 400, 500, 600, 700, 800])
      : byDistance(anchor, [200, 300, 400, 500])

  for (const step of candidates) {
    const hover = neighbour(step, direction)
    const active = neighbour(step, direction * 2)
    if (!hover || !active) continue
    const on = pickOnColor([scale[step], scale[hover]], mode === 'light')
    if (!on) continue
    Object.assign(tokens, {
      accent: `brand.${step}`,
      'accent-hover': `brand.${hover}`,
      'accent-active': `brand.${active}`,
      'on-accent': on,
    })
    break
  }

  const bgs =
    mode === 'light'
      ? [color.white, color.neutral[50], scale[50]]
      : [color.neutral[950], color.neutral[900], scale[950]]
  const textStep = firstPassing(
    scale,
    mode === 'light' ? [600, 700, 800, 900] : [300, 200, 100, 50],
    bgs,
    4.5,
  )
  if (textStep) tokens['accent-text'] = `brand.${textStep}`

  const ringStep = firstPassing(
    scale,
    mode === 'light' ? [500, 600, 700] : [400, 300, 200],
    [bgs[0] as string],
    3,
  )
  if (ringStep) tokens['focus-ring'] = `brand.${ringStep}`

  return tokens
}

/**
 * Crea un tema de marca a partir de unas pocas decisiones y valida su accesibilidad.
 *
 * @example
 * const theme = createTheme({ brand: '#0a5cff', radius: 'soft' })
 * // Inyecta theme.css en tu layout o guárdalo en un .css durante el build.
 */
export function createTheme(options: ThemeOptions = {}): Theme {
  const { selector = ':root', strict = true } = options

  let brand = color.brand
  const semantic = { light: { ...light }, dark: { ...dark } }

  if (options.brand) {
    const generated = generateScale(options.brand)
    brand = generated.scale
    Object.assign(semantic.light, accentTokens(brand, generated.anchor, 'light'))
    Object.assign(semantic.dark, accentTokens(brand, generated.anchor, 'dark'))
  }

  const palette = { ...color, brand }
  const report = [
    ...checkContrast('light', semantic.light, palette),
    ...checkContrast('dark', semantic.dark, palette),
  ]
  const failures = report.filter((r) => !r.pass)
  if (strict && failures.length > 0) throw new ThemeContrastError(failures)

  const shared: CssVars = {}
  if (options.brand) {
    for (const [key, value] of Object.entries(colorVars(palette))) {
      if (key.startsWith(`${PREFIX}-color-brand-`)) shared[key] = value
    }
  }
  if (options.radius) Object.assign(shared, radiusVars(radiusPresets[options.radius]))
  if (options.fontSans) {
    shared[`${PREFIX}-font-family-sans`] = options.fontSans
    shared[`${PREFIX}-font-family-display`] = options.fontDisplay ?? options.fontSans
  } else if (options.fontDisplay) {
    shared[`${PREFIX}-font-family-display`] = options.fontDisplay
  }
  if (options.fontMono) shared[`${PREFIX}-font-family-mono`] = options.fontMono

  const css = themeCss(
    selector,
    { ...shared, ...semanticVars('light', semantic.light) },
    semanticVars('dark', semantic.dark),
  )

  return { css, brand, semantic, contrast: report, accessible: failures.length === 0 }
}

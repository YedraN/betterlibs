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
import { dark, light, resolveColor, type SemanticColors } from './semantic.ts'

/** Fundamentos de un estilo; importar un preset permite eliminar los demás del bundle. */
export type ThemePreset = {
  palette: typeof color
  semantic: { light: SemanticColors; dark: SemanticColors }
  font: { sans: string; display: string }
  radius: (typeof radiusPresets)['soft']
  typography: Record<string, string>
  effects?: CssVars
}

export type ThemeOptions = {
  /** Dirección visual. `editorial` combina marfil, carbón y lima; el default se conserva. */
  preset?: ThemePreset
  /** Color principal de la marca en hex (`#0a5cff`). Genera toda la escala `brand`. */
  brand?: string
  /** Redondeo general. Por defecto `soft`, o los radios propios del preset editorial. */
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
  /** Paleta utilizada para resolver las referencias semánticas. */
  palette: typeof color
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
      `Contraste insuficiente (WCAG AA):\n${failures
        .map(
          (f) =>
            `  · [${f.mode}] ${f.usage} (${f.fg} sobre ${f.bg}): ${f.ratio}:1, mínimo ${f.min}:1`,
        )
        .join('\n')}\nUsa otra marca o { strict: false } para revisar el informe.`,
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
function pickOnColor(
  backgrounds: string[],
  preferLight: boolean,
  palette: typeof color,
): string | undefined {
  const options = preferLight ? ['white', 'neutral.950'] : ['neutral.950', 'white']
  return options.find((ref) => {
    const hex = resolveColor(ref, palette)
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

function accentTokens(
  scale: ColorScale,
  anchor: ColorStep,
  mode: 'light' | 'dark',
  semantic: SemanticColors,
  palette: typeof color,
) {
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
    const on = pickOnColor([scale[step], scale[hover], scale[active]], mode === 'light', palette)
    if (!on) continue
    Object.assign(tokens, {
      accent: `brand.${step}`,
      'accent-hover': `brand.${hover}`,
      'accent-active': `brand.${active}`,
      'on-accent': on,
    })
    break
  }

  tokens['accent-subtle'] = mode === 'light' ? 'brand.50' : 'brand.950'
  tokens['accent-subtle-hover'] = mode === 'light' ? 'brand.100' : 'brand.900'
  const bgs = [semantic.bg, semantic['bg-subtle'], tokens['accent-subtle']].map((ref) =>
    resolveColor(ref ?? '', palette),
  )
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
    [resolveColor(semantic.bg ?? '', palette), resolveColor(semantic.surface ?? '', palette)],
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

  const preset = options.preset
  const basePalette = preset?.palette ?? color
  const baseSemantic = preset?.semantic ?? { light, dark }
  let brand = basePalette.brand
  const semantic = { light: { ...baseSemantic.light }, dark: { ...baseSemantic.dark } }
  const palette = { ...basePalette, brand }

  if (options.brand) {
    const generated = generateScale(options.brand)
    brand = generated.scale
    palette.brand = brand
    Object.assign(
      semantic.light,
      accentTokens(brand, generated.anchor, 'light', semantic.light, palette),
    )
    Object.assign(
      semantic.dark,
      accentTokens(brand, generated.anchor, 'dark', semantic.dark, palette),
    )
  }

  const report = [
    ...checkContrast('light', semantic.light, palette),
    ...checkContrast('dark', semantic.dark, palette),
  ]
  const failures = report.filter((r) => !r.pass)
  if (strict && failures.length > 0) throw new ThemeContrastError(failures)

  // Cada tema declara su paleta para validar los mismos colores que pinta, incluso anidado.
  const shared: CssVars = colorVars(palette)
  if (preset) {
    Object.assign(shared, radiusVars(preset.radius), {
      '--bl-font-family-sans': preset.font.sans,
      '--bl-font-family-display': preset.font.display,
      ...Object.fromEntries(
        Object.entries(preset.typography).map(([key, value]) => [`--bl-type-${key}`, value]),
      ),
    })
  }
  if (options.radius) Object.assign(shared, radiusVars(radiusPresets[options.radius]))
  if (options.fontSans) {
    shared[`${PREFIX}-font-family-sans`] = options.fontSans
    shared[`${PREFIX}-font-family-display`] = options.fontDisplay ?? options.fontSans
  } else if (options.fontDisplay) {
    shared[`${PREFIX}-font-family-display`] = options.fontDisplay
  }
  if (options.fontMono) shared[`${PREFIX}-font-family-mono`] = options.fontMono

  const effects = preset?.effects ?? {}
  const lightVars = { ...semanticVars('light', semantic.light), ...effects }
  const darkVars = { ...semanticVars('dark', semantic.dark), ...effects }
  const css = themeCss(selector, { ...shared, ...lightVars }, darkVars, lightVars)

  return { css, brand, palette, semantic, contrast: report, accessible: failures.length === 0 }
}

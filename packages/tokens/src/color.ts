/**
 * Utilidades de color: contraste WCAG y generación de escalas en OKLCH.
 * OKLCH es perceptualmente uniforme, así que los pasos de una escala generada
 * se ven equilibrados sea cual sea el color de marca.
 */
import type { ColorScale, ColorStep } from './primitives.ts'

type RGB = [number, number, number]

export function parseHex(hex: string): RGB {
  let value = hex.trim().replace(/^#/, '')
  if (value.length === 3) value = [...value].map((c) => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(value))
    throw new Error(`Color no válido: "${hex}". Usa formato #rrggbb.`)
  return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16)) as RGB
}

export function toHex([r, g, b]: RGB): string {
  return `#${[r, g, b]
    .map((c) =>
      Math.round(Math.min(255, Math.max(0, c)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

const toLinear = (c: number) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const fromLinear = (v: number) =>
  255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)

/** Luminancia relativa según WCAG 2.x. */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(toLinear) as RGB
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Ratio de contraste WCAG entre dos colores (1 a 21). */
export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (l1 + 0.05) / (l2 + 0.05)
}

export type Oklch = { l: number; c: number; h: number }

export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = parseHex(hex).map(toLinear) as RGB
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const h = (Math.atan2(B, A) * 180) / Math.PI
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h }
}

function oklchToLinear({ l, c, h }: Oklch): RGB {
  const rad = (h * Math.PI) / 180
  const A = c * Math.cos(rad)
  const B = c * Math.sin(rad)
  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]
}

const inGamut = (rgb: RGB) => rgb.every((v) => v >= -0.0001 && v <= 1.0001)

/** Convierte OKLCH a hex reduciendo el croma hasta que el color quepa en sRGB. */
export function oklchToHex(color: Oklch): string {
  let lo = 0
  let hi = color.c
  if (!inGamut(oklchToLinear(color))) {
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2
      if (inGamut(oklchToLinear({ ...color, c: mid }))) lo = mid
      else hi = mid
    }
    hi = lo
  }
  return toHex(oklchToLinear({ ...color, c: hi }).map(fromLinear) as RGB)
}

const stepLightness: Record<ColorStep, number> = {
  50: 0.97,
  100: 0.935,
  200: 0.875,
  300: 0.8,
  400: 0.71,
  500: 0.62,
  600: 0.54,
  700: 0.47,
  800: 0.4,
  900: 0.33,
  950: 0.25,
}

const stepChroma: Record<ColorStep, number> = {
  50: 0.12,
  100: 0.25,
  200: 0.45,
  300: 0.7,
  400: 0.9,
  500: 1,
  600: 1,
  700: 0.92,
  800: 0.8,
  900: 0.68,
  950: 0.55,
}

/**
 * Genera una escala de 11 pasos a partir de un color de marca.
 * El color original se conserva intacto en el paso cuya luminosidad más se le parece,
 * de modo que el color exacto de la marca aparece en la interfaz.
 */
export function generateScale(hex: string): { scale: ColorScale; anchor: ColorStep } {
  const base = hexToOklch(hex)
  const steps = Object.keys(stepLightness).map(Number) as ColorStep[]
  const anchor = steps.reduce((best, step) =>
    Math.abs(stepLightness[step] - base.l) < Math.abs(stepLightness[best] - base.l) ? step : best,
  )
  const scale = {} as ColorScale
  for (const step of steps) {
    scale[step] =
      step === anchor
        ? toHex(parseHex(hex))
        : oklchToHex({ l: stepLightness[step], c: base.c * stepChroma[step], h: base.h })
  }
  return { scale, anchor }
}

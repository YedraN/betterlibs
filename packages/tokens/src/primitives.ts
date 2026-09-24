/**
 * Tokens primitivos: los valores en bruto del sistema.
 *
 * Los componentes NO deben usarlos directamente; usan los tokens semánticos
 * (`semantic.ts`), que son los que cambian entre tema claro, oscuro y de marca.
 */

export type ColorStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export type ColorScale = Record<ColorStep, string>
export type StatusStep = 50 | 100 | 300 | 500 | 600 | 700 | 800 | 900
export type StatusScale = Record<StatusStep, string>

export const colorSteps: ColorStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/** Gris azulado neutro: sobrio y legible, pensado para textos largos y superficies. */
const neutral: ColorScale = {
  50: '#f7f8fa',
  100: '#eef0f4',
  200: '#dde1e8',
  300: '#c4cad5',
  400: '#9aa3b2',
  500: '#6b7384',
  600: '#525b6b',
  700: '#3c4453',
  800: '#272e3a',
  900: '#171c25',
  950: '#0c1017',
}

/** Azul corporativo por defecto. Se sustituye con `createTheme({ brand })`. */
const brand: ColorScale = {
  50: '#eef4ff',
  100: '#d9e6ff',
  200: '#bcd3ff',
  300: '#8eb5ff',
  400: '#5a8cff',
  500: '#3366ff',
  600: '#1f4fe0',
  700: '#1a3fb3',
  800: '#1b378d',
  900: '#1c3170',
  950: '#141f45',
}

const success: StatusScale = {
  50: '#ecfdf3',
  100: '#dcfae6',
  300: '#75e0a7',
  500: '#17b26a',
  600: '#079455',
  700: '#067647',
  800: '#085d3a',
  900: '#074d31',
}

const warning: StatusScale = {
  50: '#fffaeb',
  100: '#fef0c7',
  300: '#fec84b',
  500: '#f79009',
  600: '#dc6803',
  700: '#b54708',
  800: '#93370d',
  900: '#7a2e0e',
}

const danger: StatusScale = {
  50: '#fef3f2',
  100: '#fee4e2',
  300: '#fda29b',
  500: '#f04438',
  600: '#d92d20',
  700: '#b42318',
  800: '#912018',
  900: '#7a271a',
}

const info: StatusScale = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  300: '#7cd4fd',
  500: '#0ba5ec',
  600: '#0086c9',
  700: '#026aa2',
  800: '#065986',
  900: '#0b4a6f',
}

export const color = {
  white: '#ffffff',
  black: '#000000',
  neutral,
  brand,
  success,
  warning,
  danger,
  info,
}

/**
 * Tamaño tipográfico fluido: crece de forma lineal entre 360px y 1280px de viewport.
 * Evita saltos bruscos entre breakpoints y respeta el zoom del usuario (usa rem).
 */
export function fluid(minRem: number, maxRem: number, minVw = 360, maxVw = 1280): string {
  if (minRem === maxRem) return `${minRem}rem`
  const slope = ((maxRem - minRem) * 16) / (maxVw - minVw)
  const intercept = minRem - (slope * minVw) / 16
  const round = (n: number) => Number(n.toFixed(4))
  return `clamp(${minRem}rem, ${round(intercept)}rem + ${round(slope * 100)}vw, ${maxRem}rem)`
}

export const font = {
  family: {
    sans: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    display:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, 'SFMono-Regular', 'Cascadia Code', Menlo, Consolas, monospace",
  },
  size: {
    xs: fluid(0.75, 0.75),
    sm: fluid(0.875, 0.875),
    md: fluid(1, 1),
    lg: fluid(1.0625, 1.125),
    xl: fluid(1.125, 1.3125),
    '2xl': fluid(1.375, 1.625),
    '3xl': fluid(1.625, 2.125),
    '4xl': fluid(1.875, 2.75),
    '5xl': fluid(2.25, 3.5),
    '6xl': fluid(2.625, 4.5),
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  leading: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.7',
  },
  tracking: {
    tighter: '-0.035em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.04em',
  },
}

/** Escala de espaciado en base 4px. Las claves con decimales usan guion: `0-5` = 2px. */
export const space = {
  '0': '0',
  px: '1px',
  '0-5': '0.125rem',
  '1': '0.25rem',
  '1-5': '0.375rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
}

/** Espaciado vertical fluido para secciones de página. */
export const section = {
  sm: fluid(2.5, 4),
  md: fluid(3.5, 6),
  lg: fluid(4.5, 8),
}

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
}

export type RadiusPreset = 'sharp' | 'soft' | 'round'

/** Presets de redondeo para `createTheme({ radius })`. `soft` es el valor por defecto. */
export const radiusPresets: Record<RadiusPreset, typeof radius> = {
  sharp: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    '2xl': '0.75rem',
    full: '9999px',
  },
  soft: radius,
  round: {
    none: '0',
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
}

export const shadow = {
  xs: '0 1px 2px rgb(12 16 23 / 0.06)',
  sm: '0 1px 3px rgb(12 16 23 / 0.08), 0 1px 2px rgb(12 16 23 / 0.04)',
  md: '0 4px 8px -2px rgb(12 16 23 / 0.08), 0 2px 4px -2px rgb(12 16 23 / 0.04)',
  lg: '0 12px 16px -4px rgb(12 16 23 / 0.08), 0 4px 6px -2px rgb(12 16 23 / 0.03)',
  xl: '0 20px 24px -4px rgb(12 16 23 / 0.1), 0 8px 8px -4px rgb(12 16 23 / 0.04)',
}

export const shadowDark = {
  xs: '0 1px 2px rgb(0 0 0 / 0.4)',
  sm: '0 1px 3px rgb(0 0 0 / 0.5), 0 1px 2px rgb(0 0 0 / 0.3)',
  md: '0 4px 8px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  lg: '0 12px 16px -4px rgb(0 0 0 / 0.55), 0 4px 6px -2px rgb(0 0 0 / 0.3)',
  xl: '0 20px 24px -4px rgb(0 0 0 / 0.6), 0 8px 8px -4px rgb(0 0 0 / 0.35)',
}

/** Movimiento: duraciones cortas (120–240ms) para que la interfaz responda sin distraer. */
export const motion = {
  duration: {
    instant: '0ms',
    fast: '120ms',
    normal: '180ms',
    slow: '240ms',
    slower: '360ms',
  },
  ease: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  },
}

/** Breakpoints en px. Las media queries no aceptan variables CSS: úsalos desde JS o como referencia. */
export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const container = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '75rem',
  '2xl': '87.5rem',
  prose: '65ch',
  gutter: fluid(1, 2),
}

export const zIndex = {
  base: '0',
  raised: '10',
  dropdown: '1000',
  sticky: '1100',
  header: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  toast: '1600',
  tooltip: '1700',
}

/** Alturas de controles. `md` = 44px, el mínimo recomendado para objetivos táctiles. */
export const control = {
  height: {
    sm: '2.25rem',
    md: '2.75rem',
    lg: '3.25rem',
  },
}

export const focus = {
  ringWidth: '2px',
  ringOffset: '2px',
}

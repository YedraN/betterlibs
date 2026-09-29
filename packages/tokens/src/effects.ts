/**
 * Efectos del lenguaje visual «Profundidad suave»: superficies en capas con un filo de luz
 * arriba, bordes finos translúcidos, degradados discretos, halos de color y patrones de fondo.
 *
 * Se construyen con `color-mix()` a partir de los tokens semánticos, así que se adaptan solos a
 * la marca (`createTheme`) y al modo oscuro. Por eso se declaran junto a los colores de cada tema
 * (una variable que depende de otra se calcula donde se declara, no donde se usa).
 */
type CssVars = Record<string, string>

const c = (name: string) => `var(--bl-color-${name})`
const mix = (color: string, percent: number, other = 'transparent') =>
  `color-mix(in oklab, ${color} ${percent}%, ${other})`

export function effectVars(mode: 'light' | 'dark'): CssVars {
  const light = mode === 'light'
  /** Tinta de las sombras: azul muy oscuro en claro, negro en oscuro. */
  const ink = (alpha: number) => (light ? `rgb(12 16 23 / ${alpha})` : `rgb(0 0 0 / ${alpha})`)
  /** Filo de luz en el borde superior de las superficies (invisible en claro sobre blanco). */
  const highlight = light ? 'rgb(255 255 255 / 0.85)' : 'rgb(255 255 255 / 0.07)'
  const hairline = light ? 'rgb(12 16 23 / 0.08)' : 'rgb(255 255 255 / 0.08)'

  return {
    // Colores de apoyo
    '--bl-color-border-subtle': hairline,
    '--bl-color-highlight': highlight,
    '--bl-color-glass': mix(c('surface'), light ? 72 : 62),
    '--bl-color-glass-border': light ? 'rgb(255 255 255 / 0.6)' : 'rgb(255 255 255 / 0.1)',
    '--bl-color-accent-glow': mix(c('accent'), light ? 30 : 40),
    '--bl-color-accent-tint': mix(c('accent'), light ? 6 : 10),

    // Degradados. El del acento va del acento a su hover: ambos cumplen contraste con el texto.
    '--bl-gradient-accent': `linear-gradient(180deg, ${c('accent')}, ${c('accent-hover')})`,
    '--bl-gradient-accent-hover': `linear-gradient(180deg, ${c('accent-hover')}, ${c('accent-active')})`,
    '--bl-gradient-surface': `linear-gradient(180deg, ${c('surface-raised')}, ${mix(c('surface-raised'), light ? 96 : 92, c('bg-muted'))})`,
    '--bl-gradient-neutral': `linear-gradient(180deg, ${c('surface-raised')}, ${mix(c('surface-raised'), light ? 90 : 85, c('bg-muted'))})`,
    '--bl-gradient-border': `linear-gradient(180deg, ${mix(c('text'), light ? 16 : 24)}, ${mix(c('text'), light ? 4 : 6)})`,
    '--bl-gradient-border-accent': `linear-gradient(135deg, ${c('accent')}, ${mix(c('accent'), 20)} 55%, ${mix(c('accent'), 60)})`,
    '--bl-gradient-text': `linear-gradient(120deg, ${c('text')} 15%, ${c('accent-text')} 85%)`,
    '--bl-gradient-glow': `radial-gradient(60% 55% at 50% 0%, ${mix(c('accent'), light ? 16 : 28)}, transparent 70%)`,
    '--bl-gradient-mesh': [
      `radial-gradient(40% 50% at 15% 10%, ${mix(c('accent'), light ? 14 : 24)}, transparent 70%)`,
      `radial-gradient(35% 45% at 85% 0%, ${mix(c('info-solid'), light ? 10 : 18)}, transparent 70%)`,
      `radial-gradient(45% 40% at 60% 100%, ${mix(c('accent'), light ? 8 : 14)}, transparent 70%)`,
    ].join(', '),

    // Elevación: anillo fino + sombra + filo de luz interior. De plano (0) a flotante (4).
    '--bl-elevation-0': `0 0 0 1px ${c('border')}`,
    '--bl-elevation-1': `0 0 0 1px ${hairline}, 0 1px 2px ${ink(light ? 0.05 : 0.4)}, inset 0 1px 0 ${highlight}`,
    '--bl-elevation-2': `0 0 0 1px ${hairline}, 0 1px 2px ${ink(light ? 0.04 : 0.35)}, 0 4px 12px -2px ${ink(light ? 0.07 : 0.45)}, inset 0 1px 0 ${highlight}`,
    '--bl-elevation-3': `0 0 0 1px ${hairline}, 0 2px 4px ${ink(light ? 0.04 : 0.35)}, 0 12px 28px -6px ${ink(light ? 0.12 : 0.55)}, inset 0 1px 0 ${highlight}`,
    '--bl-elevation-4': `0 0 0 1px ${hairline}, 0 4px 8px ${ink(light ? 0.04 : 0.35)}, 0 24px 56px -12px ${ink(light ? 0.2 : 0.65)}, inset 0 1px 0 ${highlight}`,

    // Sombras de color para acciones principales
    '--bl-shadow-accent': `0 1px 2px ${ink(0.12)}, 0 4px 14px -4px ${mix(c('accent'), light ? 50 : 45)}, inset 0 1px 0 rgb(255 255 255 / 0.22)`,
    '--bl-shadow-accent-hover': `0 1px 2px ${ink(0.12)}, 0 10px 28px -6px ${mix(c('accent'), light ? 60 : 55)}, inset 0 1px 0 rgb(255 255 255 / 0.28)`,
    '--bl-shadow-control': `0 1px 2px ${ink(light ? 0.05 : 0.3)}, inset 0 1px 0 ${highlight}`,
    '--bl-shadow-inset': `inset 0 1px 2px ${ink(light ? 0.06 : 0.35)}`,

    // Halo que acompaña al anillo de foco (el anillo sólido se mantiene para cumplir WCAG).
    '--bl-ring-halo': `0 0 0 4px ${mix(c('focus-ring'), light ? 22 : 32)}`,
    '--bl-ring-danger': `0 0 0 4px ${mix(c('danger-solid'), light ? 18 : 28)}`,

    // Patrones decorativos para fondos de sección
    '--bl-pattern-grid': `linear-gradient(to right, ${hairline} 1px, transparent 1px), linear-gradient(to bottom, ${hairline} 1px, transparent 1px)`,
    '--bl-pattern-dots': `radial-gradient(${light ? 'rgb(12 16 23 / 0.14)' : 'rgb(255 255 255 / 0.14)'} 1px, transparent 1.5px)`,
    '--bl-pattern-noise': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${light ? 0.035 : 0.06}'/%3E%3C/svg%3E")`,
  }
}

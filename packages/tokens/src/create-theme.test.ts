import { describe, expect, it } from 'vitest'
import { contrast, generateScale } from './color.ts'
import { createTheme, ThemeContrastError } from './create-theme.ts'
import { checkContrast } from './css.ts'
import { dark, light } from './semantic.ts'

describe('contrast', () => {
  it('calcula el ratio WCAG', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21)
    expect(contrast('#ffffff', '#ffffff')).toBe(1)
  })
})

describe('tema por defecto', () => {
  it('cumple WCAG AA en claro y oscuro', () => {
    const failures = [...checkContrast('light', light), ...checkContrast('dark', dark)].filter(
      (r) => !r.pass,
    )
    expect(failures).toEqual([])
  })
})

describe('generateScale', () => {
  it('conserva el color de marca exacto en algún paso', () => {
    const { scale, anchor } = generateScale('#0A5CFF')
    expect(scale[anchor]).toBe('#0a5cff')
    expect(Object.keys(scale)).toHaveLength(11)
  })
})

describe('createTheme', () => {
  it.each(['#0a5cff', '#e11d48', '#0f766e', '#7c3aed', '#facc15', '#111827'])(
    'genera un tema accesible para %s',
    (brand) => {
      const theme = createTheme({ brand })
      expect(theme.accessible).toBe(true)
      expect(theme.css).toContain('--bl-color-brand-600')
    },
  )

  it('usa texto oscuro sobre marcas claras', () => {
    const theme = createTheme({ brand: '#facc15' })
    expect(theme.semantic.light['on-accent']).toBe('neutral.950')
  })

  it('aplica selector, radio y fuentes', () => {
    const theme = createTheme({
      selector: '[data-brand="acme"]',
      radius: 'round',
      fontSans: 'Inter, sans-serif',
    })
    expect(theme.css).toContain('[data-brand="acme"] {')
    expect(theme.css).toContain('--bl-radius-md: 0.75rem')
    expect(theme.css).toContain('--bl-font-family-display: Inter, sans-serif')
  })

  it('rechaza colores no válidos', () => {
    expect(() => createTheme({ brand: 'nope' })).toThrow('Color no válido')
  })

  it('ThemeContrastError describe cada par que falla', () => {
    const error = new ThemeContrastError([
      {
        fg: 'text',
        bg: 'bg',
        min: 4.5,
        usage: 'Texto principal',
        mode: 'light',
        ratio: 2.1,
        pass: false,
      },
    ])
    expect(error.message).toContain('Texto principal')
    expect(error.failures).toHaveLength(1)
  })
})

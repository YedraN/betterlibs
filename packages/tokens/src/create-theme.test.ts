import { describe, expect, it } from 'vitest'
import { contrast, generateScale } from './color.ts'
import { createTheme, ThemeContrastError } from './create-theme.ts'
import { checkContrast } from './css.ts'
import { editorial } from './editorial.ts'
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

describe('fundamentos editoriales', () => {
  it('valida ambos modos y permite resolver su paleta propia', () => {
    const theme = createTheme({ preset: editorial, selector: '[data-preset="editorial"]' })
    expect(theme.accessible).toBe(true)
    expect(theme.palette.neutral[50]).toBe('#f5f3ee')
    expect(theme.css).toContain('--bl-type-hero-size: clamp(')
    expect(theme.css).toContain('--bl-elevation-1: none')
    expect(createTheme().palette.neutral[50]).toBe('#f7f8fa')
  })

  it.each([
    '#0a5cff',
    '#e11d48',
    '#0f766e',
    '#7c3aed',
    '#facc15',
    '#111827',
    '#c7f45a',
    '#ffffff',
    '#000000',
  ])('valida la marca %s sobre las superficies editoriales, incluidos hover y active', (brand) => {
    const theme = createTheme({ preset: editorial, brand })
    expect(theme.contrast.filter((pair) => !pair.pass)).toEqual([])
    expect(theme.semantic.light['accent-active']).toMatch(/^brand\./)
  })

  it('rechaza un preset personalizado ilegible y permite inspeccionarlo con strict false', () => {
    const invalid = {
      ...editorial,
      semantic: {
        ...editorial.semantic,
        light: { ...editorial.semantic.light, text: 'neutral.50' },
      },
    }
    expect(() => createTheme({ preset: invalid })).toThrow(ThemeContrastError)
    const theme = createTheme({ preset: invalid, strict: false })
    expect(theme.accessible).toBe(false)
    expect(theme.contrast.some((pair) => pair.fg === 'text' && !pair.pass)).toBe(true)
    expect(createTheme({ preset: editorial }).accessible).toBe(true)
  })

  it('rechaza un ratio inferior al mínimo aunque se muestre como 4.5', () => {
    const semantic = { ...light, text: '#6e7978', bg: '#ffffff' }
    const result = checkContrast('light', semantic).find(
      (pair) => pair.fg === 'text' && pair.bg === 'bg',
    )
    expect(result?.ratio).toBe(4.5)
    expect(result?.pass).toBe(false)
  })
})

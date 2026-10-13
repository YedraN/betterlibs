import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { BentoFeature, BentoFeatures } from './BentoFeatures/BentoFeatures'
import { CTA } from './CTA/CTA'
import { FeatureShowcase } from './FeatureShowcase/FeatureShowcase'
import { Hero } from './Hero/Hero'

describe('composiciones editoriales', () => {
  it('los bloques estáticos conservan contenido, jerarquía y anclas en SSR', () => {
    const html = renderToString(
      <main>
        <Hero
          id="hero"
          variant="editorial"
          title="Una interfaz con voz"
          media={<p>Demostración</p>}
        />
        <BentoFeatures id="features" title="Qué puedes crear">
          <BentoFeature title="Contenido" description="Una historia completa." />
        </BentoFeatures>
        <CTA id="start" title="Empezar" panelTone="inverse" actions={<a href="#hero">Volver</a>} />
      </main>,
    )
    expect(html).toContain('hero-title')
    expect(html).toContain('features-title')
    expect(html).toContain('data-panel-tone="inverse"')
    expect(html).toContain('Demostración')
    expect(html).not.toContain('opacity:0')
  })
  it('el selector manual conserva el foco, omite deshabilitados y muestra un solo panel', async () => {
    render(
      <FeatureShowcase
        selectorLabel="Ejemplos"
        activationMode="manual"
        items={[
          { value: 'a', label: 'Primero', content: <button>Acción A</button> },
          { value: 'b', label: 'Segundo', content: <button>Acción B</button> },
          { value: 'c', label: 'Próximamente', content: 'Otro', disabled: true },
        ]}
      />,
    )
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Segundo' }).getAttribute('aria-selected')).toBe('false')
    await userEvent.keyboard('{Enter}')
    expect(screen.queryByRole('button', { name: 'Acción A' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Acción B' })).toBeTruthy()
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Primero' }))
  })
  it('respeta el modo controlado y comunica el cambio sin adelantarse al consumidor', async () => {
    const onChange = vi.fn()
    const items = [
      { value: 'a', label: 'Primero', content: 'Contenido A' },
      { value: 'b', label: 'Segundo', content: 'Contenido B' },
    ]
    const { rerender } = render(
      <FeatureShowcase selectorLabel="Ejemplos" items={items} value="a" onValueChange={onChange} />,
    )
    await userEvent.click(screen.getByRole('tab', { name: 'Segundo' }))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('tabpanel').textContent).toBe('Contenido A')
    rerender(
      <FeatureShowcase selectorLabel="Ejemplos" items={items} value="b" onValueChange={onChange} />,
    )
    expect(screen.getByRole('tabpanel').textContent).toBe('Contenido B')
  })
})

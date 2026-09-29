import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { AspectRatio } from './AspectRatio/AspectRatio'
import { Box } from './Box/Box'
import { Card } from './Card/Card'
import { Container } from './Container/Container'
import { Divider } from './Divider/Divider'
import { Grid } from './Grid/Grid'
import { IconTile } from './IconTile/IconTile'
import { Section } from './Section/Section'
import { Stack } from './Stack/Stack'

describe('Container', () => {
  it('renderiza un div con tamaño por defecto y admite `as`', () => {
    const { container, rerender } = render(<Container>Hola</Container>)
    expect(container.firstElementChild).toHaveProperty('tagName', 'DIV')
    expect(container.firstElementChild?.getAttribute('data-size')).toBe('xl')
    rerender(<Container as="main" size="prose" />)
    expect(container.querySelector('main')?.getAttribute('data-size')).toBe('prose')
  })
})

describe('Section', () => {
  it('fuerza el modo de color en tonos dark/light', () => {
    const { container } = render(
      <>
        <Section tone="dark" aria-label="Oscura" />
        <Section tone="subtle" aria-label="Sutil" />
      </>,
    )
    const [dark, subtle] = container.querySelectorAll('section')
    expect(dark?.getAttribute('data-theme')).toBe('dark')
    expect(subtle?.hasAttribute('data-theme')).toBe(false)
  })
})

describe('Stack y Grid', () => {
  it('traducen gap y columnas responsive a variables CSS', () => {
    render(
      <>
        <Stack data-testid="stack" direction="row" gap="8" stackBelow="md" />
        <Grid data-testid="grid" columns={{ base: 1, md: 2, lg: 3 }} />
        <Grid data-testid="auto" minItemWidth="16rem" />
      </>,
    )
    const stack = screen.getByTestId('stack')
    expect(stack.style.getPropertyValue('--_gap')).toBe('var(--bl-space-8)')
    expect(stack.getAttribute('data-stack-below')).toBe('md')

    const grid = screen.getByTestId('grid')
    expect(grid.style.getPropertyValue('--bl-grid-cols-base')).toBe('1')
    expect(grid.style.getPropertyValue('--bl-grid-cols-lg')).toBe('3')
    expect(grid.hasAttribute('data-md')).toBe(true)

    const auto = screen.getByTestId('auto')
    expect(auto.hasAttribute('data-auto')).toBe(true)
    expect(auto.style.getPropertyValue('--_min')).toBe('16rem')
  })
})

describe('Divider', () => {
  it('es decorativo por defecto y semántico si se pide', () => {
    render(
      <>
        <Divider data-testid="deco" />
        <Divider decorative={false} />
      </>,
    )
    expect(screen.getByTestId('deco').getAttribute('role')).toBe('none')
    expect(screen.getByRole('separator')).toBeTruthy()
  })
})

describe('Accesibilidad del layout', () => {
  it('una página compuesta no tiene violaciones', async () => {
    const { container } = render(
      <main>
        <Section aria-labelledby="t">
          <Container>
            <Stack>
              <h2 id="t">Servicios</h2>
              <Grid columns={{ base: 1, md: 3 }}>
                <Box padding="6" bordered>
                  Consultoría
                </Box>
                <Box padding="6" bordered>
                  Auditoría
                </Box>
              </Grid>
              <Divider label="o" />
              <AspectRatio ratio={16 / 9}>
                <img src="data:," alt="Oficina central" />
              </AspectRatio>
            </Stack>
          </Container>
        </Section>
      </main>,
    )
    await expectNoA11yViolations(container)
  })
})

describe('Section background', () => {
  it('marca el fondo decorativo solo si se pide', () => {
    const { container } = render(
      <>
        <Section background="mesh" aria-label="Con fondo" />
        <Section aria-label="Sin fondo" />
      </>,
    )
    const [withBg, plain] = container.querySelectorAll('section')
    expect(withBg?.getAttribute('data-background')).toBe('mesh')
    expect(plain?.hasAttribute('data-background')).toBe(false)
  })
})

describe('Card e IconTile', () => {
  it('aplica variante, relleno e interactividad, y la baldosa es decorativa', async () => {
    const { container } = render(
      <Card as="article" variant="glow" padding="8" interactive>
        <IconTile tone="solid">
          <svg />
        </IconTile>
        <h3>
          <a className="bl-card-link" href="/analitica">
            Analítica
          </a>
        </h3>
      </Card>,
    )
    const card = container.querySelector('article')
    expect(card?.getAttribute('data-variant')).toBe('glow')
    expect(card?.hasAttribute('data-interactive')).toBe(true)
    expect(card?.getAttribute('style')).toContain('--_padding: var(--bl-space-8)')
    expect(container.querySelector('[data-tone="solid"]')?.getAttribute('aria-hidden')).toBe('true')
    await expectNoA11yViolations(container)
  })
})

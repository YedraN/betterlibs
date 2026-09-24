import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Ejecuta axe sobre un contenedor y falla con un mensaje legible si hay violaciones.
 * El contraste se desactiva porque jsdom no calcula estilos; se verifica en los tokens
 * y en Storybook.
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.html).join('\n  ')}`,
  )
  expect(summary, summary.join('\n\n')).toEqual([])
}

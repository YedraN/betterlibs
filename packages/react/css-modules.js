// @ts-check
import { basename } from 'node:path'

/**
 * Nombres de clase legibles y estables: `Button.module.css` + `.root` → `bl-button-root`.
 * Permiten a quien use la librería apuntar a una parte concreta si lo necesita.
 * Compartido entre el build de la librería y Storybook.
 * @param {string} name
 * @param {string} filename
 */
export function generateScopedName(name, filename) {
  const component = basename(filename.split('?')[0] ?? filename)
    .replace(/\.module\.css$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
  return `bl-${component}-${name}`
}

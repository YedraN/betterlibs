/**
 * @betterlibs/icons — iconos SVG de trazo como componentes React.
 *
 * - Decorativos por defecto (`aria-hidden`); pasa `title` para que se anuncien.
 * - Tamaño `1em`: heredan el tamaño y el color (`currentColor`) del texto.
 * - Tree-shakeable: solo se incluyen los que importas.
 */
export { createIcon, type Icon, type IconNode, type IconProps } from './create-icon.tsx'
export * from './icons.ts'

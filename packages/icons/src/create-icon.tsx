import { type ComponentPropsWithRef, createElement, type ReactElement } from 'react'

/** Nodo SVG compacto: `d` de un path, un círculo `[cx, cy, r]` o un rect `[x, y, w, h, rx]`. */
export type IconNode =
  | string
  | { c: [number, number, number] }
  | { r: [number, number, number, number, number?] }

export type IconProps = Omit<ComponentPropsWithRef<'svg'>, 'children'> & {
  /** Tamaño en px o cualquier unidad CSS. Por defecto `1em`: se adapta al texto que lo rodea. */
  size?: number | string
  /** Grosor del trazo. Por defecto 1.75. */
  strokeWidth?: number | string
  /**
   * Texto accesible. Si lo indicas, el icono se anuncia (`role="img"`).
   * Si no, es decorativo y se oculta a lectores de pantalla (lo habitual junto a texto visible).
   */
  title?: string
}

export type Icon = ((props: IconProps) => ReactElement) & { displayName: string }

function renderNode(node: IconNode, key: number) {
  if (typeof node === 'string') return createElement('path', { key, d: node })
  if ('c' in node) {
    const [cx, cy, r] = node.c
    return createElement('circle', { key, cx, cy, r })
  }
  const [x, y, width, height, rx] = node.r
  return createElement('rect', { key, x, y, width, height, rx })
}

/** Crea un componente de icono con la misma API y accesibilidad que los del paquete. */
export function createIcon(name: string, nodes: IconNode[]): Icon {
  const Component = ({ size = '1em', strokeWidth = 1.75, title, ...props }: IconProps) =>
    createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        focusable: 'false',
        'data-bl-icon': name,
        ...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }),
        ...props,
      },
      title ? createElement('title', { key: 't' }, title) : null,
      nodes.map(renderNode),
    )
  Component.displayName = `${name}Icon`
  return Component
}

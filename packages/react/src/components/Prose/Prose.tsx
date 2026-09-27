import type { ElementType } from 'react'
import { cx } from '../../utils/cx'
import type { PolymorphicProps } from '../../utils/types'
import styles from './Prose.module.css'

export type ProseOwnProps = {
  /** Tamaño del texto base. `lg` para artículos de lectura larga. @default 'md' */
  size?: 'md' | 'lg'
}

export type ProseProps<E extends ElementType = 'div'> = PolymorphicProps<E, ProseOwnProps>

/**
 * Da estilo tipográfico a contenido enriquecido que no controlas elemento a elemento: artículos
 * del blog, páginas legales, HTML de un CMS o Markdown. Titulares, párrafos, listas, citas,
 * tablas, código e imágenes con el ritmo del sistema y un ancho de línea cómodo (~70 caracteres).
 *
 * @example
 * <Prose as="article" dangerouslySetInnerHTML={{ __html: post.html }} />
 */
export function Prose<E extends ElementType = 'div'>({
  as,
  size = 'md',
  className,
  ...props
}: ProseProps<E>) {
  const Component: ElementType = as ?? 'div'
  return <Component className={cx(styles.root, className)} data-size={size} {...props} />
}

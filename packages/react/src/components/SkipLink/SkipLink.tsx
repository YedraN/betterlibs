import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import styles from './SkipLink.module.css'

export type SkipLinkProps = ComponentPropsWithRef<'a'> & {
  /** Destino del salto: el `id` del contenido principal. @default '#main' */
  href?: string
}

/**
 * Primer elemento enfocable de la página: permite a usuarios de teclado saltarse
 * la navegación. Solo es visible al recibir el foco. Colócalo al principio del `<body>`
 * y asegúrate de que el destino exista (`<main id="main">`).
 */
export function SkipLink({
  href = '#main',
  children = 'Saltar al contenido principal',
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a href={href} className={cx(styles.root, className)} {...props}>
      {children}
    </a>
  )
}

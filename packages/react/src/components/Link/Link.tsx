import { ArrowRightIcon, ExternalLinkIcon } from '@betterlibs/icons'
import { Slot, Slottable } from '@radix-ui/react-slot'
import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './Link.module.css'

export type LinkProps = ComponentPropsWithRef<'a'> & {
  /**
   * - `inline`: dentro de un párrafo, siempre subrayado.
   * - `standalone`: enlace suelto («Ver todos los casos»), subrayado al pasar el ratón.
   * - `subtle`: navegación secundaria (pie de página), hereda el color del texto.
   * @default 'inline'
   */
  variant?: 'inline' | 'standalone' | 'subtle'
  /** Añade una flecha que se desplaza al pasar el ratón. Ideal para `standalone`. */
  arrow?: boolean
  /**
   * Marca el enlace como externo: abre en pestaña nueva, añade `rel="noopener noreferrer"`,
   * un icono y un aviso para lectores de pantalla. Se activa solo con `target="_blank"`.
   */
  external?: boolean
  /** Aviso de pestaña nueva para lectores de pantalla. @default '(se abre en una pestaña nueva)' */
  newTabLabel?: string
  /**
   * Aplica los estilos al hijo, p. ej. el `Link` de Next.js o React Router.
   * @example <Link asChild><NextLink href="/servicios">Servicios</NextLink></Link>
   */
  asChild?: boolean
}

/**
 * Enlace de navegación. El texto debe describir el destino por sí solo:
 * «Descargar el informe anual (PDF, 2 MB)», nunca «haz clic aquí».
 */
export function Link({
  variant = 'inline',
  arrow = false,
  external,
  newTabLabel = '(se abre en una pestaña nueva)',
  asChild = false,
  target,
  rel,
  className,
  children,
  ...props
}: LinkProps) {
  const isExternal = external ?? target === '_blank'
  const Component = asChild ? Slot : 'a'
  return (
    <Component
      className={cx(styles.root, className)}
      data-variant={variant}
      target={isExternal ? '_blank' : target}
      rel={isExternal ? cx(rel, 'noopener noreferrer') : rel}
      {...props}
    >
      <Slottable>{children}</Slottable>
      {isExternal && (
        <>
          <ExternalLinkIcon className={styles.icon} />
          <VisuallyHidden> {newTabLabel}</VisuallyHidden>
        </>
      )}
      {arrow && !isExternal && <ArrowRightIcon className={cx(styles.icon, styles.arrow)} />}
    </Component>
  )
}

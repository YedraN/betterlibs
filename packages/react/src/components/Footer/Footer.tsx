import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Container, type ContainerOwnProps } from '../Container/Container'
import { type SocialLink, SocialLinks } from '../SocialLinks/SocialLinks'
import styles from './Footer.module.css'

export type FooterLink = { label: ReactNode; href: string }

export type FooterColumn = {
  /** Título de la columna («Servicios», «Empresa»). */
  title: ReactNode
  links: FooterLink[]
}

export type FooterProps = Omit<ComponentPropsWithRef<'footer'>, 'children'> & {
  /** Logo (normalmente enlazado a la portada). */
  logo?: ReactNode
  /** Frase breve sobre la empresa, bajo el logo. */
  description?: ReactNode
  /** Columnas de enlaces. */
  columns?: FooterColumn[]
  /** Perfiles en redes sociales. */
  social?: SocialLink[]
  /** Título accesible de las redes. @default 'Redes sociales' */
  socialLabel?: string
  /** Enlaces legales: aviso legal, privacidad, cookies, accesibilidad. */
  legal?: FooterLink[]
  /** Texto de derechos («© 2026 Empresa S.L.»). */
  copyright?: ReactNode
  /** Bloque extra junto a las columnas (datos de contacto, boletín…). */
  children?: ReactNode
  /** `dark` fuerza el modo oscuro dentro del pie. @default 'subtle' */
  tone?: 'default' | 'subtle' | 'dark'
  /** Nivel de los títulos de columna. @default 2 */
  headingLevel?: 2 | 3
  /** Componente de enlace de tu router. @default 'a' */
  linkAs?: ElementType
  /** @default 'xl' */
  containerSize?: ContainerOwnProps['size']
  /** Nombre de la navegación de columnas. @default 'Pie de página' */
  navigationLabel?: string
  /** Nombre de la navegación legal. @default 'Información legal' */
  legalLabel?: string
}

/**
 * Pie del sitio: marca, columnas de enlaces, redes sociales, bloque libre (contacto, boletín) y
 * franja legal. Sin estado: funciona en Server Components.
 */
export function Footer({
  logo,
  description,
  columns,
  social,
  socialLabel = 'Redes sociales',
  legal,
  copyright,
  children,
  tone = 'subtle',
  headingLevel = 2,
  linkAs: LinkComponent = 'a',
  containerSize = 'xl',
  navigationLabel = 'Pie de página',
  legalLabel = 'Información legal',
  className,
  ...props
}: FooterProps) {
  const Heading = `h${headingLevel}` as const
  const hasBrand = logo || description || social?.length
  return (
    <footer
      className={cx(styles.root, className)}
      data-tone={tone}
      data-theme={tone === 'dark' ? 'dark' : undefined}
      {...props}
    >
      <Container size={containerSize}>
        {(hasBrand || columns?.length || children) && (
          <div className={styles.top}>
            {hasBrand && (
              <div className={styles.brand}>
                {logo && <div className={styles.logo}>{logo}</div>}
                {description && <div className={styles.description}>{description}</div>}
                {social && social.length > 0 && (
                  <SocialLinks links={social} size="sm" aria-label={socialLabel} />
                )}
              </div>
            )}
            {columns && columns.length > 0 && (
              <nav className={styles.columns} aria-label={navigationLabel}>
                {columns.map((column, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: columnas estáticas
                  <div key={index} className={styles.column}>
                    <Heading className={styles.columnTitle}>{column.title}</Heading>
                    <ul className={styles.links}>
                      {column.links.map((link, linkIndex) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: enlaces estáticos
                        <li key={linkIndex}>
                          <LinkComponent href={link.href} className={styles.link}>
                            {link.label}
                          </LinkComponent>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            )}
            {children && <div className={styles.extra}>{children}</div>}
          </div>
        )}
        {(copyright || legal?.length) && (
          <div className={styles.bottom}>
            {copyright && <p className={styles.copyright}>{copyright}</p>}
            {legal && legal.length > 0 && (
              <nav aria-label={legalLabel}>
                <ul className={styles.legal}>
                  {legal.map((link, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: enlaces estáticos
                    <li key={index}>
                      <LinkComponent href={link.href} className={styles.link}>
                        {link.label}
                      </LinkComponent>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        )}
      </Container>
    </footer>
  )
}

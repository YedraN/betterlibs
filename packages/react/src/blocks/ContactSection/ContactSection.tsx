import type { ReactNode } from 'react'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './ContactSection.module.css'

export type ContactDetail = {
  /** Icono decorativo. */
  icon?: ReactNode
  /** Qué es: «Teléfono», «Email», «Dirección», «Horario». */
  label: ReactNode
  value: ReactNode
  /** Enlace del valor (`tel:`, `mailto:`, un mapa). */
  href?: string
}

export type ContactSectionProps = BlockBaseProps & {
  /** Datos de contacto. */
  details?: ContactDetail[]
  /** El formulario de contacto (con `Form`, `Field`…). */
  children?: ReactNode
  /** Contenido extra junto a los datos: un mapa, horarios, oficinas. */
  aside?: ReactNode
  /**
   * - `split`: datos a un lado y formulario al otro.
   * - `stacked`: datos en una fila de tarjetas y el formulario debajo.
   * @default 'split'
   */
  variant?: 'split' | 'stacked'
}

/**
 * Sección de contacto: datos (teléfono, email, dirección, horario) y formulario. Los datos van en
 * un `<address>`, cada uno con su etiqueta visible («Teléfono», «Email»).
 */
export function ContactSection({
  details,
  children,
  aside,
  variant = 'split',
  ...block
}: ContactSectionProps) {
  const info = (details?.length || aside) && (
    <div className={styles.info}>
      {details && details.length > 0 && (
        <address className={styles.address}>
          <ul className={styles.details} data-variant={variant}>
            {details.map((detail, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: contenido estático
              <li key={index} className={styles.detail}>
                {detail.icon && (
                  <span className={styles.icon} aria-hidden="true">
                    {detail.icon}
                  </span>
                )}
                <div className={styles.detailText}>
                  <p className={styles.label}>{detail.label}</p>
                  <p className={styles.value}>
                    {detail.href ? (
                      <a href={detail.href} className={styles.link}>
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </address>
      )}
      {aside}
    </div>
  )
  return (
    <BlockSection {...block}>
      <div className={styles.layout} data-variant={variant}>
        {info}
        {children && <div className={styles.form}>{children}</div>}
      </div>
    </BlockSection>
  )
}

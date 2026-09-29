import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Heading, type HeadingSize } from '../Heading/Heading'
import styles from './SectionHeader.module.css'

export type SectionHeaderProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  /** Antetítulo corto sobre el título («Servicios»). */
  eyebrow?: ReactNode
  /**
   * `pill`: cápsula con borde degradado y punto de color (el sello de la librería).
   * `text`: texto en mayúsculas del color de acento.
   * @default 'pill'
   */
  eyebrowStyle?: 'pill' | 'text'
  title: ReactNode
  /** Entradilla bajo el título. */
  description?: ReactNode
  /** Botones o enlaces bajo la entradilla. */
  actions?: ReactNode
  /** @default 'start' */
  align?: 'start' | 'center'
  /** Nivel del título. @default 2 */
  headingLevel?: 1 | 2 | 3 | 4
  /** Tamaño visual del título. @default '3xl' (o '5xl' con `headingLevel={1}`) */
  size?: HeadingSize
  /** `id` del título, para `aria-labelledby` de la sección. */
  titleId?: string
}

/**
 * Cabecera de una sección: antetítulo, título, entradilla y acciones con el ritmo tipográfico
 * del sistema. Limita el ancho de la entradilla para que se lea cómodamente.
 */
export function SectionHeader({
  eyebrow,
  eyebrowStyle = 'pill',
  title,
  description,
  actions,
  align = 'start',
  headingLevel = 2,
  size,
  titleId,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={cx(styles.root, className)} data-align={align} {...props}>
      {eyebrow && (
        <p className={styles.eyebrow} data-style={eyebrowStyle}>
          {eyebrow}
        </p>
      )}
      <Heading
        id={titleId}
        level={headingLevel}
        size={size ?? (headingLevel === 1 ? '5xl' : '3xl')}
        className={styles.title}
      >
        {title}
      </Heading>
      {description && <div className={styles.description}>{description}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}

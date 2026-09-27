import type { ReactNode } from 'react'
import { Container } from '../../components/Container/Container'
import { Heading } from '../../components/Heading/Heading'
import { Section } from '../../components/Section/Section'
import { cx } from '../../utils/cx'
import { type BlockBaseProps, blockTitleId } from '../shared'
import styles from './CTA.module.css'

export type CTAProps = Omit<BlockBaseProps, 'title' | 'align'> & {
  /** Llamada a la acción: beneficio + acción («Hablemos de tu proyecto»). */
  title: ReactNode
  /** Botones: uno principal y, como mucho, uno secundario. */
  actions: ReactNode
  /**
   * - `centered`: texto y botones centrados.
   * - `split`: texto a la izquierda y botones a la derecha (se apila en móvil).
   * - `panel`: dentro de un panel destacado con fondo propio.
   * @default 'panel'
   */
  variant?: 'centered' | 'split' | 'panel'
  /** Fondo del panel en `panel`. @default 'brand' */
  panelTone?: 'brand' | 'dark' | 'subtle'
  /** Contenido extra bajo las acciones («Sin compromiso · Respuesta en 24 h»). */
  note?: ReactNode
}

/** Bloque de llamada a la acción, normalmente al final de una página. */
export function CTA({
  title,
  eyebrow,
  description,
  actions,
  note,
  variant = 'panel',
  panelTone = 'brand',
  headingLevel = 2,
  tone,
  spacing,
  containerSize = 'xl',
  id,
  className,
  style,
}: CTAProps) {
  const titleId = blockTitleId(id, title)
  return (
    <Section
      id={id}
      tone={tone}
      spacing={spacing}
      className={cx(styles.root, className)}
      style={style}
      aria-labelledby={titleId}
    >
      <Container size={containerSize}>
        <div
          className={styles.box}
          data-variant={variant}
          data-panel-tone={variant === 'panel' ? panelTone : undefined}
          data-theme={variant === 'panel' && panelTone === 'dark' ? 'dark' : undefined}
        >
          <div className={styles.text}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <Heading id={titleId} level={headingLevel} size="3xl" className={styles.title}>
              {title}
            </Heading>
            {description && <div className={styles.description}>{description}</div>}
          </div>
          <div className={styles.actionsWrap}>
            <div className={styles.actions}>{actions}</div>
            {note && <p className={styles.note}>{note}</p>}
          </div>
        </div>
      </Container>
    </Section>
  )
}

import type { CSSProperties, ReactNode } from 'react'
import { Container, type ContainerOwnProps } from '../components/Container/Container'
import type { HeadingSize } from '../components/Heading/Heading'
import { Section, type SectionOwnProps } from '../components/Section/Section'
import { SectionHeader } from '../components/SectionHeader/SectionHeader'
import { cx } from '../utils/cx'
import styles from './Block.module.css'

/** Props comunes a todos los bloques: cabecera de sección y aspecto de la sección. */
export type BlockBaseProps = {
  /** Antetítulo corto sobre el título. */
  eyebrow?: ReactNode
  /** Título de la sección. Si es texto, se usa también para nombrar la sección (región). */
  title?: ReactNode
  /** Entradilla bajo el título. */
  description?: ReactNode
  /** Botones o enlaces bajo la entradilla. */
  actions?: ReactNode
  /** Alineación de la cabecera. */
  align?: 'start' | 'center'
  /** Nivel del título de la sección; los títulos internos usan el siguiente. @default 2 */
  headingLevel?: 2 | 3
  /** Fondo de la sección (`default`, `subtle`, `muted`, `brand`, `dark`, `light`). */
  tone?: SectionOwnProps['tone']
  /** Espacio vertical. @default 'md' */
  spacing?: SectionOwnProps['spacing']
  /** Ancho del contenido. @default 'xl' */
  containerSize?: ContainerOwnProps['size']
  /** `id` de la sección (anclas: `#servicios`). El título recibe `{id}-title`. */
  id?: string
  className?: string
  style?: CSSProperties
}

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)

/**
 * `id` estable para el título, sin hooks (los bloques funcionan en Server Components): del `id`
 * de la sección o del propio título si es texto.
 */
export function blockTitleId(id?: string, title?: ReactNode): string | undefined {
  if (id) return `${id}-title`
  if (typeof title === 'string' && title.trim()) return `bl-${slugify(title)}`
  return undefined
}

/** Nivel de los títulos de los elementos del bloque (uno por debajo del de la sección). */
export function itemHeadingLevel(level: 2 | 3 = 2): 3 | 4 {
  return level === 2 ? 3 : 4
}

type BlockSectionProps = BlockBaseProps & {
  children: ReactNode
  /** Clase del bloque (se añade a la sección). */
  blockClassName?: string
  /** Tamaño visual del título. */
  titleSize?: HeadingSize
  /** Separación entre cabecera y contenido. @default 'lg' */
  gap?: 'md' | 'lg'
  /** Atributos `data-*` del bloque (variante…). */
  data?: Record<string, string | undefined>
}

/** Sección + contenedor + cabecera: el esqueleto común de los bloques. */
export function BlockSection({
  eyebrow,
  title,
  description,
  actions,
  align = 'start',
  headingLevel = 2,
  tone,
  spacing,
  containerSize = 'xl',
  id,
  className,
  style,
  children,
  blockClassName,
  titleSize,
  gap = 'lg',
  data,
}: BlockSectionProps) {
  const titleId = title ? blockTitleId(id, title) : undefined
  return (
    <Section
      id={id}
      tone={tone}
      spacing={spacing}
      className={cx(blockClassName, className)}
      style={style}
      aria-labelledby={titleId}
      {...data}
    >
      <Container size={containerSize} className={styles.stack} data-gap={gap}>
        {title && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            actions={actions}
            align={align}
            headingLevel={headingLevel}
            size={titleSize}
            titleId={titleId}
          />
        )}
        {children}
      </Container>
    </Section>
  )
}

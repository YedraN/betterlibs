import type { ReactNode } from 'react'
import { Container } from '../../components/Container/Container'
import { Section } from '../../components/Section/Section'
import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { cx } from '../../utils/cx'
import { type BlockBaseProps, blockTitleId } from '../shared'
import styles from './Hero.module.css'
import { HeroVideo, type HeroVideoProps } from './HeroVideo'

export type HeroProps = Omit<BlockBaseProps, 'headingLevel' | 'title'> & {
  /** Titular: la promesa principal de la página, en una frase. */
  title: ReactNode
  /**
   * - `centered`: texto centrado, ideal para portadas sin imagen o con imagen debajo.
   * - `split`: texto a un lado e imagen al otro (se apila en móvil).
   * - `background`: imagen o vídeo a sangre de fondo con capa oscura para asegurar el contraste.
   * @default 'split'
   */
  variant?: 'centered' | 'split' | 'background'
  /** Imagen o ilustración. En `background` es el fondo (usa `alt=""`: es decorativa). */
  media?: ReactNode
  /** Lado de la imagen en `split`. @default 'end' */
  mediaPosition?: 'start' | 'end'
  /** Vídeo de fondo decorativo (solo `background`): silenciado, en bucle y con pausa. */
  video?: HeroVideoProps
  /** Contenido extra bajo las acciones: clientes, valoraciones, avales. */
  children?: ReactNode
  /** Nivel del titular. Solo debe haber un `h1` por página. @default 1 */
  headingLevel?: 1 | 2
  /** Altura y tamaño del titular. @default 'md' */
  size?: 'md' | 'lg'
  /**
   * Marco de la imagen en `split` y `centered`: `framed` la presenta como una ventana elevada
   * con borde de luz y resplandor detrás (ideal para capturas de producto); `plain`, tal cual.
   * @default 'framed'
   */
  mediaStyle?: 'framed' | 'plain'
}

/**
 * Cabecera principal de una página: titular, entradilla, llamadas a la acción e imagen o vídeo.
 * El titular es un `h1` por defecto.
 */
export function Hero({
  title,
  eyebrow,
  description,
  actions,
  variant = 'split',
  media,
  mediaPosition = 'end',
  video,
  children,
  headingLevel = 1,
  size = 'md',
  mediaStyle = 'framed',
  align,
  tone,
  background: decoration = 'glow',
  spacing = 'lg',
  containerSize = 'xl',
  id,
  className,
  style,
}: HeroProps) {
  const titleId = blockTitleId(id, title)
  const background = variant === 'background'
  const header = (
    <div className={styles.text}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
        headingLevel={headingLevel}
        size={size === 'lg' ? '6xl' : headingLevel === 1 ? '5xl' : '4xl'}
        align={align ?? (variant === 'split' ? 'start' : 'center')}
        titleId={titleId}
        className={styles.header}
      />
      {children && <div className={styles.extra}>{children}</div>}
    </div>
  )

  return (
    <Section
      id={id}
      tone={background ? 'dark' : tone}
      spacing={spacing}
      background={background ? 'none' : decoration}
      className={cx(styles.root, className)}
      style={style}
      aria-labelledby={titleId}
      data-variant={variant}
      data-size={size}
      data-media-position={mediaPosition}
      data-media-style={mediaStyle}
      data-align={align ?? (variant === 'split' ? 'start' : 'center')}
    >
      {background && (media || video) && (
        <div className={styles.backdrop}>
          {video ? <HeroVideo {...video} /> : media}
          <div className={styles.overlay} aria-hidden="true" />
        </div>
      )}
      <Container size={containerSize} className={styles.inner}>
        {header}
        {!background && media && <div className={styles.media}>{media}</div>}
      </Container>
    </Section>
  )
}

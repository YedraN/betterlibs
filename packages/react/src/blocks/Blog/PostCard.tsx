import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { cx } from '../../utils/cx'
import blockStyles from '../Block.module.css'
import styles from './Blog.module.css'

export type Post = {
  title: ReactNode
  href: string
  excerpt?: ReactNode
  /** Imagen de portada. Suele ser decorativa (`alt` vacío) porque el título ya describe el post. */
  image?: {
    src: string
    alt?: string
    /** Versiones de distintos anchos (`srcset`) para no descargar de más en móvil. */
    srcSet?: string
    /** Ancho que ocupa la imagen (`sizes`). @default '(min-width: 48em) 33vw, 100vw' */
    sizes?: string
  }
  /** Fecha de publicación (ISO `2026-09-12` o `Date`). */
  date?: string | Date
  category?: ReactNode
  author?: { name: string; avatar?: string }
  /** «5 min de lectura». */
  readingTime?: ReactNode
}

export type PostCardProps = Omit<ComponentPropsWithRef<'article'>, 'title'> &
  Post & {
    /** `vertical` (imagen arriba) u `horizontal` (imagen a un lado). @default 'vertical' */
    layout?: 'vertical' | 'horizontal'
    /** Tamaño del título: `lg` para un artículo destacado. @default 'md' */
    size?: 'md' | 'lg'
    /** @default 3 */
    headingLevel?: 2 | 3 | 4
    /** Componente de enlace de tu router. @default 'a' */
    linkAs?: ElementType
    /** Formato de la fecha. @default { dateStyle: 'long' } en español */
    dateFormat?: Intl.DateTimeFormatOptions
  }

/** Fecha legible en español, igual en servidor y cliente (se formatea en UTC). */
export function formatPostDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}) {
  const value = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es', { dateStyle: 'long', timeZone: 'UTC', ...options }).format(
    value,
  )
}

/**
 * Tarjeta de artículo: toda la tarjeta es clicable, pero solo el título es un enlace (un único
 * elemento en el orden de tabulación). La fecha va en `<time datetime>`.
 */
export function PostCard({
  title,
  href,
  excerpt,
  image,
  date,
  category,
  author,
  readingTime,
  layout = 'vertical',
  size = 'md',
  headingLevel = 3,
  linkAs: LinkComponent = 'a',
  dateFormat,
  className,
  ...props
}: PostCardProps) {
  const Title = `h${headingLevel}` as const
  const isoDate = date ? (typeof date === 'string' ? date : date.toISOString()) : undefined
  return (
    <article
      className={cx(styles.card, blockStyles.linkedCard, className)}
      data-layout={layout}
      data-size={size}
      {...props}
    >
      {image && (
        <div className={styles.image}>
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.srcSet ? (image.sizes ?? '(min-width: 48em) 33vw, 100vw') : undefined}
            alt={image.alt ?? ''}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className={styles.body}>
        {category && <p className={styles.category}>{category}</p>}
        <Title className={styles.title}>
          <LinkComponent href={href} className={blockStyles.cardLink}>
            {title}
          </LinkComponent>
        </Title>
        {excerpt && <div className={styles.excerpt}>{excerpt}</div>}
        {(author || date || readingTime) && (
          <div className={styles.meta}>
            {author && (
              <span className={styles.author}>
                <Avatar src={author.avatar} name={author.name} alt="" size="xs" />
                {author.name}
              </span>
            )}
            {date && isoDate && <time dateTime={isoDate}>{formatPostDate(date, dateFormat)}</time>}
            {readingTime && <span>{readingTime}</span>}
          </div>
        )}
      </div>
    </article>
  )
}

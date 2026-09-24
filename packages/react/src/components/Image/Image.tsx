import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import type { CSSVars } from '../../utils/types'
import styles from './Image.module.css'

export type ImageProps = Omit<ComponentPropsWithRef<'img'>, 'alt'> & {
  /**
   * Texto alternativo (obligatorio). Describe lo que aporta la imagen, no «imagen de…».
   * Usa `alt=""` si es puramente decorativa.
   */
  alt: string
  /** Proporción reservada antes de cargar (`16 / 9`, `4 / 3`, `1`). Evita saltos de contenido. */
  ratio?: number
  /** Cómo encaja la imagen en su caja. @default 'cover' */
  fit?: 'cover' | 'contain'
  /** Radio de las esquinas. */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Pie de foto visible. Envuelve la imagen en `<figure>`. */
  caption?: ReactNode
  /**
   * Imagen principal visible al cargar la página (p. ej. la del hero):
   * se carga con prioridad en lugar de en diferido.
   */
  priority?: boolean
}

/**
 * Imagen con carga diferida por defecto, espacio reservado y pie de foto opcional.
 * En Next.js puedes seguir usando `next/image`; este componente cubre el resto de casos.
 */
export function Image({
  alt,
  ratio,
  fit = 'cover',
  radius,
  caption,
  priority = false,
  className,
  style,
  ...props
}: ImageProps) {
  const img = (
    <img
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={cx(styles.root, !caption && className)}
      data-fit={fit}
      style={
        {
          '--_ratio': ratio,
          '--_radius': radius ? `var(--bl-radius-${radius})` : undefined,
          ...(caption ? {} : style),
        } as CSSVars
      }
      {...props}
    />
  )
  if (!caption) return img
  return (
    <figure className={cx(styles.figure, className)} style={style}>
      {img}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}

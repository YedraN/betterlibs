'use client'

import { UserIcon } from '@betterlibs/icons'
import {
  Children,
  type ComponentPropsWithRef,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import styles from './Avatar.module.css'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const AvatarGroupContext = createContext<AvatarSize | undefined>(undefined)

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** URL de la foto. Si falla o no existe, se muestran las iniciales. */
  src?: string
  /** Nombre de la persona: genera las iniciales y el texto alternativo. */
  name?: string
  /** Texto alternativo de la foto. Por defecto, `name`. Usa `''` si el nombre ya aparece al lado. */
  alt?: string
  /** @default 'md' */
  size?: AvatarSize
  /** @default 'circle' */
  shape?: 'circle' | 'square'
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Foto o iniciales de una persona u organización (equipo, testimonios, autores). */
export function Avatar({
  src,
  name,
  alt,
  size,
  shape = 'circle',
  className,
  ...props
}: AvatarProps) {
  const groupSize = useContext(AvatarGroupContext)
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src && failedSrc !== src
  const label = alt ?? name
  return (
    <span
      className={cx(styles.root, className)}
      data-size={size ?? groupSize ?? 'md'}
      data-shape={shape}
      {...(!showImage && label ? { role: 'img', 'aria-label': label } : {})}
      {...(!showImage && !label ? { 'aria-hidden': true } : {})}
      {...props}
    >
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt={label ?? ''}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      ) : name ? (
        <span aria-hidden="true">{initials(name)}</span>
      ) : (
        <UserIcon aria-hidden="true" className={styles.icon} />
      )}
    </span>
  )
}

export type AvatarGroupProps = ComponentPropsWithRef<'div'> & {
  /** Número máximo de avatares visibles; el resto se resume en «+N». */
  max?: number
  /** Tamaño aplicado a todos los avatares. @default 'md' */
  size?: AvatarSize
  /** Texto accesible del contador. @default (n) => `y ${n} más` */
  moreLabel?: (count: number) => string
  children: ReactNode
}

/** Avatares superpuestos para mostrar un equipo o un grupo de clientes. */
export function AvatarGroup({
  max,
  size = 'md',
  moreLabel = (n) => `y ${n} más`,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement)
  const visible = max ? items.slice(0, max) : items
  const hidden = items.length - visible.length
  return (
    <div className={cx(styles.group, className)} data-size={size} {...props}>
      <AvatarGroupContext.Provider value={size}>
        {visible}
        {hidden > 0 && (
          <span
            className={cx(styles.root, styles.more)}
            data-size={size}
            data-shape="circle"
            role="img"
            aria-label={moreLabel(hidden)}
          >
            <span aria-hidden="true">+{hidden}</span>
          </span>
        )}
      </AvatarGroupContext.Provider>
    </div>
  )
}

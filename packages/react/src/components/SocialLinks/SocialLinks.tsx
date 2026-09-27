import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  XIcon,
  YouTubeIcon,
} from '@betterlibs/icons'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './SocialLinks.module.css'

export type SocialNetwork =
  | 'linkedin'
  | 'x'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'github'
  | 'email'

export type SocialLink = {
  network: SocialNetwork
  href: string
  /** Nombre accesible. Por defecto, el de la red («LinkedIn»). */
  label?: string
  /** Icono propio (p. ej. el logotipo oficial de la red). */
  icon?: ReactNode
}

export type SocialLinksProps = Omit<ComponentPropsWithRef<'ul'>, 'children'> & {
  links: SocialLink[]
  /** @default 'md' */
  size?: 'sm' | 'md'
  /**
   * Abre los perfiles en otra pestaña (se anuncia a los lectores de pantalla).
   * @default false
   */
  newTab?: boolean
  /** Texto añadido al nombre si se abre en otra pestaña. @default '(se abre en una pestaña nueva)' */
  newTabLabel?: string
}

const networks: Record<SocialNetwork, { label: string; Icon: typeof LinkedInIcon }> = {
  linkedin: { label: 'LinkedIn', Icon: LinkedInIcon },
  x: { label: 'X (Twitter)', Icon: XIcon },
  instagram: { label: 'Instagram', Icon: InstagramIcon },
  facebook: { label: 'Facebook', Icon: FacebookIcon },
  youtube: { label: 'YouTube', Icon: YouTubeIcon },
  github: { label: 'GitHub', Icon: GitHubIcon },
  email: { label: 'Email', Icon: MailIcon },
}

/**
 * Enlaces a redes sociales con icono y nombre accesible («LinkedIn»). Objetivos táctiles de
 * 44px (`md`) o 36px (`sm`).
 */
export function SocialLinks({
  links,
  size = 'md',
  newTab = false,
  newTabLabel = '(se abre en una pestaña nueva)',
  className,
  ...props
}: SocialLinksProps) {
  return (
    <ul className={cx(styles.root, className)} data-size={size} {...props}>
      {links.map((link) => {
        const { label: defaultLabel, Icon } = networks[link.network]
        const label = link.label ?? defaultLabel
        return (
          <li key={`${link.network}-${link.href}`}>
            <a
              href={link.href}
              className={styles.link}
              aria-label={newTab ? `${label} ${newTabLabel}` : label}
              title={label}
              {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.icon ?? <Icon aria-hidden="true" />}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

import type { ReactNode } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Grid } from '../../components/Grid/Grid'
import {
  type SocialLink,
  SocialLinks,
  socialNetworkLabels,
} from '../../components/SocialLinks/SocialLinks'
import type { Responsive } from '../../utils/types'
import { type BlockBaseProps, BlockSection, itemHeadingLevel } from '../shared'
import styles from './TeamGrid.module.css'

export type TeamMember = {
  name: string
  role?: ReactNode
  /** URL de la foto. Sin foto se muestran las iniciales. */
  photo?: string
  /** Biografía breve (solo en `cards`). */
  bio?: ReactNode
  /** Perfiles profesionales (LinkedIn…). */
  links?: SocialLink[]
}

export type TeamGridProps = BlockBaseProps & {
  members: TeamMember[]
  /**
   * - `cards`: foto grande, nombre, cargo, biografía y redes.
   * - `compact`: avatar pequeño con nombre y cargo en línea (equipos grandes).
   * @default 'cards'
   */
  variant?: 'cards' | 'compact'
  /** @default { base: 1, sm: 2, lg: 4 } (o { base: 1, sm: 2, lg: 3 } en `compact`) */
  columns?: Responsive<number>
}

/**
 * Equipo o personas de contacto. Las fotos llevan `alt=""` porque el nombre aparece justo al lado
 * (se evita que se lea dos veces).
 */
export function TeamGrid({
  members,
  variant = 'cards',
  columns,
  headingLevel = 2,
  ...block
}: TeamGridProps) {
  const Name = `h${itemHeadingLevel(headingLevel)}` as const
  return (
    <BlockSection {...block} headingLevel={headingLevel}>
      <Grid
        as="ul"
        role="list"
        className={styles.list}
        columns={
          columns ?? (variant === 'compact' ? { base: 1, sm: 2, lg: 3 } : { base: 1, sm: 2, lg: 4 })
        }
        gap={variant === 'compact' ? '6' : '8'}
      >
        {members.map((member) => (
          <li key={member.name} className={styles.member} data-variant={variant}>
            {variant === 'cards' ? (
              <div className={styles.photo}>
                {member.photo ? (
                  <img src={member.photo} alt="" loading="lazy" decoding="async" />
                ) : (
                  <Avatar name={member.name} alt="" size="xl" />
                )}
              </div>
            ) : (
              <Avatar src={member.photo} name={member.name} alt="" size="lg" />
            )}
            <div className={styles.body}>
              <Name className={styles.name}>{member.name}</Name>
              {member.role && <p className={styles.role}>{member.role}</p>}
              {variant === 'cards' && member.bio && <div className={styles.bio}>{member.bio}</div>}
              {member.links && member.links.length > 0 && (
                <SocialLinks
                  size="sm"
                  className={styles.links}
                  links={member.links.map((link) => ({
                    ...link,
                    // Nombre único por persona: «Ana Pérez en LinkedIn», no «LinkedIn» repetido.
                    label: link.label ?? `${member.name} en ${socialNetworkLabels[link.network]}`,
                  }))}
                />
              )}
            </div>
          </li>
        ))}
      </Grid>
    </BlockSection>
  )
}

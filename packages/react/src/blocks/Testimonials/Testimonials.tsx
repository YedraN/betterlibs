import { QuoteIcon, StarIcon } from '@betterlibs/icons'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { Carousel } from '../../components/Carousel/Carousel'
import { Grid } from '../../components/Grid/Grid'
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden'
import { cx } from '../../utils/cx'
import type { Responsive } from '../../utils/types'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './Testimonials.module.css'

export type Testimonial = {
  /** La cita, en palabras del cliente. Mejor concreta y con un resultado. */
  quote: ReactNode
  name: string
  /** Cargo y empresa: «Directora financiera, Norte Industrial». */
  role?: ReactNode
  /** URL de la foto. Sin foto se muestran las iniciales. */
  avatar?: string
  /** Logo de la empresa (decorativo). */
  logo?: ReactNode
  /** Valoración de 1 a 5. */
  rating?: number
}

export type TestimonialCardProps = Omit<ComponentPropsWithRef<'figure'>, 'children' | 'role'> &
  Testimonial & {
    /** `featured`: cita grande y centrada. @default 'card' */
    variant?: 'card' | 'featured'
    /** @default (n) => `Valoración: ${n} de 5` */
    ratingLabel?: (rating: number) => string
  }

/** Testimonio: `<figure>` con la cita en `<blockquote>` y la autoría en `<figcaption>`. */
export function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  logo,
  rating,
  variant = 'card',
  ratingLabel = (n) => `Valoración: ${n} de 5`,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <figure className={cx(styles.card, className)} data-variant={variant} {...props}>
      {rating !== undefined ? (
        <p className={styles.rating}>
          <VisuallyHidden>{ratingLabel(rating)}</VisuallyHidden>
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              // biome-ignore lint/suspicious/noArrayIndexKey: posiciones fijas
              key={i}
              aria-hidden="true"
              className={styles.star}
              data-filled={i < Math.round(rating) || undefined}
            />
          ))}
        </p>
      ) : (
        <QuoteIcon className={styles.quoteIcon} aria-hidden="true" />
      )}
      <blockquote className={styles.quote}>
        {typeof quote === 'string' ? <p>{quote}</p> : quote}
      </blockquote>
      <figcaption className={styles.author}>
        <Avatar src={avatar} name={name} alt="" size={variant === 'featured' ? 'lg' : 'md'} />
        <span className={styles.authorText}>
          <span className={styles.name}>{name}</span>
          {role && <span className={styles.role}>{role}</span>}
        </span>
        {logo && (
          <span className={styles.logo} aria-hidden="true">
            {logo}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

export type TestimonialsProps = BlockBaseProps & {
  testimonials: Testimonial[]
  /**
   * - `grid`: todos a la vista en rejilla.
   * - `carousel`: en un carrusel accesible (sin autoplay).
   * - `featured`: un único testimonio grande (el primero).
   * @default 'grid'
   */
  variant?: 'grid' | 'carousel' | 'featured'
  /** @default { base: 1, md: 2, lg: 3 } */
  columns?: Responsive<number>
  /** Nombre del carrusel. @default 'Testimonios' */
  carouselLabel?: string
}

/** Testimonios de clientes en rejilla, carrusel o como cita destacada. */
export function Testimonials({
  testimonials,
  variant = 'grid',
  columns = { base: 1, md: 2, lg: 3 },
  carouselLabel = 'Testimonios',
  ...block
}: TestimonialsProps) {
  const [first] = testimonials
  return (
    <BlockSection
      {...block}
      align={block.align ?? (variant === 'featured' ? 'center' : undefined)}
      gap="md"
    >
      {variant === 'featured' && first ? (
        <TestimonialCard {...first} variant="featured" />
      ) : variant === 'carousel' ? (
        <Carousel label={carouselLabel} slidesPerView={columns}>
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} className={styles.fill} />
          ))}
        </Carousel>
      ) : (
        <Grid as="ul" role="list" columns={columns} className={styles.list}>
          {testimonials.map((item) => (
            <li key={item.name}>
              <TestimonialCard {...item} className={styles.fill} />
            </li>
          ))}
        </Grid>
      )}
    </BlockSection>
  )
}

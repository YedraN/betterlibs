import type { ElementType } from 'react'
import { Grid } from '../../components/Grid/Grid'
import type { Responsive } from '../../utils/types'
import { type BlockBaseProps, BlockSection, itemHeadingLevel } from '../shared'
import styles from './Blog.module.css'
import { type Post, PostCard } from './PostCard'

export type BlogGridProps = BlockBaseProps & {
  posts: Post[]
  /**
   * - `grid`: tarjetas en rejilla.
   * - `list`: una columna con la imagen a un lado (listados largos).
   * - `featured`: el primer artículo grande y el resto en rejilla.
   * @default 'grid'
   */
  variant?: 'grid' | 'list' | 'featured'
  /** @default { base: 1, md: 2, lg: 3 } */
  columns?: Responsive<number>
  /** Componente de enlace de tu router. @default 'a' */
  linkAs?: ElementType
}

/** Últimos artículos del blog, noticias o recursos. */
export function BlogGrid({
  posts,
  variant = 'grid',
  columns = { base: 1, md: 2, lg: 3 },
  linkAs,
  headingLevel = 2,
  ...block
}: BlogGridProps) {
  const level = itemHeadingLevel(headingLevel)
  const [first, ...rest] = posts
  const card = (post: Post, index: number, layout: 'vertical' | 'horizontal' = 'vertical') => (
    <li key={`${post.href}-${index}`}>
      <PostCard
        {...post}
        layout={layout}
        headingLevel={level}
        linkAs={linkAs}
        className={styles.fill}
      />
    </li>
  )

  return (
    <BlockSection {...block} headingLevel={headingLevel}>
      {variant === 'list' ? (
        <ul className={styles.list}>
          {posts.map((post, index) => card(post, index, 'horizontal'))}
        </ul>
      ) : variant === 'featured' && first ? (
        <div className={styles.featuredLayout}>
          <PostCard {...first} layout="horizontal" size="lg" headingLevel={level} linkAs={linkAs} />
          {rest.length > 0 && (
            <Grid as="ul" role="list" columns={columns} className={styles.list}>
              {rest.map((post, index) => card(post, index))}
            </Grid>
          )}
        </div>
      ) : (
        <Grid as="ul" role="list" columns={columns} className={styles.list}>
          {posts.map((post, index) => card(post, index))}
        </Grid>
      )}
    </BlockSection>
  )
}

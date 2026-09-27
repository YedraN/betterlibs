import { CopyIcon, LinkedInIcon, MailIcon, ShareIcon, XIcon } from '@betterlibs/icons'
import {
  Avatar,
  Badge,
  BlogGrid,
  Breadcrumb,
  Button,
  Container,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  formatPostDate,
  Heading,
  Image,
  Newsletter,
  Prose,
  Stack,
  Text,
  toast,
} from '@betterlibs/react'
import { articles } from '../site/data'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'
import styles from './Article.module.css'
import { NotFoundPage } from './NotFound'

function ShareMenu({ title }: { title: string }) {
  const url = typeof window === 'undefined' ? '' : window.location.href
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" iconStart={<ShareIcon />}>
          Compartir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          icon={<CopyIcon />}
          onSelect={async () => {
            await navigator.clipboard?.writeText(url)
            toast.success('Enlace copiado')
          }}
        >
          Copiar enlace
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}>
            <MailIcon aria-hidden="true" /> Enviar por email
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon aria-hidden="true" /> LinkedIn (se abre en otra pestaña)
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon aria-hidden="true" /> X (se abre en otra pestaña)
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Plantilla 5b · Artículo del blog. */
export function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find((item) => item.slug === slug)
  usePageTitle(article ? String(article.title) : 'Artículo no encontrado')
  if (!article) return <NotFoundPage />

  const related = articles.filter((item) => item.slug !== slug).slice(0, 3)
  const date = article.date ? String(article.date) : undefined

  return (
    <>
      <article className={styles.article} aria-labelledby="article-title">
        <Container size="lg">
          <Stack gap="6" className={styles.header}>
            <Breadcrumb
              items={[
                { label: 'Inicio', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: String(article.title) },
              ]}
              linkAs={RouterLink}
            />
            <div>
              <Badge tone="accent">{article.category}</Badge>
            </div>
            <Heading id="article-title" level={1} size="5xl">
              {article.title}
            </Heading>
            <Text variant="lead">{article.excerpt}</Text>
            <div className={styles.meta}>
              {article.author && (
                <Stack direction="row" gap="3" align="center">
                  <Avatar src={article.author.avatar} name={article.author.name} alt="" />
                  <div>
                    <Text weight="semibold">{article.author.name}</Text>
                    <Text size="sm" tone="muted">
                      {date && <time dateTime={date}>{formatPostDate(date)}</time>} ·{' '}
                      {article.readingTime}
                    </Text>
                  </div>
                </Stack>
              )}
              <ShareMenu title={String(article.title)} />
            </div>
          </Stack>
          {article.image && (
            <Image
              src={article.image.src}
              alt=""
              ratio={16 / 9}
              radius="2xl"
              priority
              className={styles.cover}
            />
          )}
          <div className={styles.layout}>
            {article.toc && article.toc.length > 0 ? (
              <nav className={styles.toc} aria-labelledby="toc-title">
                <p id="toc-title" className={styles.tocTitle}>
                  En este artículo
                </p>
                <ol>
                  {article.toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : (
              <div />
            )}
            <Prose size="lg">{article.body}</Prose>
          </div>
        </Container>
      </article>
      <BlogGrid tone="subtle" title="Sigue leyendo" posts={related} linkAs={RouterLink} />
      <Newsletter
        title="¿Te ha resultado útil?"
        description="Recibe un email al mes con lo más útil del blog."
        align="center"
        onSubscribe={() => new Promise((resolve) => setTimeout(resolve, 800))}
        privacyNote="Responsable: Norte Consultores S.L. Finalidad: enviarte el boletín. Puedes darte de baja en cualquier momento."
      />
    </>
  )
}

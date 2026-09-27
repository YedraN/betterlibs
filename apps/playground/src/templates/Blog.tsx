import { BlogGrid, Container, Newsletter, Pagination, Stack, Tag, toast } from '@betterlibs/react'
import { useRef, useState } from 'react'
import { articles } from '../site/data'
import { PageHeader } from '../site/PageHeader'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'

const PAGE_SIZE = 4
const categories = ['Todas', ...new Set(articles.map((article) => String(article.category)))]

/** Plantilla 5a · Listado del blog, con filtro por categoría y paginación. */
export function BlogPage() {
  usePageTitle('Blog')
  const [category, setCategory] = useState('Todas')
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered =
    category === 'Todas' ? articles : articles.filter((article) => article.category === category)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Al cambiar de página o de filtro, el foco va al principio del listado.
  const focusList = () => {
    requestAnimationFrame(() => {
      const heading = listRef.current?.querySelector<HTMLElement>('h2')
      if (!heading) return
      heading.tabIndex = -1
      heading.focus()
    })
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Blog' }]}
        eyebrow="Blog"
        title="Ideas para gestionar mejor tu empresa"
        description="Novedades fiscales, consejos de gestión y casos reales, explicados sin jerga."
        spacing="sm"
      />
      <Container>
        <Stack
          as="ul"
          direction="row"
          gap="2"
          wrap
          aria-label="Filtrar por categoría"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {categories.map((item) => (
            <li key={item}>
              <Tag asChild selected={item === category}>
                <button
                  type="button"
                  aria-pressed={item === category}
                  onClick={() => {
                    setCategory(item)
                    setPage(1)
                  }}
                >
                  {item}
                </button>
              </Tag>
            </li>
          ))}
        </Stack>
      </Container>
      <div ref={listRef}>
        <BlogGrid
          title={
            category === 'Todas' ? 'Todos los artículos' : `Artículos de ${category.toLowerCase()}`
          }
          description={`${filtered.length} ${filtered.length === 1 ? 'artículo' : 'artículos'}`}
          variant={page === 1 && category === 'Todas' ? 'featured' : 'grid'}
          posts={visible}
          linkAs={RouterLink}
          spacing="sm"
        />
      </div>
      <Container>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(next) => {
            setPage(next)
            focusList()
          }}
        />
      </Container>
      <Newsletter
        variant="split"
        tone="subtle"
        title="Recibe los artículos en tu email"
        description="Un email al mes con lo más útil del blog. Sin publicidad."
        onSubscribe={async () => {
          await new Promise((resolve) => setTimeout(resolve, 800))
          toast.success('Suscripción completada')
        }}
        consentLabel={
          <>
            Acepto la <a href="/aviso-legal#privacidad">política de privacidad</a>
          </>
        }
      />
    </>
  )
}

import { Breadcrumb, type BreadcrumbItem, Container, Hero, type HeroProps } from '@betterlibs/react'
import { RouterLink } from './router'

export type PageHeaderProps = HeroProps & {
  /** Migas de pan después de «Inicio»; el último elemento es la página actual. */
  crumbs: BreadcrumbItem[]
}

/** Cabecera de las páginas interiores: migas de pan y un Hero compacto. */
export function PageHeader({ crumbs, ...hero }: PageHeaderProps) {
  return (
    <>
      <Container style={{ paddingBlockStart: 'var(--bl-space-6)' }}>
        <Breadcrumb
          items={[{ label: 'Inicio', href: '/' }, ...crumbs]}
          linkAs={RouterLink}
          schemaBaseUrl="https://norte.example"
        />
      </Container>
      <Hero variant="centered" spacing="md" {...hero} />
    </>
  )
}

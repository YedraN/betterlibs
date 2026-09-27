import { Button, Hero } from '@betterlibs/react'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'

/** Página no encontrada: explica qué ha pasado y ofrece salidas. */
export function NotFoundPage() {
  usePageTitle('Página no encontrada')
  return (
    <Hero
      variant="centered"
      eyebrow="Error 404"
      title="No encontramos esta página"
      description="Puede que la dirección esté mal escrita o que la página ya no exista."
      actions={
        <>
          <Button asChild>
            <RouterLink href="/">Ir a la portada</RouterLink>
          </Button>
          <Button asChild variant="outline">
            <RouterLink href="/contacto">Contactar</RouterLink>
          </Button>
        </>
      }
    />
  )
}

import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: {
    template: '%s · Betterlibs UI',
    default: 'Betterlibs UI — Componentes React para webs corporativas',
  },
  description:
    'Librería de componentes React accesible y adaptable a tu marca para webs corporativas y profesionales.',
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={{
            locale: 'es',
            translations: {
              search: 'Buscar',
              searchNoResult: 'Sin resultados',
              toc: 'En esta página',
              tocNoHeadings: 'Sin apartados',
              lastUpdate: 'Última actualización',
              chooseTheme: 'Tema',
              nextPage: 'Siguiente',
              previousPage: 'Anterior',
              editOnGithub: 'Editar en GitHub',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}

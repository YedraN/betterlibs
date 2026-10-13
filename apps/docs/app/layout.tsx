import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { spanishTranslations } from '@/lib/translations'
import '@fontsource-variable/inter'
import './global.css'

export const metadata: Metadata = {
  title: {
    template: '%s · Betterlibs UI',
    default: 'Betterlibs UI — Páginas con identidad y movimiento',
  },
  description:
    'Componentes React, secciones editoriales y movimiento opcional para construir páginas con identidad.',
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={{
            locale: 'es',
            translations: spanishTranslations,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}

import { MotionProvider } from '@betterlibs/motion'
import { SkipLink } from '@betterlibs/react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { PageEntry } from '../../../components/docs/page-entry'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      data-preset="editorial"
      style={{
        background: 'var(--bl-color-bg)',
        color: 'var(--bl-color-text)',
        padding: 'clamp(1rem, 4vw, 3rem)',
      }}
    >
      <MotionProvider>
        <SkipLink />
        <header>
          <nav
            aria-label="Ejemplo de navegación"
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <Link href="/ejemplos/navegacion">Primera página</Link>
            <Link href="/ejemplos/navegacion/segunda">Segunda página</Link>
            <Link href="/docs/guias/navegacion-de-paginas">Volver a la guía</Link>
          </nav>
        </header>
        <PageEntry>{children}</PageEntry>
      </MotionProvider>
    </div>
  )
}

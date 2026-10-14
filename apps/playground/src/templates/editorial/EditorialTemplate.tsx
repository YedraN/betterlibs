import { type MotionMode, MotionProvider, useMotionPreferences } from '@betterlibs/motion'
import { Button, Footer, Header, PortalProvider, SkipLink } from '@betterlibs/react'
import { type ReactNode, useEffect, useState } from 'react'
import { RouterLink } from '../../site/router'
import styles from './Templates.module.css'

const links = [
  { href: '/plantillas/producto', label: 'Producto' },
  { href: '/plantillas/estudio', label: 'Estudio' },
  { href: '/plantillas/articulo', label: 'Artículo' },
]
export function EditorialTemplate({
  pathname,
  children,
}: {
  pathname: string
  children: ReactNode
}) {
  const [mode, setMode] = useState<MotionMode>('system')
  const [theme, setTheme] = useState('system')
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  return (
    <MotionProvider mode={mode}>
      <div
        className={styles.page}
        data-preset="editorial"
        data-theme={theme === 'system' ? undefined : theme}
        data-motion={mode}
      >
        <PageMotion mode={mode} />
        <PortalProvider container={portal}>
          <SkipLink />
          <Header
            skipLink={false}
            logo={
              <RouterLink href="/" className={styles.brand} aria-label="Betterlibs, inicio">
                betterlibs<span>.</span>
              </RouterLink>
            }
            navigation={links}
            currentHref={pathname}
            linkAs={RouterLink}
            actions={
              <Button asChild size="sm" variant="outline">
                <RouterLink href="/">Ver la librería</RouterLink>
              </Button>
            }
          />
          <section className={styles.preferences} aria-label="Preferencias de la plantilla">
            <span className={styles.demoLabel}>
              Plantillas Betterlibs · contenido de demostración
            </span>
            <label>
              Tema{' '}
              <select value={theme} onChange={(event) => setTheme(event.target.value)}>
                <option value="system">Sistema</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </label>
            <label>
              Movimiento{' '}
              <select value={mode} onChange={(event) => setMode(event.target.value as MotionMode)}>
                <option value="system">Sistema</option>
                <option value="reduced">Reducido</option>
                <option value="off">Desactivado</option>
              </select>
            </label>
          </section>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer
            logo={<RouterLink href="/">betterlibs.</RouterLink>}
            description="Tres maneras de componer una web con identidad, usando los mismos fundamentos."
            columns={[{ title: 'Explora las plantillas', links }]}
            linkAs={RouterLink}
            legal={[{ href: '/', label: 'Volver a Betterlibs' }]}
            copyright="© 2026 Betterlibs · ejemplos editables"
          />
          <div
            ref={setPortal}
            data-preset="editorial"
            data-theme={theme === 'system' ? undefined : theme}
            data-motion={mode}
          />
        </PortalProvider>
      </div>
    </MotionProvider>
  )
}
function PageMotion({ mode }: { mode: MotionMode }) {
  const { prefersReduced } = useMotionPreferences()
  useEffect(() => {
    const previous = document.documentElement.getAttribute('data-motion')
    document.documentElement.dataset.motion = prefersReduced && mode === 'system' ? 'reduced' : mode
    return () => {
      if (previous === null) document.documentElement.removeAttribute('data-motion')
      else document.documentElement.setAttribute('data-motion', previous)
    }
  }, [mode, prefersReduced])
  return null
}

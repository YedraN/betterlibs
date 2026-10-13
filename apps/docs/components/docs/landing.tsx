'use client'

import { Button, Hero } from '@betterlibs/react'
import Link from 'next/link'
import examples from '@/generated/examples.json'
import { playgroundUrl, storybookUrl } from '@/lib/shared'
import { RevealExample } from './examples/reveal'
import styles from './landing.module.css'
import { Preview, useDocsTheme, usePreviewReplay } from './preview'

function LiveComposition() {
  return <RevealExample replayKey={usePreviewReplay()} />
}
const paths = [
  {
    title: 'Componentes',
    copy: 'Acciones, formularios y paneles con estados que puedes probar.',
    href: '/docs/componentes',
  },
  {
    title: 'Movimiento',
    copy: 'Entradas, lectura y continuidad opcionales, con preferencias compartidas.',
    href: '/docs/movimiento',
  },
  {
    title: 'Secciones',
    copy: 'Hero, bento, precios y contenido para componer una página.',
    href: '/docs/bloques',
  },
  {
    title: 'Páginas',
    copy: 'Producto, estudio y artículo: tres puntos de partida editables.',
    href: '/docs/recursos/plantillas',
  },
]
export function DocsLanding() {
  const theme = useDocsTheme()
  return (
    <div id="main" data-preset="editorial" data-theme={theme} className={styles.root}>
      <Hero
        id="docs-intro"
        variant="editorial"
        eyebrow="Betterlibs / UI y movimiento"
        title="Una web con identidad. Una base que funciona."
        description="Componentes, secciones y patrones de movimiento para dar forma a páginas React con carácter. Prueba los estados, mira el código y construye tu primera composición."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/docs/galeria">Explorar la galería</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs/primeros-pasos/instalacion">Empezar desde el proyecto</Link>
            </Button>
          </>
        }
        media={
          <section aria-labelledby="home-live-title">
            <h2 id="home-live-title" className={styles.liveTitle}>
              Prueba una composición
            </h2>
            <Preview
              label="Composición de portada"
              preset="editorial"
              controls
              replay
              code={examples.reveal}
            >
              <LiveComposition />
            </Preview>
          </section>
        }
      />
      <section className={styles.section} aria-labelledby="elige-ruta">
        <span className={styles.eyebrow}>De una pieza a una página</span>
        <h2 id="elige-ruta">Empieza por lo que necesitas.</h2>
        <div className={styles.grid}>
          {paths.map((path) => (
            <article key={path.title}>
              <h3>{path.title}</h3>
              <p>{path.copy}</p>
              <Link href={path.href}>Explorar {path.title.toLowerCase()} →</Link>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.section} aria-labelledby="primera-composicion">
        <h2 id="primera-composicion">Tu primera página, paso a paso.</h2>
        <ol className={styles.steps}>
          <li>
            <strong>Instala la base</strong>
            <p>
              Tokens y UI estática. Usa el checkout o los paquetes locales mientras se prepara la
              publicación.
            </p>
          </li>
          <li>
            <strong>Da forma al contenido</strong>
            <p>Aplica el preset editorial, tus fuentes y una estructura de títulos clara.</p>
          </li>
          <li>
            <strong>Añade el movimiento necesario</strong>
            <p>
              Elige entradas o cambios de estado. El contenido permanece visible al reducir los
              efectos.
            </p>
          </li>
        </ol>
        <Button asChild variant="outline">
          <Link href="/docs/primeros-pasos/primera-pagina">Montar la primera página</Link>
        </Button>
      </section>
      <section className={styles.band} aria-labelledby="estado-docs">
        <h2 id="estado-docs">Código para probar hoy. Publicación en preparación.</h2>
        <p>
          La librería se puede desarrollar y consumir desde el monorepo. La validación entre
          motores, las referencias visuales y las mediciones de rendimiento del rediseño pertenecen
          al cierre de calidad.
        </p>
        <div>
          <Link href="/docs/recursos/calidad">Ver comprobaciones y límites</Link>
          <a href={storybookUrl}>Abrir Storybook</a>
          <a href={`${playgroundUrl}/plantillas/producto`}>Explorar la plantilla de producto</a>
        </div>
      </section>
    </div>
  )
}

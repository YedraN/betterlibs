'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import examples from '@/generated/examples.json'
import { playgroundUrl } from '@/lib/shared'
import { ButtonsExample } from './examples/buttons'
import { DialogExample } from './examples/dialog'
import { FormExample } from './examples/form'
import { PresenceExample } from './examples/presence'
import { RevealExample } from './examples/reveal'
import { SectionsExample } from './examples/sections'
import styles from './gallery.module.css'
import { Preview, usePreviewReplay } from './preview'

const catalog = [
  {
    id: 'buttons',
    title: 'Acciones y estados',
    category: 'Componentes',
    description: 'Confirmación, foco y deshabilitado.',
    href: '/docs/componentes/acciones/button',
    render: () => <ButtonsExample />,
  },
  {
    id: 'form',
    title: 'Formulario y borrador',
    category: 'Componentes',
    description: 'Validación, error y confirmación sin perder lo escrito.',
    href: '/docs/componentes/formularios/form',
    render: () => <FormExample />,
  },
  {
    id: 'dialog',
    title: 'Diálogo con contexto',
    category: 'Componentes',
    description: 'Portal, Escape y retorno de foco.',
    href: '/docs/componentes/overlays/dialog',
    render: () => <DialogExample />,
  },
  {
    id: 'reveal',
    title: 'Entradas con ritmo',
    category: 'Movimiento',
    description: 'Líneas, secuencia y cifras con HTML inicial visible.',
    href: '/docs/movimiento/reveal',
    render: () => <ReplayExample />,
  },
  {
    id: 'presence',
    title: 'Contenido condicional',
    category: 'Movimiento',
    description: 'Salida inerte y borrador conservado al reabrir.',
    href: '/docs/movimiento/presence',
    render: () => <PresenceExample />,
  },
  {
    id: 'sections',
    title: 'De piezas a una página',
    category: 'Secciones',
    description: 'Hero editorial, bento y CTA de contraste.',
    href: '/docs/bloques/editoriales',
    render: () => <SectionsExample />,
  },
] as const
const templates = [
  {
    id: 'producto',
    title: 'Producto',
    description: 'Tablero, planes y formulario.',
    color: '#ddef94',
  },
  { id: 'estudio', title: 'Estudio', description: 'Casos, proceso y equipo.', color: '#d0dbdf' },
  {
    id: 'articulo',
    title: 'Artículo',
    description: 'Índice y progreso de lectura.',
    color: '#ece7db',
  },
]
function ReplayExample() {
  return <RevealExample replayKey={usePreviewReplay()} />
}
export function Gallery() {
  const [category, setCategory] = useState('Todo')
  const [query, setQuery] = useState('')
  const search = useRef<HTMLInputElement>(null)
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase('es')
      .trim()
  const normalized = normalize(query)
  const matches = (title: string, description: string) =>
    normalize(`${title} ${description}`).includes(normalized)
  const visible = catalog.filter(
    (item) =>
      (category === 'Todo' || category === item.category) && matches(item.title, item.description),
  )
  const pages = templates.filter(
    (item) =>
      (category === 'Todo' || category === 'Páginas') && matches(item.title, item.description),
  )
  return (
    <div className={`not-prose ${styles.gallery}`}>
      <noscript>
        Los ejemplos, su código y los enlaces están disponibles. Activa JavaScript para usar los
        filtros, los controles y las interacciones.
      </noscript>
      <div className={styles.filters}>
        <label>
          Buscar ejemplos
          <input
            ref={search}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Formulario, ritmo, artículo…"
          />
        </label>
        <div className={styles.categories} role="group" aria-label="Filtrar por uso">
          {['Todo', 'Componentes', 'Movimiento', 'Secciones', 'Páginas'].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {(query || category !== 'Todo') && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('Todo')
              search.current?.focus({ preventScroll: true })
            }}
          >
            Limpiar filtros
          </button>
        )}
        <p role="status">
          {visible.length + pages.length}{' '}
          {visible.length + pages.length === 1 ? 'ejemplo disponible.' : 'ejemplos disponibles.'}
        </p>
      </div>
      {visible.length + pages.length === 0 && (
        <p>No hay ejemplos para esta búsqueda. Prueba otra palabra o selecciona Todo.</p>
      )}
      {visible.map((item) => (
        <section key={item.id} aria-labelledby={`gallery-${item.id}`} className={styles.entry}>
          <div className={styles.heading}>
            <div>
              <span className={styles.category}>{item.category}</span>
              <h2 id={`gallery-${item.id}`}>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <Link href={item.href}>Consultar la API →</Link>
          </div>
          <Preview
            label={item.title}
            preset="editorial"
            controls
            replay={item.id === 'reveal'}
            code={examples[item.id]}
            padded={item.id !== 'sections'}
          >
            {item.render()}
          </Preview>
        </section>
      ))}
      {pages.length > 0 && (
        <section aria-labelledby="gallery-pages">
          <h2 id="gallery-pages">Páginas completas</h2>
          <div className={styles.pages}>
            {pages.map((item) => (
              <article key={item.id}>
                <div className={styles.cover} style={{ background: item.color }} aria-hidden="true">
                  <span>{item.title.slice(0, 1)}</span>
                  <div />
                  <div />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href={`${playgroundUrl}/plantillas/${item.id}`}>
                  Explorar {item.title.toLowerCase()} →
                </a>
              </article>
            ))}
          </div>
          <p>
            Las plantillas se abren en el playground.{' '}
            <Link href="/docs/recursos/plantillas">
              Código, imágenes y ruta de cada composición
            </Link>
            .
          </p>
        </section>
      )}
    </div>
  )
}

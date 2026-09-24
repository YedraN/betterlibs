import Link from 'next/link'
import { storybookUrl } from '@/lib/shared'

const principles = [
  {
    title: 'Accesible por defecto',
    text: 'WCAG 2.2 AA: teclado, foco visible, contraste verificado y ARIA correcto en cada componente.',
  },
  {
    title: 'Tu marca, no la nuestra',
    text: 'Un color de marca y createTheme() genera un tema completo, claro y oscuro, con contraste garantizado.',
  },
  {
    title: 'Pensada para webs corporativas',
    text: 'Secciones, rejillas, tipografía fluida y bloques listos para home, servicios, equipo o contacto.',
  },
  {
    title: 'Sin runtime de estilos',
    text: 'CSS Modules y variables CSS: compatible con SSR y React Server Components, y tree-shakeable.',
  },
]

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-20">
      <section className="flex flex-col gap-6">
        <p className="text-sm font-semibold tracking-wide text-fd-primary uppercase">
          Librería de componentes React
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Webs corporativas accesibles, con tu marca, en menos tiempo.
        </h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Betterlibs UI reúne componentes, bloques y guías para construir páginas profesionales que
          se entienden a la primera y funcionan para todo el mundo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/primeros-pasos/instalacion"
            className="rounded-lg bg-fd-primary px-5 py-3 font-semibold text-fd-primary-foreground"
          >
            Empezar
          </Link>
          <Link href="/docs" className="rounded-lg border px-5 py-3 font-semibold">
            Leer la documentación
          </Link>
          <a
            href={storybookUrl}
            className="rounded-lg px-5 py-3 font-semibold underline-offset-4 hover:underline"
          >
            Ver en Storybook
          </a>
        </div>
      </section>
      <section aria-labelledby="principios" className="flex flex-col gap-6">
        <h2 id="principios" className="text-2xl font-semibold">
          Principios
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <li key={p.title} className="rounded-xl border bg-fd-card p-6">
              <h3 className="mb-2 font-semibold">{p.title}</h3>
              <p className="text-fd-muted-foreground">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Primera página · Navegación' }
export default function Page() {
  return (
    <>
      <h1>Primera página</h1>
      <p>
        Contenido de servidor visible antes de hidratar. Los enlaces mantienen el router de Next.
      </p>
      <Link href="/ejemplos/navegacion/segunda#destino">Ir al apartado de la segunda página</Link>
      <section style={{ minHeight: '120vh', paddingBlock: '3rem' }}>
        <h2>Una página con espacio para leer</h2>
        <p>
          Desplázate, abre la otra página y vuelve atrás para comprobar la restauración del scroll.
        </p>
      </section>
      <Link href="/ejemplos/navegacion/segunda">Continuar a la segunda página</Link>
    </>
  )
}

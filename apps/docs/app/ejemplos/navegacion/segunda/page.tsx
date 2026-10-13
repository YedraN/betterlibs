import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Segunda página · Navegación' }
export default function Page() {
  return (
    <>
      <h1>Segunda página</h1>
      <p>
        La entrada acompaña al cambio de ruta. Reducir el movimiento conserva la navegación
        inmediata.
      </p>
      <div style={{ minHeight: '110vh' }} />
      <section>
        <h2 id="destino" tabIndex={-1}>
          Destino de la segunda página
        </h2>
        <p>El enlace con ancla utiliza el scroll del framework; la receta solo orienta el foco.</p>
        <Link href="/ejemplos/navegacion">Volver a la primera página</Link>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { DocsLanding } from '@/components/docs/landing'

export const metadata: Metadata = {
  title: 'Betterlibs — UI y movimiento para webs con identidad',
  description:
    'Prueba componentes, secciones y movimiento opcional. Copia ejemplos y monta una página React con identidad.',
}
export default function HomePage() {
  return <DocsLanding />
}

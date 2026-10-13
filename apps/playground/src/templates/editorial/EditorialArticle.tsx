import { ScrollProgress, TextReveal } from '@betterlibs/motion'
import { Button, Container } from '@betterlibs/react'
import { useRef } from 'react'
import { RouterLink } from '../../site/router'
import { usePageTitle } from '../../site/SiteLayout'
import styles from './Templates.module.css'

const sections = [
  {
    id: 'jerarquia',
    title: 'Empieza por lo que importa',
    paragraphs: [
      'Una página no necesita decirlo todo a la vez. Necesita dar al lector un punto de entrada y una razón para seguir. Antes de escoger una tipografía, escribe en una frase qué debería entender una persona al terminar la visita.',
      'Esa frase ayuda a ordenar el contenido. El título plantea la idea, la entradilla ofrece contexto y las secciones desarrollan lo que hace falta para tomar una decisión. Si dos bloques compiten por la misma atención, revisa la jerarquía antes de añadir otro efecto.',
      'Prueba el esquema con el contenido más largo que esperas recibir. Una tarjeta con dos palabras casi siempre parece equilibrada. Una con un título de tres líneas, una fecha y un enlace revela si el sistema tiene espacio para la realidad.',
    ],
  },
  {
    id: 'ritmo',
    title: 'El espacio también cuenta',
    paragraphs: [
      'El ritmo aparece en la relación entre lo que se repite y lo que cambia. Los márgenes, las líneas de texto y la distancia entre secciones permiten reconocer una estructura sin tener que pensar en ella.',
      'Usa pocas escalas y dales una función. Un espacio corto une una etiqueta a su campo; uno medio agrupa el contenido de una tarjeta; uno amplio señala el comienzo de otra idea. Cuando cada distancia significa algo, la página se vuelve más fácil de recorrer.',
      'En una pantalla estrecha el orden sigue importando. Revisa la lectura de arriba abajo y evita que el contenido principal quede enterrado bajo una ilustración enorme. El mismo sistema debe soportar texto ampliado sin exigir desplazamiento horizontal.',
    ],
  },
  {
    id: 'movimiento',
    title: 'Mover para explicar',
    paragraphs: [
      'Una transición puede ayudar a entender que un panel se ha abierto o que una tarjeta ha cambiado de posición. Su valor está en esa continuidad. No hace falta animar cada palabra para que una interfaz tenga personalidad.',
      'Empieza por efectos breves sobre opacidad y posición. Conserva el contenido visible antes de que cargue el código. Si un usuario desactiva el movimiento, presenta inmediatamente el mismo resultado y mantén operativas todas las acciones.',
      'El progreso de lectura es información, no una escena animada. Puede seguir el desplazamiento directamente, sin suavizarlo ni crear anuncios continuos. La barra que acompaña este artículo usa ese criterio: indicar dónde estás sin interrumpir lo que lees.',
    ],
  },
  {
    id: 'navegacion',
    title: 'Llegar y poder volver',
    paragraphs: [
      'El trabajo de una página continúa en sus enlaces. Al abrir otra ruta, el título y el foco deben acompañar al contenido. Al volver atrás, la posición de lectura debería ser la que dejaste, no el comienzo de la página.',
      'Las anclas necesitan un destino claro y espacio para que una cabecera fija no lo tape. Los enlaces externos, las descargas y la apertura en otra pestaña deben conservar el comportamiento esperado del navegador. Una animación no justifica cambiar esos acuerdos.',
      'Revisa una secuencia completa: leer, seguir un enlace, volver, saltar a una sección y continuar con el teclado. En ese recorrido se ve si el diseño ayuda a la persona o simplemente produce una primera impresión bonita.',
    ],
  },
]
export function EditorialArticle() {
  usePageTitle('Diseñar para que se lea', 'Cuaderno')
  const article = useRef<HTMLElement>(null)
  return (
    <article ref={article} className={styles.article}>
      <Container size="xl">
        <header className={styles.articleHeader}>
          <span className={styles.eyebrow}>Cuaderno / Diseño de interfaces</span>
          <h1>
            <TextReveal lines={['Diseñar para', 'que se lea.']} />
          </h1>
          <p className={styles.lead}>
            Jerarquía, ritmo y movimiento para construir páginas que se entienden y apetece
            recorrer.
          </p>
          <div className={styles.articleMeta}>
            <span>Por el equipo Betterlibs</span>
            <time dateTime="2026-10-13">13 de octubre de 2026</time>
            <span>5 minutos de lectura</span>
          </div>
          <ScrollProgress targetRef={article} className={styles.progress} />
        </header>
        <figure className={styles.articleCover}>
          <img
            className={styles.artwork}
            src="/editorial/reading-cover.svg"
            alt="Composición de dos páginas con distintas longitudes de línea y una marca de lectura"
            width="1200"
            height="600"
            fetchPriority="high"
          />
        </figure>
        <div className={styles.readingLayout}>
          <nav className={styles.toc} aria-label="En este artículo">
            <strong>En este artículo</strong>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <RouterLink href={`#${section.id}`}>{section.title}</RouterLink>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.reading}>
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.id === 'ritmo' && (
                  <blockquote>
                    <p>
                      Una buena composición deja espacio para entender antes de pedir que actúes.
                    </p>
                  </blockquote>
                )}
              </section>
            ))}
            <section aria-labelledby="seguir-leyendo">
              <h2 id="seguir-leyendo">Del criterio a una página</h2>
              <p>
                Estas ideas se aplican a una landing, a un estudio o a una publicación. Explora las
                otras plantillas y compara cómo cambia la composición con los mismos fundamentos.
              </p>
              <Button asChild variant="outline">
                <RouterLink href="/plantillas/producto">Explorar la página de producto</RouterLink>
              </Button>
            </section>
          </div>
        </div>
      </Container>
    </article>
  )
}

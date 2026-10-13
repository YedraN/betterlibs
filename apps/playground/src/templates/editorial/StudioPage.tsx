import { Reveal, Stagger, TextReveal } from '@betterlibs/motion'
import {
  Button,
  CaseStudyCard,
  Container,
  CTA,
  Hero,
  Section,
  SectionHeader,
  TeamGrid,
  Testimonials,
  Timeline,
} from '@betterlibs/react'
import { RouterLink } from '../../site/router'
import { usePageTitle } from '../../site/SiteLayout'
import styles from './Templates.module.css'

export function StudioPage() {
  usePageTitle('Diseño que deja huella', 'Margen')
  return (
    <>
      <Hero
        id="estudio"
        variant="editorial"
        eyebrow="Margen / estudio independiente"
        title={<TextReveal lines={['Ideas claras.', 'Diseño que deja huella.']} />}
        description="Construimos identidades y experiencias digitales para proyectos que tienen algo que decir. Desde Madrid, con equipos de todas partes."
        actions={
          <>
            <Button asChild size="lg">
              <RouterLink href="#proyectos">Ver proyectos</RouterLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <RouterLink href="#contacto-estudio">Hablemos</RouterLink>
            </Button>
          </>
        }
        media={
          <Reveal>
            <img
              className={styles.artwork}
              src="/editorial/luma-project.svg"
              alt="Identidad Luma: símbolo triangular, paleta verde y composición editorial"
              width="1000"
              height="750"
              fetchPriority="high"
            />
          </Reveal>
        }
      />
      <Section id="proyectos" aria-labelledby="proyectos-title">
        <Container size="xl">
          <SectionHeader
            eyebrow="Una selección"
            title="Trabajo con intención"
            titleId="proyectos-title"
            description="Dos casos ficticios para mostrar cómo presentar el problema, las decisiones y el resultado de un proyecto."
          />
          <div className={styles.projects}>
            <Stagger>
              <Reveal>
                <CaseStudyCard
                  title="Luma: una identidad que respira"
                  client="Luma"
                  href="#luma"
                  linkAs={RouterLink}
                  image={{ src: '/editorial/luma-project.svg' }}
                  tags={['Estrategia', 'Identidad']}
                  summary="Convertir una propuesta de bienestar en una marca reconocible, cercana y fácil de aplicar."
                  moreLabel="Explorar Luma"
                />
              </Reveal>
              <Reveal>
                <CaseStudyCard
                  title="Forma: abrir el archivo"
                  client="Forma"
                  href="#forma"
                  linkAs={RouterLink}
                  image={{ src: '/editorial/forma-project.svg' }}
                  tags={['Dirección de arte', 'Web']}
                  summary="Dar estructura a una colección cultural para que encontrar una pieza invite a descubrir la siguiente."
                  moreLabel="Explorar Forma"
                />
              </Reveal>
            </Stagger>
          </div>
        </Container>
      </Section>
      <Section id="luma" tone="subtle" aria-labelledby="luma-title">
        <Container size="md">
          <SectionHeader
            eyebrow="Caso 01 / Luma"
            title="Una marca que deja respirar"
            titleId="luma-title"
            description="El reto: unificar una experiencia de bienestar que hasta entonces hablaba con demasiadas voces."
          />
          <div className={styles.reading}>
            <p>
              Empezamos por escuchar al equipo y ordenar su propuesta. La marca necesitaba expresar
              calma sin perder energía, y funcionar igual de bien en una tarjeta que en una
              pantalla.
            </p>
            <p>
              Diseñamos un símbolo que combina dirección y equilibrio. Una paleta vegetal, márgenes
              amplios y una jerarquía tipográfica sencilla construyen el sistema. La entrega incluye
              criterios de composición y ejemplos para el equipo, no solo archivos finales.
            </p>
            <p>
              <strong>Entregables:</strong> estrategia, identidad, sistema editorial y guía de
              aplicación. Proyecto de demostración.
            </p>
          </div>
        </Container>
      </Section>
      <Section id="forma" aria-labelledby="forma-title">
        <Container size="md">
          <SectionHeader
            eyebrow="Caso 02 / Forma"
            title="Un archivo que invita a explorar"
            titleId="forma-title"
            description="El reto: hacer accesible un catálogo cultural sin borrar el carácter de cada colección."
          />
          <img
            className={styles.artwork}
            src="/editorial/forma-project.svg"
            alt="Sistema Forma: módulos geométricos azules sobre un fondo marfil"
            width="1000"
            height="750"
            loading="lazy"
          />
          <div className={styles.reading}>
            <p>
              La colección se organizó por temas, épocas y formatos. Probamos la navegación con
              contenido real antes de dibujar los detalles visuales: un buen archivo necesita
              caminos claros y formas de volver al contexto.
            </p>
            <p>
              La retícula modular une las piezas y permite destacar una imagen sin romper el
              conjunto. La lectura tiene prioridad en móvil, con títulos claros, controles visibles
              y una estructura que funciona también sin efectos.
            </p>
            <p>
              <strong>Entregables:</strong> arquitectura de contenido, dirección de arte, diseño web
              y prototipo. Proyecto de demostración.
            </p>
          </div>
        </Container>
      </Section>
      <Timeline
        variant="steps"
        title="De la pregunta a la entrega"
        items={[
          {
            label: '01',
            title: 'Entender',
            description:
              'Conversamos, revisamos el contexto y definimos juntos qué necesita cambiar.',
          },
          {
            label: '02',
            title: 'Explorar',
            description: 'Probamos direcciones visuales con contenido y escenarios reales.',
          },
          {
            label: '03',
            title: 'Construir',
            description: 'Convertimos la dirección elegida en un sistema que tu equipo puede usar.',
          },
          {
            label: '04',
            title: 'Acompañar',
            description: 'Documentamos decisiones y revisamos las primeras aplicaciones contigo.',
          },
        ]}
      />
      <TeamGrid
        title="Un equipo pequeño. Una mirada compartida."
        description="Personas de ejemplo; sustituye sus perfiles por los de tu estudio."
        variant="compact"
        members={[
          {
            name: 'Clara Soler',
            role: 'Estrategia y dirección creativa',
            bio: 'Busca la idea que da sentido a cada decisión.',
          },
          {
            name: 'Diego Vidal',
            role: 'Diseño y producto digital',
            bio: 'Convierte esa idea en experiencias claras y accesibles.',
          },
        ]}
      />
      <Testimonials
        variant="featured"
        tone="subtle"
        testimonials={[
          {
            quote:
              'El sistema nos ayuda a decidir. Ahora cada nueva pieza se siente parte de la misma marca.',
            name: 'Ana Ríos',
            role: 'Equipo Luma · testimonio de ejemplo',
          },
        ]}
      />
      <CTA
        id="contacto-estudio"
        variant="panel"
        panelTone="inverse"
        title="Cuéntanos qué quieres cambiar."
        description="Una conversación breve para entender tu proyecto y ver si podemos ayudarte."
        actions={
          <Button asChild size="lg">
            <a href="mailto:hola@example.com?subject=Proyecto%20para%20Margen">
              Escribir al estudio
            </a>
          </Button>
        }
        note="Dirección de ejemplo: reemplázala por tu correo antes de publicar."
      />
    </>
  )
}

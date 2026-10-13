import { CheckIcon, LayoutGridIcon, ShieldCheckIcon } from '@betterlibs/icons'
import { AnimatedNumber, Reveal, TextReveal } from '@betterlibs/motion'
import {
  BentoFeature,
  BentoFeatures,
  Button,
  Container,
  CTA,
  FAQ,
  Field,
  Form,
  Hero,
  Input,
  Pricing,
  Section,
  SectionHeader,
  Testimonials,
} from '@betterlibs/react'
import { useState } from 'react'
import { RouterLink } from '../../site/router'
import { usePageTitle } from '../../site/SiteLayout'
import styles from './Templates.module.css'

export function ProductPage() {
  usePageTitle('El trabajo en su sitio', 'Atlas')
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Definir la dirección', detail: 'Diseño · Hoy' },
    { id: 2, title: 'Revisar el prototipo', detail: 'Producto · Mañana' },
    { id: 3, title: 'Compartir la entrega', detail: 'Equipo · Viernes' },
  ])
  const [prepared, setPrepared] = useState(false)
  return (
    <>
      <Hero
        id="producto"
        variant="editorial"
        eyebrow="Atlas / un espacio para tu equipo"
        title={<TextReveal lines={['El trabajo,', 'en su sitio.']} />}
        description="De la primera idea a la entrega. Proyectos, decisiones y próximos pasos en un espacio que todo el equipo entiende."
        actions={
          <>
            <Button asChild size="lg">
              <RouterLink href="#precios">Encuentra tu plan</RouterLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <RouterLink href="#acceso">Preparar acceso</RouterLink>
            </Button>
          </>
        }
        media={
          <Reveal>
            <div className={styles.productPreview}>
              <div className={styles.previewTop}>
                <strong>Atlas / Lanzamiento</strong>
                <span>Esta semana</span>
              </div>
              <div>
                <span className={styles.previewCount}>
                  <AnimatedNumber value={tasks.length} />
                </span>{' '}
                tareas por completar
              </div>
              <ul className={styles.previewList}>
                {tasks.map((task) => (
                  <li key={task.id}>
                    <strong>{task.title}</strong>
                    <small>{task.detail}</small>
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                onClick={() =>
                  setTasks((value) => [
                    ...value,
                    {
                      id: value.length + 1,
                      title: `Nueva tarea ${value.length + 1}`,
                      detail: 'Pendiente de definir',
                    },
                  ])
                }
              >
                Añadir tarea de ejemplo
              </Button>
              <span role="status">
                {tasks.length > 3
                  ? `${tasks.length - 3} ${tasks.length === 4 ? 'tarea añadida' : 'tareas añadidas'} al ejemplo.`
                  : 'Prueba el contador del tablero.'}
              </span>
            </div>
          </Reveal>
        }
      />
      <BentoFeatures
        id="funciones"
        eyebrow="Menos ruido, más claridad"
        title="Todo el contexto. Un solo lugar."
      >
        <BentoFeature
          media={<LayoutGridIcon style={{ fontSize: 32 }} />}
          title="Un proyecto, una conversación"
        >
          El objetivo, los archivos y las decisiones viven juntos. Quien llega al proyecto puede
          entenderlo sin pedir otra reunión.
        </BentoFeature>
        <BentoFeature media={<CheckIcon style={{ fontSize: 32 }} />} title="Saber qué sigue">
          Cada tarea tiene una persona y un próximo paso. Las prioridades se ven; no hay que
          adivinarlas.
        </BentoFeature>
        <BentoFeature
          media={<ShieldCheckIcon style={{ fontSize: 32 }} />}
          title="Compartir con criterio"
        >
          Invita a colaboradores a los espacios que necesitan y mantén el resto del trabajo dentro
          del equipo.
        </BentoFeature>
        <BentoFeature
          title="Cambiar de ritmo sin perder el hilo"
          description="Una revisión semanal convierte las novedades en decisiones. Conserva lo importante y deja de perseguir actualizaciones."
          tone="brand"
        />
      </BentoFeatures>
      <Testimonials
        title="Cuando el equipo comparte contexto"
        tone="subtle"
        variant="featured"
        testimonials={[
          {
            quote:
              'Antes preparábamos tres documentos para una reunión. Ahora abrimos el proyecto y empezamos a decidir.',
            name: 'Lucía Moreno',
            role: 'Responsable de producto · equipo de ejemplo',
          },
        ]}
      />
      <Pricing
        id="precios"
        eyebrow="Planes claros"
        title="Empieza pequeño. Crece con tu equipo."
        description="Precios de ejemplo por persona. El periodo anual se paga una vez al año; los impuestos no están incluidos."
        billingPeriods={[
          { value: 'monthly', label: 'Mensual' },
          { value: 'annual', label: 'Anual · ahorra 20 %' },
        ]}
        plans={[
          {
            name: 'Esencial',
            description: 'Para organizar el trabajo diario.',
            price: { monthly: '12 €', annual: '115,20 €' },
            period: { monthly: '/persona/mes', annual: '/persona/año' },
            note: { monthly: 'Facturación mensual', annual: 'Equivale a 9,60 €/mes' },
            features: ['Proyectos ilimitados', 'Tablero y calendario', '5 GB por persona'],
            action: (
              <Button asChild variant="outline">
                <RouterLink href="#acceso">Elegir Esencial</RouterLink>
              </Button>
            ),
          },
          {
            name: 'Equipo',
            description: 'Para coordinar varias áreas.',
            highlighted: true,
            price: { monthly: '24 €', annual: '230,40 €' },
            period: { monthly: '/persona/mes', annual: '/persona/año' },
            note: { monthly: 'Facturación mensual', annual: 'Equivale a 19,20 €/mes' },
            features: [
              'Todo lo de Esencial',
              'Invitados y permisos',
              'Informes de actividad',
              '50 GB por persona',
            ],
            action: (
              <Button asChild>
                <RouterLink href="#acceso">Elegir Equipo</RouterLink>
              </Button>
            ),
          },
          {
            name: 'Organización',
            description: 'Para equipos con necesidades propias.',
            price: 'A medida',
            features: ['Todo lo de Equipo', 'Acompañamiento inicial', 'Acuerdo de servicio'],
            action: (
              <Button asChild variant="outline">
                <RouterLink href="#acceso">Hablar con el equipo</RouterLink>
              </Button>
            ),
          },
        ]}
      />
      <FAQ
        id="preguntas"
        title="Antes de dar el primer paso"
        variant="split"
        items={[
          {
            question: '¿Puedo cambiar de plan?',
            answer:
              'Sí. En este ejemplo los planes explican una posible estructura comercial. Adapta las condiciones de cambio y facturación a tu propio producto.',
          },
          {
            question: '¿Qué ocurre con mis proyectos?',
            answer:
              'La idea es que tu trabajo te pertenezca. Define y explica qué formatos de exportación y plazos de conservación ofrece tu servicio.',
          },
          {
            question: '¿Puedo trabajar con clientes?',
            answer:
              'El plan Equipo muestra un modelo con invitados. Comprueba que los permisos y límites de tu producto coinciden con lo que comunicas aquí.',
          },
        ]}
      />
      <Section id="acceso" tone="subtle" aria-labelledby="acceso-title">
        <Container size="md">
          <SectionHeader
            title="Prepara tu primer espacio"
            titleId="acceso-title"
            description="Este formulario prepara una solicitud de ejemplo. Puedes revisar tus datos antes de compartirlos."
          />
          <Form
            className={styles.contact}
            aria-label="Solicitud de acceso"
            onChange={() => setPrepared(false)}
            onSubmit={(event) => {
              event.preventDefault()
              setPrepared(true)
            }}
          >
            <Field label="Nombre del equipo" name="team" required>
              <Input autoComplete="organization" />
            </Field>
            <Field label="Correo de trabajo" name="email" required>
              <Input type="email" autoComplete="email" />
            </Field>
            <Button type="submit">Preparar solicitud</Button>
            <p role="status">
              {prepared
                ? 'Solicitud preparada. En esta demostración no se envían ni almacenan tus datos.'
                : 'Revisa la información antes de continuar.'}
            </p>
          </Form>
        </Container>
      </Section>
      <CTA
        variant="panel"
        panelTone="inverse"
        title="Haz espacio para el trabajo que importa."
        description="Un punto de partida claro para tu próxima página de producto."
        actions={
          <Button asChild>
            <RouterLink href="/plantillas/estudio">Explorar el estudio</RouterLink>
          </Button>
        }
      />
    </>
  )
}

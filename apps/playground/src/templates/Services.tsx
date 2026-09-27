import { CheckIcon } from '@betterlibs/icons'
import {
  Button,
  Container,
  CTA,
  FAQ,
  Grid,
  Heading,
  Icon,
  Image,
  Pricing,
  Section,
  Stack,
  Text,
  Timeline,
} from '@betterlibs/react'
import { faqs, photo, plans, process, services } from '../site/data'
import { PageHeader } from '../site/PageHeader'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'

/** Plantilla 2 · Servicios. */
export function ServicesPage() {
  usePageTitle('Servicios')
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Servicios' }]}
        eyebrow="Servicios"
        title="Asesoría completa para crecer con orden"
        description="Cuatro especialidades que trabajan juntas para que tomes mejores decisiones."
      />

      {services.map((service, index) => (
        <Section
          key={service.slug}
          id={service.slug}
          tone={index % 2 === 0 ? 'subtle' : 'default'}
          aria-labelledby={`${service.slug}-title`}
        >
          <Container>
            <Grid columns={{ base: 1, lg: 2 }} gap="12" align="center">
              <Stack gap="5" style={{ order: index % 2 === 0 ? 0 : 1 }}>
                <Icon contained size="lg">
                  {service.icon}
                </Icon>
                <Heading id={`${service.slug}-title`} level={2} size="3xl">
                  {service.title}
                </Heading>
                <Text variant="lead">{service.summary}</Text>
                <Stack as="ul" gap="2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {service.points.map((point) => (
                    <Stack as="li" key={point} direction="row" gap="2" align="center">
                      <Icon tone="success">
                        <CheckIcon />
                      </Icon>
                      <Text as="span">{point}</Text>
                    </Stack>
                  ))}
                </Stack>
                <div>
                  <Button asChild variant="outline">
                    <RouterLink href="/contacto">
                      Pedir información sobre {service.title.toLowerCase()}
                    </RouterLink>
                  </Button>
                </div>
              </Stack>
              <Image src={photo(service.slug)} alt="" ratio={4 / 3} radius="2xl" />
            </Grid>
          </Container>
        </Section>
      ))}

      <Timeline
        title="Cómo trabajamos"
        description="Del primer café a los primeros resultados, sin sorpresas."
        align="center"
        variant="steps"
        items={process}
      />

      <Pricing
        id="precios"
        tone="subtle"
        eyebrow="Precios"
        title="Planes claros, sin letra pequeña"
        description="Sin permanencia. Cambia de plan cuando lo necesites."
        billingPeriods={[
          { value: 'mensual', label: 'Mensual' },
          { value: 'anual', label: 'Anual (-20 %)' },
        ]}
        plans={plans.map((plan) => ({
          ...plan,
          action: (
            <Button asChild variant={plan.highlighted ? 'primary' : 'outline'}>
              <RouterLink href="/contacto">
                {plan.price === 'A medida' ? 'Hablar con el equipo' : `Empezar con ${plan.name}`}
              </RouterLink>
            </Button>
          ),
        }))}
      />

      <FAQ
        variant="split"
        title="Preguntas frecuentes"
        description="Si no encuentras tu respuesta, escríbenos y te contestamos en 24 horas."
        actions={
          <Button asChild variant="outline">
            <RouterLink href="/contacto">Hacer una pregunta</RouterLink>
          </Button>
        }
        items={faqs}
        structuredData
      />

      <CTA
        variant="split"
        tone="subtle"
        title="¿No sabes qué servicio necesitas?"
        description="Cuéntanos tu situación y te recomendamos por dónde empezar."
        actions={
          <Button asChild>
            <RouterLink href="/contacto">Pedir una recomendación</RouterLink>
          </Button>
        }
      />
    </>
  )
}

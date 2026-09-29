import { ArrowRightIcon } from '@betterlibs/icons'
import {
  Avatar,
  AvatarGroup,
  BlogGrid,
  Button,
  CTA,
  FeatureGrid,
  GradientText,
  Hero,
  Link,
  LogoCloud,
  Stats,
  Testimonials,
} from '@betterlibs/react'
import { articles, clients, photo, photoSrcSet, services, stats, testimonials } from '../site/data'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'

/** Plantilla 1 · Portada corporativa. */
export function HomePage() {
  usePageTitle('Consultoría financiera para empresas')
  return (
    <>
      <Hero
        eyebrow="Consultoría financiera"
        title={
          <>
            Crece con orden y <GradientText>decide con datos</GradientText>
          </>
        }
        description="Acompañamos a pymes y grupos empresariales en fiscalidad, auditoría y estrategia desde hace 20 años."
        actions={
          <>
            <Button asChild size="lg" iconEnd={<ArrowRightIcon />}>
              <RouterLink href="/contacto">Solicitar propuesta</RouterLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <RouterLink href="/servicios">Ver servicios</RouterLink>
            </Button>
          </>
        }
        media={
          <img
            src={photo('hero')}
            srcSet={photoSrcSet('hero')}
            sizes="(min-width: 64em) 50vw, 100vw"
            alt="Dos consultoras de Norte revisan un informe con un cliente"
            width={1200}
            height={800}
            // Es la imagen principal (LCP): se pide cuanto antes.
            fetchPriority="high"
          />
        }
      >
        <AvatarGroup max={4} size="sm">
          <Avatar name="Ana Pérez" />
          <Avatar name="Luis Martín" />
          <Avatar name="Sara Gil" />
          <Avatar name="Jorge Ramos" />
          <Avatar name="Marta León" />
        </AvatarGroup>
        <span>Más de 500 empresas confían en nosotros</span>
      </Hero>

      <LogoCloud title="Empresas que trabajan con nosotros" logos={clients} spacing="sm" />

      <FeatureGrid
        id="servicios"
        tone="subtle"
        background="dots"
        eyebrow="Servicios"
        title="Todo lo que tu empresa necesita"
        description="Un equipo, cuatro especialidades y un mismo objetivo: que crezcas con orden."
        features={services.map((service) => ({
          icon: service.icon,
          title: service.title,
          description: service.summary,
          href: `/servicios#${service.slug}`,
        }))}
        columns={{ base: 1, md: 2, lg: 4 }}
        linkAs={RouterLink}
      />

      <Stats title="Resultados que hablan por nosotros" stats={stats} />

      <Testimonials
        tone="subtle"
        eyebrow="Opiniones"
        title="Lo que dicen nuestros clientes"
        testimonials={testimonials}
      />

      <BlogGrid
        title="Últimos artículos"
        description="Novedades fiscales y consejos de gestión, explicados sin jerga."
        posts={articles.slice(0, 3)}
        linkAs={RouterLink}
        actions={
          <Link asChild variant="standalone" arrow>
            <RouterLink href="/blog">Ver todos los artículos</RouterLink>
          </Link>
        }
      />

      <CTA
        title="Hablemos de tu proyecto"
        description="Una primera reunión sin compromiso para entender qué necesitas."
        actions={
          <>
            <Button asChild size="lg">
              <RouterLink href="/contacto">Solicitar reunión</RouterLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:+34910000000">Llamar al 910 000 000</a>
            </Button>
          </>
        }
        note="Sin compromiso · Respuesta en 24 horas laborables"
      />
    </>
  )
}

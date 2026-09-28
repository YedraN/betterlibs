import { AwardIcon, HeartIcon, ShieldCheckIcon, TargetIcon } from '@betterlibs/icons'
import { Button, CTA, FeatureGrid, Stats, TeamGrid, Timeline } from '@betterlibs/react'
import { history, photo, stats, team } from '../site/data'
import { PageHeader } from '../site/PageHeader'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'

/** Plantilla 3 · Sobre nosotros. */
export function AboutPage() {
  usePageTitle('Sobre nosotros')
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Sobre nosotros' }]}
        variant="split"
        eyebrow="Sobre nosotros"
        title="Asesoría cercana desde 2006"
        description="Somos un equipo de 40 personas en Madrid y Barcelona. Creemos que una buena asesoría se nota en las decisiones de cada mes, no solo en el cierre del año."
        media={
          <img
            src={photo('team', 1200, 900)}
            alt="El equipo de Norte en la oficina de Madrid"
            width={1200}
            height={900}
            fetchPriority="high"
          />
        }
      />

      <Stats variant="divided" tone="subtle" stats={stats} />

      <FeatureGrid
        eyebrow="Nuestros valores"
        title="Cómo entendemos nuestro trabajo"
        variant="plain"
        columns={{ base: 1, md: 2 }}
        features={[
          {
            icon: <TargetIcon />,
            title: 'Claridad',
            description: 'Informes que se entienden sin ser experto en finanzas.',
          },
          {
            icon: <HeartIcon />,
            title: 'Cercanía',
            description: 'Un interlocutor único que conoce tu empresa por dentro.',
          },
          {
            icon: <ShieldCheckIcon />,
            title: 'Rigor',
            description: 'Procesos revisados y cumplimiento normativo sin atajos.',
          },
          {
            icon: <AwardIcon />,
            title: 'Resultados',
            description: 'Objetivos medibles y seguimiento mensual.',
          },
        ]}
      />

      <Timeline
        tone="subtle"
        eyebrow="Historia"
        title="20 años creciendo con nuestros clientes"
        items={history}
      />

      <TeamGrid
        eyebrow="Equipo"
        title="Las personas detrás de Norte"
        description="Un equipo multidisciplinar con experiencia en empresas de todos los tamaños."
        members={team}
      />

      <CTA
        panelTone="dark"
        title="¿Quieres trabajar con nosotros?"
        description="Buscamos personas que disfruten explicando números con palabras sencillas."
        actions={
          <Button asChild>
            <RouterLink href="/contacto">Ver ofertas de empleo</RouterLink>
          </Button>
        }
      />
    </>
  )
}

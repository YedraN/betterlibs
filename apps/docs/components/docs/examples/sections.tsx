import { BentoFeature, BentoFeatures, Button, CTA, Hero } from '@betterlibs/react'

export function SectionsExample() {
  return (
    <>
      <Hero
        headingLevel={2}
        id="gallery-hero"
        variant="editorial"
        spacing="sm"
        title="Una página con voz propia"
        description="Empieza por contenido claro y añade movimiento solo donde explique algo."
        actions={
          <Button asChild>
            <a href="#gallery-next">Explorar la composición</a>
          </Button>
        }
      />
      <BentoFeatures title="Piezas que encajan" spacing="sm" headingLevel={3}>
        <BentoFeature
          headingLevel={4}
          title="Identidad"
          tone="brand"
          description="Una tipografía que da orden."
        />
        <BentoFeature headingLevel={4} title="Ritmo" description="Espacio para leer y actuar." />
      </BentoFeatures>
      <CTA
        id="gallery-next"
        headingLevel={3}
        spacing="sm"
        panelTone="inverse"
        title="Construye tu siguiente página"
        actions={
          <Button asChild>
            <a href="/docs/primeros-pasos/primera-pagina">Seguir la receta</a>
          </Button>
        }
      />
    </>
  )
}

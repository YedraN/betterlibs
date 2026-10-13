import '@betterlibs/react/styles.css'
import { ArrowRightIcon } from '@betterlibs/icons'
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Field,
  Header,
  Heading,
  Input,
  PortalProvider,
  SectionHeader,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@betterlibs/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'

const meta: Meta = {
  title: 'Componentes/Editorial/UI prioritaria',
  globals: { preset: 'editorial' },
  parameters: { layout: 'fullscreen' },
}
export default meta

function Controls() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [checked, setChecked] = useState(false)
  const [mode, setMode] = useState('system')
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => {
      setLoading(false)
      setSaved(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [loading])
  return (
    <div data-motion={mode}>
      <PortalProvider container={portal}>
        <main style={{ padding: 'clamp(1rem, 4vw, 3rem)', maxWidth: '70rem', margin: 'auto' }}>
          <Stack gap="8">
            <SectionHeader
              headingLevel={1}
              title="Tu próxima colección"
              description="Controles que responden a cada acción."
            />
            <label>
              Movimiento{' '}
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                <option value="system">Sistema</option>
                <option value="reduced">Reducido</option>
                <option value="off">Desactivado</option>
              </select>
            </label>
            <section aria-label="Acciones">
              <Stack direction="row" gap="3" wrap>
                <Button
                  loading={loading}
                  loadingLabel="Guardando colección"
                  iconEnd={<ArrowRightIcon />}
                  onClick={() => {
                    setSaved(false)
                    setLoading(true)
                  }}
                >
                  Guardar colección
                </Button>
                <Button variant="secondary">Duplicar</Button>
                <Button variant="outline">Exportar</Button>
                <Button variant="ghost">Compartir</Button>
                <Button variant="soft">Añadir etiqueta</Button>
                <Button variant="danger">Eliminar</Button>
                <Button disabled>Publicar (requiere una tarjeta)</Button>
              </Stack>
              <p role="status">
                {saved ? 'Colección guardada.' : 'Los cambios se guardan al confirmar.'}
              </p>
            </section>
            <section aria-label="Nombre de colección" style={{ maxWidth: '32rem' }}>
              <Stack gap="4">
                <Field
                  label="Nombre"
                  description="Al menos tres caracteres."
                  error={
                    checked && name.trim().length < 3
                      ? 'Escribe un nombre de al menos tres caracteres.'
                      : undefined
                  }
                  success={checked && name.trim().length >= 3 ? 'Nombre disponible.' : undefined}
                >
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={() => setChecked(true)}
                  />
                </Field>
                <Button variant="outline" onClick={() => setChecked(true)}>
                  Comprobar nombre
                </Button>
                <Field label="Enlace de la colección" readOnly>
                  <Input defaultValue="betterlibs.dev/colecciones/editorial" />
                </Field>
                <Field label="Código de publicación" disabled description="Disponible al publicar.">
                  <Input placeholder="Pendiente de publicación" />
                </Field>
                <Field label="Clave privada">
                  <Input type="password" autoComplete="new-password" />
                </Field>
              </Stack>
            </section>
            <Dialog>
              <DialogTrigger asChild>
                <Button iconEnd={<ArrowRightIcon />}>Crear colección</Button>
              </DialogTrigger>
              <DialogContent
                title="Crear colección"
                description="Ponle un nombre para encontrarla después."
                footer={
                  <>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Crear</Button>
                    </DialogClose>
                  </>
                }
              >
                <Field label="Nombre de la nueva colección">
                  <Input />
                </Field>
              </DialogContent>
            </Dialog>
          </Stack>
        </main>
        <div ref={setPortal} />
      </PortalProvider>
    </div>
  )
}

export const Estados: StoryObj = { render: () => <Controls /> }

function Content() {
  const [details, setDetails] = useState(false)
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  return (
    <main style={{ padding: 'clamp(1rem, 4vw, 3rem)', maxWidth: '70rem', margin: 'auto' }}>
      <Stack gap="8">
        <SectionHeader
          headingLevel={1}
          size="3xl"
          title="Componentes para contar tu historia"
          description="Contenido largo, enlaces y selecciones con una jerarquía clara."
          titleId="content-title"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
            gap: '1rem',
          }}
        >
          <Card as="article" interactive>
            <Heading level={2} size="xl">
              <a className="bl-card-link" href="#questions">
                Interfaces editoriales
              </a>
            </Heading>
            <Text>
              Consulta cómo combinar superficies, títulos y controles para construir tu página.
            </Text>
          </Card>
          <Card as="article">
            <Heading level={2} size="xl">
              Una tarjeta para leer con calma
            </Heading>
            <Text>
              La tarjeta estática conserva su posición y no sugiere una acción que no existe.
            </Text>
          </Card>
          <Card as="article" variant="elevated">
            <Heading level={2} size="xl">
              Contenido sin imagen
            </Heading>
            <Text>
              La jerarquía se mantiene cuando falta una imagen o el título ocupa varias líneas.
            </Text>
          </Card>
        </div>
        <label>
          Orientación de las pestañas{' '}
          <select
            value={orientation}
            onChange={(event) => setOrientation(event.target.value as typeof orientation)}
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </label>
        {(['line', 'pill'] as const).map((variant) => (
          <Tabs key={variant} defaultValue="design" variant={variant} orientation={orientation}>
            <TabsList aria-label={`Colección ${variant}`}>
              <TabsTrigger value="design">Diseño editorial</TabsTrigger>
              <TabsTrigger value="motion">Movimiento y comportamiento</TabsTrigger>
              <TabsTrigger value="later" disabled>
                Próximamente
              </TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <Field label={`Nombre ${variant}`}>
                <Input defaultValue="Mi colección" />
              </Field>
            </TabsContent>
            <TabsContent value="motion" forceMount>
              <Button variant="outline">Repetir demostración</Button>
            </TabsContent>
          </Tabs>
        ))}
        <section id="questions" aria-labelledby="questions-title">
          <SectionHeader title="Preguntas frecuentes" titleId="questions-title" size="2xl" />
          <Accordion defaultValue="use" variant="separated">
            <AccordionItem value="use" title="¿Puedo cambiar el contenido con el panel abierto?">
              <Stack gap="4">
                <Text>La altura sigue al contenido y permite volver a cerrar el panel.</Text>
                <Button variant="outline" onClick={() => setDetails(!details)}>
                  Alternar detalles
                </Button>
                {details && (
                  <p>
                    Las tarjetas pueden contener texto largo, imágenes opcionales y enlaces. El
                    panel mide su altura natural al volver a abrirse.
                  </p>
                )}
                <a href="#content-title">Volver al contenido</a>
              </Stack>
            </AccordionItem>
            <AccordionItem value="keyboard" title="¿Cómo recorro las preguntas con el teclado?">
              <p>Usa las flechas para cambiar de pregunta y Enter o Espacio para abrirla.</p>
              <a href="#content-title">Ver componentes</a>
            </AccordionItem>
            <AccordionItem value="disabled" title="Traducciones (próximamente)" disabled>
              Disponible más adelante.
            </AccordionItem>
          </Accordion>
        </section>
      </Stack>
    </main>
  )
}
export const Contenido: StoryObj = { render: () => <Content /> }

export const Cabecera: StoryObj = {
  render: () => (
    <>
      <Header
        logo={<a href="#main">Betterlibs</a>}
        navigation={[
          { label: 'Componentes', href: '#components' },
          { label: 'Documentación', href: '#documentation' },
        ]}
        currentHref="#components"
        actions={
          <Button asChild>
            <a href="#documentation">Empezar</a>
          </Button>
        }
        hideOnScroll
      />
      <main id="main" tabIndex={-1} style={{ padding: 'clamp(1rem, 4vw, 3rem)' }}>
        <Stack gap="8">
          <SectionHeader
            headingLevel={1}
            eyebrow="Betterlibs"
            title="Una interfaz con voz propia"
            description="Tipografía expresiva, superficies legibles y movimiento que responde."
          />
          <section id="components" style={{ minHeight: '70vh' }}>
            <SectionHeader
              title="Componentes"
              description="Una selección de controles para tu primera página."
            />
          </section>
          <section id="documentation" style={{ minHeight: '70vh' }}>
            <SectionHeader
              align="center"
              eyebrow="Primera página"
              title="Empieza con el contenido"
              description="Los títulos y las acciones se ajustan al ancho disponible."
              actions={<Button>Crear proyecto</Button>}
            />
          </section>
        </Stack>
      </main>
    </>
  ),
}

export const TextoLargo: StoryObj = {
  render: () => (
    <main style={{ maxWidth: '26rem', padding: '1rem' }}>
      <SectionHeader
        headingLevel={1}
        size="3xl"
        eyebrow="Una colección para tu equipo y tus colaboradores"
        title="Interfaces editoriales para proyectos que necesitan explicar mucho más"
        description="Una entradilla completa debe seguir siendo legible cuando aumenta el tamaño del texto o cambia el idioma de la página."
        actions={
          <>
            <Button iconEnd={<ArrowRightIcon />}>
              Compartir esta colección con todo el equipo
            </Button>
            <Button variant="outline">Consultar la documentación y los ejemplos</Button>
          </>
        }
      />
    </main>
  ),
}

# @betterlibs/react

Componentes y secciones React para construir páginas con identidad: UI editorial, formularios,
overlays y composiciones de producto, estudio y artículo. Objetivo WCAG 2.2 AA; las comprobaciones
automatizadas cubren Chromium, Firefox y WebKit. La revisión manual con lectores de pantalla
del rediseño sigue pendiente del cierre de calidad.

- Sin runtime de estilos: CSS Modules + variables CSS, compatible con SSR y React Server Components.
- Todo el estilo sale de los tokens de [`@betterlibs/tokens`](../tokens): adapta la marca con
  `createTheme()`. Verifica también el contraste de la composición final.
- Textos por defecto en español, todos sobrescribibles por props.
- Tree-shakeable: importar `Button` añade menos de 2,5 kB (brotli) a tu bundle.

## Instalación

La publicación pública de esta edición está pendiente. Puedes trabajar desde el monorepo o
instalar sus tarballs locales siguiendo la [guía de instalación](../../apps/docs/content/docs/primeros-pasos/instalacion.mdx).

Requiere React 19 o superior.

## Uso

Importa los estilos una vez, en la raíz de tu app:

```tsx
import '@betterlibs/tokens/index.css'
import '@betterlibs/react/styles.css'
import '@betterlibs/tokens/editorial.css'
```

Activa el nuevo estilo con `data-preset="editorial"` en tu página o contenedor. Las fuentes las
carga tu app. El preset anterior sigue disponible y los componentes conservan sus nombres.

```tsx
import { Button, Container, Heading, Hero, Section } from '@betterlibs/react'
import { ArrowRightIcon } from '@betterlibs/icons'

export default function Home() {
  return (
    <Hero
      title="Consultoría financiera para crecer con orden"
      description="Te ayudamos a tomar decisiones con datos claros."
      actions={
        <Button asChild iconEnd={<ArrowRightIcon />}>
          <a href="/contacto">Solicitar propuesta</a>
        </Button>
      }
    />
  )
}
```

## Qué incluye

| Familia | Componentes |
| --- | --- |
| Layout | `Container`, `Section`, `Stack`, `Grid`, `Box`, `Divider`, `AspectRatio` |
| Tipografía | `Heading`, `Text`, `Link`, `Prose` |
| Acciones | `Button`, `IconButton`, `ButtonGroup` |
| Contenido | `Badge`, `Tag`, `Avatar`, `Image`, `Icon` |
| Feedback | `Alert`, `Toast`, `Spinner`, `Skeleton` |
| Formularios | `Form`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FileInput`, `ErrorSummary` |
| Overlays | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu` |
| Interactivos | `Tabs`, `Accordion`, `Carousel` |
| Navegación | `Header`, `NavigationMenu`, `MobileNav`, `Footer`, `Breadcrumb`, `Pagination`, `AnnouncementBar`, `SocialLinks` |
| Bloques | `Hero`, `CTA`, `FeatureGrid`, `LogoCloud`, `Stats`, `Timeline`, `Testimonials`, `TeamGrid`, `CaseStudyCard`, `BlogGrid`, `Pricing`, `FAQ`, `ContactSection`, `Newsletter`, `CookieConsent` |

`BentoFeatures`, `BentoFeature` y `FeatureShowcase` completan las composiciones editoriales.
El movimiento es opcional desde `@betterlibs/motion`; la UI no depende del motor.

## Componentes avanzados

La entrada optativa incluye Combobox, MultiSelect, DatePicker, DataTable, Sidebar, Stepper,
Dropzone, Slider, ToggleGroup, TreeView, SplitPane, Kanban, Timeline de actividad, EmptyState,
CopyButton, CodeBlock, ImageViewer, InlineEdit y FilterToolbar. Importa su CSS además del básico:

```tsx
import '@betterlibs/react/advanced/styles.css'
import { Combobox, DataTable, DatePicker } from '@betterlibs/react/advanced'
```

Los controles admiten teclado, temas y pantallas pequeñas. Las tablas y el código conservan
desplazamiento horizontal local; los paneles y el tablero se apilan en móvil. Las operaciones
remotas quedan a cargo de la aplicación. Stepper, Dropzone e InlineEdit proporcionan AbortSignal.

Command y las notificaciones siguen en la entrada básica. Command añade recientes y reintento;
`toast.update(id, patch)` actualiza progreso y los avisos admiten acciones, agrupación y persistencia.
Las demos y contratos de cada componente están en [la guía avanzada](../../apps/docs/content/docs/componentes/avanzados/index.mdx).

La documentación (galería, guías y referencias generadas de props y CSS) está en
`apps/docs` del [repositorio](https://github.com/YedraN/betterlibs).

## Licencia

MIT

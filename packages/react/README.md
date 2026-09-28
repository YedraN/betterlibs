# @betterlibs/react

Componentes y bloques React **accesibles (WCAG 2.2 AA)** para webs corporativas y profesionales:
cabecera con mega menú, hero, servicios, testimonios, precios, FAQ, formularios de contacto con
validación, aviso de cookies RGPD y mucho más.

- Sin runtime de estilos: CSS Modules + variables CSS, compatible con SSR y React Server Components.
- Todo el estilo sale de los tokens de [`@betterlibs/tokens`](../tokens): adapta la marca con
  `createTheme()` y el contraste se verifica solo.
- Textos por defecto en español, todos sobrescribibles por props.
- Tree-shakeable: importar `Button` añade menos de 2,5 kB (brotli) a tu bundle.

## Instalación

```bash
pnpm add @betterlibs/react @betterlibs/tokens @betterlibs/icons
```

Requiere React 19 o superior.

## Uso

Importa los estilos una vez, en la raíz de tu app:

```tsx
import '@betterlibs/tokens/index.css'
import '@betterlibs/react/styles.css'
```

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

La documentación completa (una página por componente, con props, accesibilidad y CSS) está en
`apps/docs` del [repositorio](https://github.com/YedraN/betterlibs).

## Licencia

MIT

# Betterlibs UI

Librería de componentes React para **construir webs con identidad**: UI accesible, componentes
personalizables y bloques de página. La dirección editorial y de movimiento tiene tres plantillas y una galería interactiva; el cierre de calidad está pendiente.

El registro público todavía no ofrece esta edición. Para probar el proyecto, ejecuta
`./docker.sh`; para consumirlo desde otra app, construye y empaqueta los workspaces siguiendo
[la instalación local](apps/docs/content/docs/primeros-pasos/instalacion.mdx).

```tsx
import '@betterlibs/tokens/index.css'
import '@betterlibs/react/styles.css'
```

## Principios

La ampliación de componentes e interacciones está en [PLAN_COMPONENTES.md](PLAN_COMPONENTES.md).
Selectores, calendario, tablas, paneles y el resto del catálogo avanzado se importan desde
`@betterlibs/react/advanced` con `@betterlibs/react/advanced/styles.css`, además de los estilos básicos.

- **Objetivo WCAG 2.2 AA**: teclado, foco visible, contraste y ARIA; la validación de cierre entre motores y con lectores de pantalla sigue pendiente.
- **Tu marca, no la nuestra**: todo el estilo sale de design tokens (variables CSS).
- **Sin runtime de estilos**: CSS Modules + variables CSS, compatible con SSR y React Server Components.
- **Bloques listos para usar**: hero, testimonios, precios, FAQ, contacto, cookies (RGPD)…
- **API predecible**: las mismas props (`variant`, `size`, `asChild`) en todos los componentes.

## Paquetes

| Paquete | Descripción |
| --- | --- |
| [`@betterlibs/tokens`](packages/tokens) | Design tokens y temas como variables CSS |
| [`@betterlibs/react`](packages/react) | Componentes, bloques y patrones |
| [`@betterlibs/motion`](packages/motion) | Entradas, secuencias, cifras, lectura y posiciones opcionales, con preferencias y carga diferida |
| [`@betterlibs/icons`](packages/icons) | Iconos SVG como componentes React |

## Preset editorial

El nuevo estilo combina marfil, carbón y lima, Space Grotesk en titulares y superficies planas.
Actívalo en toda la página o en un contenedor:

```tsx
import '@betterlibs/tokens/index.css'
import '@betterlibs/tokens/editorial.css'
import '@betterlibs/react/styles.css'

<div data-preset="editorial">…</div>
```

Carga Space Grotesk e Inter en tu aplicación o configura tus fuentes. Para personalizar el preset:

```ts
import { createTheme, editorial } from '@betterlibs/tokens'

const theme = createTheme({ preset: editorial, brand: '#0f766e' })
```

Storybook permite cambiar entre estilos con **Estilo → Editorial** y combinarlo con tema y marca.
Los roles de movimiento, stagger y springs están disponibles en `@betterlibs/tokens`.
`@betterlibs/motion` ofrece animación opcional con preferencias, Reveal, Stagger y Presence.
Consulta [el plan](PLAN_UI_MOTION.md).

## Arrancar con Docker

```bash
./docker.sh
```

Arranca en segundo plano la web en http://localhost:8080, la documentación en
http://localhost:3000/docs y Storybook en http://localhost:6006. Los cambios de fuentes se
recargan y los contenedores tienen reinicio automático al arrancar Docker.
No necesitas instalar Node ni pnpm en el host. [Guía de Docker](docker/README.md).

## Plantillas editoriales

La portada enlaza tres composiciones completas, con temas y movimiento configurable:

- Producto: `/plantillas/producto`, con tablero, precios y formulario.
- Estudio: `/plantillas/estudio`, con casos de trabajo, proceso y equipo.
- Artículo: `/plantillas/articulo`, con índice y progreso de lectura.

En Docker comparten el origen `http://localhost:8080`. El código editable está en
`apps/playground/src/templates/editorial`; las imágenes SVG son locales. Las recetas de navegación
se prueban en el playground y en Next App Router. [Estado y siguiente fase](PLAN_UI_MOTION.md).

## Desarrollo

Entorno verificado: Node 24 y pnpm 12.4.1 (versión declarada en `packageManager`).

```bash
pnpm install
pnpm build       # compila todos los paquetes
pnpm typecheck   # comprueba tipos
pnpm lint        # lint + formato (Biome)
pnpm test        # tests
pnpm test:e2e    # axe + teclado sobre Storybook y las plantillas (tras pnpm build)
pnpm lighthouse  # Lighthouse CI sobre las plantillas
pnpm size        # presupuesto de tamaño
```

## Estado del rediseño

Las fases 0–7 del [plan de UI y movimiento](PLAN_UI_MOTION.md) están terminadas: fundamentos,
UI editorial, movimiento opcional, catálogo, tres plantillas y documentación. La fase 8 cierra
calidad y distribución: comprobaciones entre motores, referencias visuales, rendimiento y publicación.
El historial anterior vive en [PLAN.md](PLAN.md); no acredita una versión publicada del rediseño.

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md). Licencia [MIT](LICENSE).

## Storybook

```bash
pnpm --filter @betterlibs/storybook dev   # http://localhost:6006
```

## Documentación

En Docker: [portada](http://localhost:3000), [galería](http://localhost:3000/docs/galeria) y
[referencia de movimiento](http://localhost:3000/docs/movimiento). La galería reúne componentes,
movimiento, secciones y páginas con código copiable, tema, preset y preferencias por ejemplo.
Las guías cubren instalación local, primera página, SSR, Radix, rendimiento, navegación y migración.


```bash
pnpm --filter @betterlibs/docs dev   # http://localhost:3000
```

## Playground y plantillas

Piloto de UI y movimiento de Betterlibs en la portada. Incluye ejemplos interactivos, tema
claro/oscuro y controles de movimiento. La web corporativa sigue disponible en
`/plantillas/corporativa`, con sus páginas de servicios, equipo, contacto, blog y contenido legal.

```bash
pnpm --filter @betterlibs/playground dev   # http://localhost:5173
```

Los enlaces de documentación apuntan a `http://localhost:3000/docs` durante el desarrollo.
Para usar otro dominio, configura `VITE_DOCS_URL` siguiendo
[`apps/playground/.env.example`](apps/playground/.env.example).

El estado de esta nueva dirección está en [PLAN_UI_MOTION.md](PLAN_UI_MOTION.md).
La fase 8 está en curso. El [recorrido de revisión manual y evidencias](docs/quality/README.md)
incluye lectores de pantalla y los pasos para cerrar las referencias visuales Linux.
`pnpm prepare:release` prepara una candidata RC con changelog, tarballs y consumo aislado.

Para desarrollo fuera de Docker, configura `NEXT_PUBLIC_PLAYGROUND_URL=http://localhost:5173`
en `apps/docs/.env.local`; la documentación enlaza 8080 por defecto. Puedes cambiar Storybook con
`NEXT_PUBLIC_STORYBOOK_URL`. Docker calcula ambos enlaces a partir de los puertos de `.env`.

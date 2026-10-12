# Betterlibs UI

Librería de componentes React para **construir webs con identidad**: UI accesible, componentes
personalizables y bloques de página. La nueva dirección editorial y de movimiento está en desarrollo.

```bash
pnpm add @betterlibs/react @betterlibs/tokens @betterlibs/icons
```

```tsx
import '@betterlibs/tokens/index.css'
import '@betterlibs/react/styles.css'
```

## Principios

- **Accesibilidad WCAG 2.2 AA** como mínimo: teclado, foco visible, contraste y ARIA correctos.
- **Tu marca, no la nuestra**: todo el estilo sale de design tokens (variables CSS).
- **Sin runtime de estilos**: CSS Modules + variables CSS, compatible con SSR y React Server Components.
- **Bloques listos para usar**: hero, testimonios, precios, FAQ, contacto, cookies (RGPD)…
- **API predecible**: las mismas props (`variant`, `size`, `asChild`) en todos los componentes.

## Paquetes

| Paquete | Descripción |
| --- | --- |
| [`@betterlibs/tokens`](packages/tokens) | Design tokens y temas como variables CSS |
| [`@betterlibs/react`](packages/react) | Componentes, bloques y patrones |
| [`@betterlibs/motion`](packages/motion) | Entradas, secuencias y salidas opcionales, con preferencias y carga diferida |
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

## Desarrollo

Requisitos: Node ≥ 22 y pnpm (`corepack enable`).

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

## Roadmap

- [x] **Fase 0** — Monorepo, tooling y CI
- [x] **Fase 1** — Tokens y theming
- [x] **Fase 2** — Layout y componentes base
- [x] **Fase 3** — Formularios
- [x] **Fase 4** — Interactivos y overlays
- [x] **Fase 5** — Navegación
- [x] **Fase 6** — Bloques corporativos
- [x] **Fase 7** — Plantillas y documentación completa
- [x] **Fase 8** — Endurecimiento y release 1.0

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md). Licencia [MIT](LICENSE).

## Storybook

```bash
pnpm --filter @betterlibs/storybook dev   # http://localhost:6006
```

## Documentación

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

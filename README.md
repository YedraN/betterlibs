# Betterlibs UI

Librería de componentes React para **webs corporativas y profesionales**: accesible por defecto,
fácil de adaptar a cualquier marca y pensada para que tus páginas se entiendan a la primera.

> 🚧 En desarrollo. Consulta el [roadmap](#roadmap) para ver en qué fase estamos.

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
| [`@betterlibs/icons`](packages/icons) | Iconos SVG como componentes React |

## Desarrollo

Requisitos: Node ≥ 22 y pnpm (`corepack enable`).

```bash
pnpm install
pnpm build       # compila todos los paquetes
pnpm typecheck   # comprueba tipos
pnpm lint        # lint + formato (Biome)
pnpm test        # tests
```

## Roadmap

- [x] **Fase 0** — Monorepo, tooling y CI
- [ ] **Fase 1** — Tokens y theming
- [ ] **Fase 2** — Layout y componentes base
- [ ] **Fase 3** — Formularios
- [ ] **Fase 4** — Interactivos y overlays
- [ ] **Fase 5** — Navegación
- [ ] **Fase 6** — Bloques corporativos
- [ ] **Fase 7** — Plantillas y documentación completa
- [ ] **Fase 8** — Endurecimiento y release 1.0

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md). Licencia [MIT](LICENSE).

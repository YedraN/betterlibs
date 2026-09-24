# Betterlibs UI — Plan y estado del proyecto

> Documento de continuidad: léelo al empezar una nueva sesión para saber qué hay hecho,
> qué decisiones se tomaron y por dónde seguir.
>
> **Última actualización:** 2026-09-24 · **Última fase completada:** Fase 2 (commit `52642c7`)
> **Siguiente paso:** Fase 3 — Formularios

---

## 1. Qué es el proyecto

Librería de componentes **React + TypeScript** para **webs corporativas y profesionales**
(home, servicios, sobre nosotros, contacto, blog, páginas legales), con documentación completa y
prioridad absoluta en **UX y accesibilidad (WCAG 2.2 AA)**.

El repo empezó siendo un catálogo de librerías Node.js («Betterlibs»); en la Fase 0 se descartó ese
código y se reconvirtió en esta librería.

## 2. Forma de trabajar (acordada con el usuario)

- **No perder tiempo revisando ni testeando durante la fase.**
- Al terminar cada fase: **una única comprobación general** (lint + typecheck + test + build) y,
  si pasa, **commit + push inmediato** a `main` con un mensaje claro (en español, prefijo
  `feat:`/`chore:`…) terminado en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Comunicación con el usuario en **español**.

Comprobación general (desde la raíz):

```bash
pnpm check        # Biome: lint + formato con autofix (solo warnings permitidos)
pnpm typecheck    # turbo: todos los paquetes y apps
pnpm test         # turbo: vitest en tokens y react
pnpm build        # turbo: tokens, icons, react, storybook y docs
```

## 3. Decisiones técnicas

| Tema | Decisión |
| --- | --- |
| Monorepo | pnpm 12 workspaces + Turborepo |
| Lenguaje | TypeScript 6.0.3 estricto (`tsconfig.base.json`). Se evitó TS 7 por compatibilidad |
| Lint/formato | Biome 2.5 (comillas simples, sin punto y coma, 100 columnas) + Husky/lint-staged |
| Versionado | Changesets (paquetes `@betterlibs/*` enlazados) |
| Estilos | Tokens como **variables CSS** + **CSS Modules**, sin runtime. Todo en `@layer bl.tokens, bl.reset, bl.base, bl.components` para que los estilos del usuario siempre ganen |
| Clases CSS | Legibles y estables: `bl-{componente}-{clase}` (ver `packages/react/css-modules.js`) |
| Comportamiento accesible | Radix Primitives (a partir de la Fase 4); `@radix-ui/react-slot` para `asChild` |
| RSC | Solo los componentes con estado llevan `'use client'` (Rolldown lo conserva solo) |
| API común | `variant`, `size`, `tone`, `asChild`, `as` (layout/texto), `className`, `style`, `ref` como prop (React 19) |
| Textos por defecto | En español y sobrescribibles por props (`loadingLabel`, `newTabLabel`, `removeLabel`…) |
| Docs | Next.js 16 + Fumadocs 16 (MDX), en español, búsqueda Orama en español |
| Storybook | 10.6 (react-vite) + addon-docs (autodocs global) + addon-a11y |
| Tests | Vitest 5 + Testing Library + jsdom + axe-core (helper `expectNoA11yViolations`) |
| Scope npm | `@betterlibs/*` · Licencia MIT |

## 4. Estructura del repo

```
packages/
  tokens/     @betterlibs/tokens  → tokens TS → dist/{index,tokens,reset,base}.css + tokens.json
              src/primitives.ts, semantic.ts, color.ts (OKLCH, contraste), css.ts, create-theme.ts
              scripts/build-css.ts (Node ejecuta .ts nativo; falla si el tema no cumple WCAG AA)
  icons/      @betterlibs/icons   → 58 iconos (createIcon), sufijo *Icon, build con tsc
  react/      @betterlibs/react   → src/components/<Nombre>/<Nombre>.tsx + .module.css (+ stories)
              src/utils/{cx,types}.ts · src/test/{setup,axe}.ts
              tests agrupados: src/components/{layout,base}.test.tsx
              build: vite (lib, preserveModules) + tsc (solo .d.ts)
apps/
  storybook/  stories de fundamentos y theming en src/; las de componentes viven en packages/react
  docs/       Next.js + Fumadocs; contenido en content/docs/**; componentes MDX en components/docs
```

## 5. Estado por fases

### ✅ Fase 0 — Monorepo y tooling (commit `63f46e6`)
- Eliminado el catálogo antiguo y `node_modules`/`dist` del repo; `.gitignore`.
- pnpm + Turborepo, TS estricto, Biome, Changesets, Husky + lint-staged.
- CI GitHub Actions (`.github/workflows/ci.yml`): lint → typecheck → test → build.
- README, CONTRIBUTING, LICENSE, plantilla de PR con la *Definition of Done*.

### ✅ Fase 1 — Tokens y theming (commit `8136163`)
- Primitivos: colores (neutral, brand, success, warning, danger, info), tipografía fluida con
  `clamp()`, espaciado base 4px, radios (+ presets sharp/soft/round), sombras (claro/oscuro),
  movimiento, breakpoints, contenedores, z-index, alturas de control (md = 44px), foco.
- Semánticos claro/oscuro (`--bl-color-bg`, `text-muted`, `border-input`, `accent`, `on-accent`,
  `accent-text`, `focus-ring`, estados `*-bg/-border/-text/-solid/on-*`).
- 42 pares de contraste verificados en build (`contrastPairs` en `semantic.ts`).
- `createTheme({ brand, radius, fontSans, fontDisplay, fontMono, selector, strict })`:
  escala OKLCH conservando el color exacto, elige tonos accesibles, `ThemeContrastError`.
- Reset + base (foco visible, reduced motion, `:target` scroll margin).
- Storybook: toolbar de tema (claro/oscuro/sistema) y marca, páginas de fundamentos y
  **Generador de tema** interactivo.

### ✅ Fase 2 — Layout, base, iconos y docs (commit `52642c7`)
- **Layout:** Container, Section (tonos default/subtle/muted/brand/dark/light), Stack
  (`stackBelow`), Grid (columnas responsive `{ base, sm, md, lg, xl }` o `minItemWidth`), Box,
  Divider, AspectRatio.
- **Tipografía:** Heading (`level` ≠ `size`), Text (body/lead/eyebrow/caption/label, `lines`), Link
  (inline/standalone/subtle, `arrow`, externos anunciados, `asChild`).
- **Acciones:** Button (primary/secondary/outline/ghost/danger, sm/md/lg, iconos, `loading`
  accesible, `asChild`), IconButton (`label` obligatorio), ButtonGroup (`attached`, `stackBelow`).
- **Contenido:** Badge, Tag (enlazable/eliminable), Avatar + AvatarGroup (`'use client'`), Image,
  Icon. **Feedback/a11y:** Spinner, Skeleton, SkipLink, VisuallyHidden.
- Tokens: `data-theme` funciona también en elementos anidados.
- **Iconos:** 58 iconos (flechas, acciones, contacto, personas, estados, negocio, interfaz).
- **Docs:** introducción; primeros pasos (instalación, Next.js, Vite, Astro, primera página);
  fundamentos (tokens, color, tipografía, espaciado, layout, forma, movimiento, iconografía,
  modo oscuro y marca, accesibilidad); resumen de componentes. `<Preview>` sincroniza el modo
  oscuro de Fumadocs con `data-theme`.

### ⏳ Fase 3 — Formularios (SIGUIENTE)
- `Field` (label + ayuda + error enlazados con `aria-describedby`, indicador de obligatorio/opcional).
- `Input` (tipos, prefijo/sufijo, iconos), `Textarea` (contador de caracteres), `Select` nativo
  estilizado, `Checkbox`, `RadioGroup`, `Switch`, `FileInput`.
- `Form` con patrón de **resumen de errores** que mueve el foco al primer campo inválido.
- Estados: hover, foco, deshabilitado, solo lectura, error, éxito. Bordes con `--bl-color-border-input`.
- Textos por defecto en español («(opcional)», «Este campo es obligatorio»…).
- Guía en docs: «Formulario de contacto accesible». Stories + tests + axe.

### Fase 4 — Interactivos y overlays
Dialog, Drawer, DropdownMenu, Popover, Tooltip, Tabs, Accordion, Toast, Carousel (con pausa, sin
autoplay por defecto), Pagination, Breadcrumb. Sobre **Radix Primitives** con estilos propios;
cuidado con foco, scroll lock y animaciones (`--bl-duration-slow`, reduced motion).

### Fase 5 — Navegación
Header (sticky, ocultar al hacer scroll opcional) con NavigationMenu/mega-menú y menú móvil
accesible, Footer (columnas, legal, redes), AnnouncementBar. **Añadir iconos de redes sociales**
(LinkedIn, X, Instagram, Facebook, YouTube, GitHub) al paquete de iconos.

### Fase 6 — Bloques corporativos
Hero (centrado, split, con imagen/vídeo), FeatureGrid, LogoCloud, Stats, Testimonials, Pricing, CTA,
TeamGrid, Timeline, FAQ, ContactSection, BlogGrid/PostCard, CaseStudyCard, Newsletter,
CookieConsent (RGPD/LSSI: categorías, aceptar y rechazar igual de visibles). 2–3 variantes cada uno.

### Fase 7 — Plantillas y documentación completa
- `apps/playground` (Vite) con 6 plantillas: home corporativa, servicios, sobre nosotros, contacto,
  blog (listado + artículo), página legal.
- **Página de docs por componente** con la plantilla: descripción + preview, cuándo usar / no usar,
  anatomía, variantes, ejemplos, guía UX y de textos, accesibilidad (tabla de teclado), props
  (tabla automática, p. ej. `fumadocs-typescript`) + variables CSS, relacionados.
- Generador de tema en la web de docs, galería de bloques, guías (SEO, cookies RGPD,
  sobrescribir estilos), changelog, roadmap, contribuir, FAQ.

### Fase 8 — Endurecimiento y release 1.0
Auditoría de accesibilidad (axe + NVDA + teclado), regresión visual (Storybook test-runner +
Playwright o Chromatic), `size-limit` en CI, Lighthouse ≥ 95 en plantillas, publicar en npm con
Changesets, desplegar docs y Storybook (Vercel, configurar `NEXT_PUBLIC_STORYBOOK_URL`), v1.0.0.

## 6. Definition of Done por componente

- [ ] Props tipadas con JSDoc en español
- [ ] CSS Module dentro de `@layer bl.components`, solo tokens `var(--bl-*)`, propiedades lógicas
- [ ] Todos los estados (hover, focus-visible, active, disabled, loading, error…)
- [ ] Story con variantes/tamaños/estados (autodocs activado globalmente)
- [ ] Test con Testing Library + `expectNoA11yViolations`
- [ ] Exportado en `packages/react/src/index.ts`
- [ ] (Fase 7) Página de documentación completa

## 7. Detalles prácticos y trampas conocidas

- **Bash en Windows:** los heredocs largos con comillas fallan en la herramienta Bash; usar la
  herramienta Write para crear archivos. Para commits multilínea usar Bash con `git commit -F - <<'EOF'`
  (en PowerShell el here-string rompe el mensaje).
- **pnpm 12:** los scripts de instalación bloqueados son error → se autorizan en
  `pnpm-workspace.yaml` (`allowBuilds`). Las versiones muy recientes pueden necesitar
  `minimumReleaseAgeExclude`.
- **Biome reordena imports/exports** (organizeImports): no poner comentarios de sección entre
  exports en `index.ts`. Tailwind en CSS de docs requiere `css.parser.tailwindDirectives`.
- **Stories de componentes** viven en `packages/react/src`, pero se typecheckean desde
  `apps/storybook/tsconfig.json`; `packages/react` las excluye y tiene `@storybook/react-vite` como
  devDependency solo para resolver tipos.
- `packages/react/css-modules.js` es compartido por el build y Storybook (`viteFinal`);
  por eso `allowJs` en ambos tsconfig.
- Tokens: `themeCss()` genera `:root`, media `prefers-color-scheme`, `[data-theme="dark"]` y
  `[data-theme="light"]` anidados. `createTheme` con `selector` distinto de `:root` para varias marcas.
- Docs: solo se importan `tokens.css` + `styles.css` (no reset/base) para no chocar con Fumadocs.
  Los ejemplos van dentro de `<Preview>`.
- Nombres de iconos con sufijo `Icon` (`ArrowRightIcon`) para no chocar con componentes.

## 8. Comandos útiles

```bash
pnpm install
pnpm --filter @betterlibs/storybook dev   # http://localhost:6006
pnpm --filter @betterlibs/docs dev        # http://localhost:3000
pnpm --filter @betterlibs/react test
pnpm changeset                            # al publicar cambios de paquetes
```

# Betterlibs UI — Plan y estado del proyecto

> Documento de continuidad: léelo al empezar una nueva sesión para saber qué hay hecho,
> qué decisiones se tomaron y por dónde seguir.
>
> **Última actualización:** 2026-09-27 · **Última fase completada:** Fase 7 — Plantillas y documentación
> **Siguiente paso:** Fase 8 — Endurecimiento y release 1.0

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
  icons/      @betterlibs/icons   → 64 iconos (createIcon), sufijo *Icon, build con tsc
  react/      @betterlibs/react   → src/components/<Nombre>/<Nombre>.tsx + .module.css (+ stories)
              src/blocks/<Bloque>/… (secciones completas, Fase 6)
              src/utils/{cx,types}.ts · src/test/{setup,axe}.ts
              tests agrupados: src/components/{layout,base}.test.tsx
              build: vite (lib, preserveModules) + tsc (solo .d.ts)
apps/
  storybook/  stories de fundamentos y theming en src/; las de componentes viven en packages/react
  docs/       Next.js + Fumadocs; contenido en content/docs/**; componentes MDX en components/docs;
              scripts/generate-api.ts → generated/api.json (props y CSS de la librería)
  playground/ Vite: web de ejemplo con las 6 plantillas (Fase 7)
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
- 50 pares de contraste verificados en build (42 en la Fase 1 + 8 de formularios en la Fase 3) (`contrastPairs` en `semantic.ts`).
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
- **Iconos:** 58 iconos (flechas, acciones, contacto, personas, estados, negocio, interfaz); 64 tras la Fase 5.
- **Docs:** introducción; primeros pasos (instalación, Next.js, Vite, Astro, primera página);
  fundamentos (tokens, color, tipografía, espaciado, layout, forma, movimiento, iconografía,
  modo oscuro y marca, accesibilidad); resumen de componentes. `<Preview>` sincroniza el modo
  oscuro de Fumadocs con `data-theme`.

### ✅ Fase 3 — Formularios (2026-09-27)
- **Field** (`'use client'`): etiqueta + ayuda + error/éxito enlazados (`htmlFor`, `aria-describedby`);
  el error va **sobre el control** (patrón GOV.UK) con icono y prefijo oculto «Error:». `name` e `id`
  se pasan al control por contexto; el control también registra su `name` para encontrar su error.
  `indicator`: `required` (asterisco `aria-hidden`), `optional` («(opcional)») o `none`. `hideLabel`.
- **useFieldControl** (exportado): conecta controles propios o de terceros con `Field`/`Form`.
- **Controles:** `Input` (prefijo/sufijo decorativos, iconos, ver contraseña con `aria-pressed`,
  clic en el marco enfoca), `Textarea` (contador + aviso por `aria-live` solo al 80 % y con debounce,
  `autoResize` con `field-sizing`), `Select` nativo (`placeholder`, `options` con grupos),
  `Checkbox` (`indeterminate`, error propio) + `CheckboxGroup`, `RadioGroup` + `Radio` (fieldset con
  `role="radiogroup"`), `Switch` (`input role="switch"`), `FileInput` (input nativo transparente
  sobre la zona: clic, arrastre y teclado; lista con tamaño y botón de quitar), `Fieldset`.
  Variante `card` para casillas y radios.
- **Form:** valida al enviar con la API nativa (`noValidate` + mensajes propios en español,
  `messages` para cambiarlos) + `validate(data)`; `CheckboxGroup required` = al menos una. Con
  errores cancela el envío (también las `action` de React 19), muestra `ErrorSummary` enlazado y
  lleva el foco al resumen (`focusOnError="field"` para ir al campo). Revalida al salir del campo
  (o al cambiar en casillas/radios/select/archivos). `errors` = errores del servidor, se ocultan al
  modificar el campo. Nota automática «Los campos marcados con * son obligatorios».
- **Alert** (info/success/warning/danger, `actions`, `onDismiss`) y **ErrorSummary** suelto.
- Estilos compartidos en `Field/Control.module.css` (`bl-control-*`) y `Checkbox/Choice.module.css`
  (`bl-choice-*`). Casillas y switches activados usan `accent-text` (contraste garantizado con
  marcas claras). 8 pares de contraste nuevos (errores, éxito y bordes de estado).
- **Docs:** página «Formularios» (componentes/formularios) y sección **Guías** con «Formulario de
  contacto accesible» (demo interactiva `ContactFormDemo` en `components/docs`).
- Stories: `Componentes/Formularios/{Field,Checkbox,Form}` y `Componentes/Feedback/Alert`.
  Tests: `src/components/forms.test.tsx` (incluye axe con errores visibles).

### ✅ Fase 4 — Interactivos y overlays (2026-09-27)
- Radix Primitives fijados (dialog 1.1.23, dropdown-menu 2.1.24, popover 1.1.23, tooltip 1.2.16,
  tabs 1.1.21, accordion 1.2.20, toast 1.2.23) como `dependencies` de `@betterlibs/react`.
- **Dialog / Drawer** (`Dialog/panel.tsx` compartido): `title` obligatorio, `description`,
  `footer`, `size`; el botón Cerrar va al final del DOM para que el foco inicial caiga en el
  contenido. Drawer con `side` físico (right/left/bottom/top). Centrado con `inset: 0; margin: auto`.
- **Popover** (`title` → `aria-labelledby`, `closeButton`, `width`, flecha), **Tooltip** (API de una
  pieza `content` + hijo; incluye su propio `Provider`), **DropdownMenu** (item con `icon`, `hint`,
  `tone="danger"`, `asChild`; checkbox/radio items, label, separator, submenús).
- **Tabs** (`line`/`pill`, `fullWidth`, vertical, scroll horizontal en móvil) y **Accordion**
  (`single` + `collapsible` por defecto, `headingLevel`, variantes default/bordered/separated,
  animación de altura con `--radix-accordion-content-height`).
- **Toast**: almacén propio (`Toast/store.ts`, `useSyncExternalStore`) con `toast()`,
  `toast.success/error/warning/info/dismiss`; `<Toaster />` con Radix Toast (errores
  `foreground`, con acción duración infinita, máx. 4 visibles, viewport en portal).
- **Carousel** propio (sin Radix): scroll-snap nativo, patrón WAI-ARIA (`aria-roledescription`,
  diapositivas `role="group"` «1 de 5»), controles antes de las diapositivas en el DOM, anuncio
  `aria-live` solo en cambios del usuario, sin autoplay por defecto; con autoplay: botón de pausa,
  pausa al hover, parada al entrar con el teclado y nunca con «reducir movimiento».
- **Pagination** (`paginationRange`, enlaces con `getHref` + `linkAs` o botones con
  `onPageChange`, resumen «Página N de M» en móvil) y **Breadcrumb** (`linkAs`, JSON-LD
  `BreadcrumbList` con `schemaBaseUrl`). Ambos sin estado: válidos en Server Components.
- **PortalProvider / usePortalContainer**: dónde se montan los overlays (temas anidados). La
  `Preview` de las docs crea un contenedor en `<body>` con el `data-theme` de la documentación.
- Estilos flotantes compartidos en `Popover/Floating.module.css` (`bl-floating-*`); todas las
  animaciones se anulan con `prefers-reduced-motion`.
- **Docs:** páginas «Interactivos y overlays» y «Navegación» (demo `ToastDemo`).
  Stories: `Componentes/Overlays/Dialog`, `Contenido interactivo/{Tabs,Carousel}`,
  `Feedback/Toast`, `Navegación/Pagination`. Tests: `src/components/interactive.test.tsx`.

### ✅ Fase 5 — Navegación (2026-09-27)
- `@radix-ui/react-navigation-menu` 1.2.22.
- **Tipos de navegación** (`NavigationMenu/types.ts`): `NavItem` = `NavLink` (`label`, `href`,
  `description`, `icon`, `current`) o `NavSection` (`links` = desplegable, `groups` = mega menú,
  `featured`, `overview` = «Ver todo»). `isCurrentLink` normaliza barra final, query y ancla.
- **NavigationMenu** (escritorio, Radix): desplegables junto al disparador y mega menús a todo el
  ancho de la barra (se anula con `!important` el `position: relative` en línea que Radix pone al
  `div` que envuelve la lista). Página actual con `aria-current` + barra inferior.
- **MobileNav**: lista con secciones desplegables (`aria-expanded`); la sección actual empieza
  abierta; `onNavigate` para cerrar el panel.
- **Header**: `SkipLink` a `#main` incluido (`skipLink={false}` para quitarlo), logo, navegación,
  `actions`, menú móvil en `Drawer` (se cierra al navegar), `sticky` (sombra al hacer scroll) y
  `hideOnScroll` (no se oculta con el menú abierto ni con el foco dentro). El cambio a móvil usa
  **container queries** sobre la propia cabecera (`collapseBelow`: md/lg/xl), no media queries.
- **Footer** (sin estado): marca, `description`, columnas con `h2`, `SocialLinks`, bloque libre
  (`children`), franja legal y `tone` subtle/default/dark (`data-theme`).
- **SocialLinks** (sin estado) y **AnnouncementBar** (`role="region"` con nombre, tonos,
  `dismissible` + `storageKey` en `localStorage`).
- **Iconos:** LinkedIn, X, Instagram, Facebook, YouTube y GitHub en versión de trazo (64 en total).
- **Docs:** página «Navegación» ampliada (Header con mega menú, AnnouncementBar, Footer,
  SocialLinks) y nota de iconos de redes en «Iconografía». Stories en
  `Componentes/Navegación/Header`. Tests: `src/components/navigation.test.tsx`.

### ✅ Fase 6 — Bloques corporativos (2026-09-27)
- Bloques en `packages/react/src/blocks/` (clases `bl-{bloque}-*`). Esqueleto común en
  `blocks/shared.tsx`: `BlockSection` (Section + Container + `SectionHeader`) y `BlockBaseProps`
  (`eyebrow`, `title`, `description`, `actions`, `align`, `headingLevel`, `tone`, `spacing`,
  `containerSize`, `id`). El `id` del título sale del `id` o de un slug del título (**sin hooks**,
  para que los bloques sin estado sean Server Components); los títulos internos usan el nivel
  siguiente (`itemHeadingLevel`). Tarjetas enlazadas: título = único enlace con `::after`
  (`Block.module.css`: `cardLink`, `linkedCard`, `more`).
- **SectionHeader** (componente público): antetítulo, título, entradilla y acciones.
- **Hero** (`split`/`centered`/`background`, `h1` por defecto, `size`; fondo fuerza `data-theme`
  oscuro + capa) con **HeroVideo** (cliente: silenciado, bucle, pausa, respeta reducir movimiento).
- **FeatureGrid** (cards/plain/list), **LogoCloud** (row/grid, `grayscale`), **Stats** (`<dl>`:
  etiqueta antes que la cifra en el DOM, `order` en CSS), **Timeline** (`<ol>`, vertical/steps),
  **CTA** (panel/centered/split, `panelTone`).
- **Testimonials** (grid/carousel/featured) + **TestimonialCard** (`figure`/`blockquote`/
  `figcaption`, valoración como texto), **TeamGrid** (cards/compact; redes «Nombre en LinkedIn»),
  **CaseStudyCard** (métricas en `<dl>`), **BlogGrid** (grid/list/featured) + **PostCard** (fecha
  `formatPostDate` en UTC para evitar desajustes de hidratación).
- **Pricing** (cliente): precios por periodo (`{ mensual, anual }`), selector de radios nativos,
  plan destacado, «No incluido:» oculto para lectores. **FAQ** (accordion/split/columns,
  `structuredData` → JSON-LD `FAQPage`). **ContactSection** (datos en `<address>`, formulario como
  hijo). **Newsletter** (cliente: `onSubscribe`, estados, consentimiento; section/split/inline).
- **CookieConsent** (RGPD/LSSI/AEPD): aviso no modal con «Rechazar todas» y «Aceptar todas» con el
  mismo estilo, configuración por categorías en `Dialog` con `Switch`, sin casillas premarcadas,
  `version` + `maxAgeDays`, `scroll-padding-bottom` para no tapar el foco. Store propio
  (`'use client'`) con `useCookieConsent`, `cookieConsent.open/reset/update`. **ConsentGate**
  bloquea contenidos de terceros hasta tener permiso.
- Datos de ejemplo compartidos en `src/test/sample-data.tsx` (fuera del paquete publicado).
- **Docs:** sección **Bloques** (introducción, Hero y CTA, Contenido, Confianza, Blog, Conversión,
  Cookies con guía RGPD y lista de comprobación). Demos cliente en `components/docs/blocks-demos.tsx`.
  Stories `Bloques/*`. Tests: `src/blocks/blocks.test.tsx` (incluye axe sobre una página completa).

### ✅ Fase 7 — Plantillas y documentación completa (2026-09-27)
- **`apps/playground`** (Vite + React 19, puerto 5173): web completa de «Norte Consultores» con
  6 plantillas (`src/templates/`: Home, Services, About, Contact, Blog + Article, Legal) y 404.
  Esqueleto común en `src/site/SiteLayout.tsx` (CookieConsent, AnnouncementBar, Header,
  Footer, Toaster); datos en `src/site/data.tsx`; router mínimo con History API
  (`src/site/router.tsx`, `RouterLink` para `linkAs`); al cambiar de ruta el foco va al `h1`.
- **Prose** (componente nuevo): tipografía para contenido enriquecido con `:where()`.
- **Referencia automática**: `apps/docs/scripts/generate-api.ts` (TypeScript compiler API) genera
  `apps/docs/generated/api.json` (ignorado en git) antes de `dev`/`build`/`typecheck`: props
  propias de cada `*Props` exportado (tipo escrito, alias expandidos, JSDoc, `@default`, archivo
  de origen) y, por cada CSS Module, clases `bl-*` y tokens usados. Componentes MDX
  `<PropsTable name hideBlockBase>` (sobre el `TypeTable` de Fumadocs) y `<CssReference module>`;
  fallan en el build si el nombre no existe.
- **Docs reestructuradas**: `componentes/{layout,tipografia,acciones,contenido,feedback,
  formularios,overlays,interactivos,navegacion,utilidades}/` con **una página por componente**
  (preview, cuándo usar, opciones, textos, accesibilidad con tabla de teclado, props, anatomía
  y CSS, relacionados). Tablas de props en todos los bloques.
- **Generador de tema** en `fundamentos/generador-de-tema` (`components/docs/theme-builder.tsx`,
  con componentes reales, modo claro/oscuro, escala, informe de contraste y copiar código/CSS).
- **Guías**: SEO y Sobrescribir estilos (+ enlace a Cookies y RGPD). **Recursos**: Plantillas,
  Preguntas frecuentes, Roadmap, Novedades y Contribuir. Enlace «Plantillas» en la cabecera
  (`NEXT_PUBLIC_PLAYGROUND_URL`, por defecto `http://localhost:5173`).

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
- [ ] Página de documentación (`componentes/<familia>/<nombre>.mdx`) con `<PropsTable>` y `<CssReference>`

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
- **Contexto = `'use client'`:** cualquier módulo que llame a `createContext` o use hooks necesita la
  directiva (el barrel `index.ts` se importa desde Server Components).
- **React 19.3:** `onChange` de `<form>` recibe `ChangeEvent<HTMLFormElement>`, no `FormEvent`.
- **jsdom:** `ana@empresa` es un email válido según HTML; en tests usa algo sin `@`. No implementa
  `scrollIntoView` ni `CSS.escape` (usar `?.()` y evitar `CSS.escape`).
- **Radix en jsdom:** `src/test/setup.ts` define stubs de `ResizeObserver`, `scrollIntoView` y
  `*PointerCapture`. Los menús se abren con teclado en los tests (Tab + Enter). Con un `Dialog`
  abierto, pasa axe sobre el diálogo, no sobre `body` (Radix pone `aria-hidden` al resto).
- **`matchMedia`** no existe en jsdom: `usePrefersReducedMotion` lo comprueba antes de usarlo.
- **MDX:** `{algo}` en texto normal es una expresión JS (rompe el build): escríbelo como código o
  reformula. Los valores del frontmatter con «: » rompen el YAML: evita los dos puntos o usa comillas.
  Los ejemplos en MDX son Server Components: no pases funciones como props a componentes con
  `'use client'` (sí a los que no lo tienen, como `Pagination`); para demos interactivas, crea un
  componente cliente en `components/docs` y regístralo en `components/mdx.tsx`.
- **Server Components y hooks:** un módulo sin `'use client'` que importa hooks de React
  (`useSyncExternalStore`…) se evalúa en el servidor si lo importa el barrel. Marca con
  `'use client'` los stores/hooks de cliente, y no uses `useId` en bloques sin estado.
- **HTML válido:** nada de encabezados dentro de `<dt>` ni elementos sueltos dentro de los grupos
  de un `<dl>` (solo `dt`/`dd`).
- **Stories:** cualquier `export` de un `*.stories.tsx` se toma como story; los datos de ejemplo
  van en constantes sin exportar.
- **Container queries:** una `@container` no puede estilar al propio contenedor, solo a sus
  descendientes (por eso `Header` oculta `.desktopNav`/`.actions`/`.menuButton`, no `.root`).
- **Tokens de espaciado:** no existe `--bl-space-2-5` (la escala es 0, 0-5, 1, 1-5, 2, 3, 4…).
- **CSS Modules compartidos:** si un elemento lleva clases de dos módulos, el orden de import
  decide la cascada (`.field { padding: 0 }` pisaba al `<textarea>`; por eso no lleva `.field`).

## 8. Comandos útiles

```bash
pnpm install
pnpm --filter @betterlibs/storybook dev   # http://localhost:6006
pnpm --filter @betterlibs/docs dev        # http://localhost:3000
pnpm --filter @betterlibs/playground dev  # http://localhost:5173
pnpm --filter @betterlibs/react test
pnpm changeset                            # al publicar cambios de paquetes
```

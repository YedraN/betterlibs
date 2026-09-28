# Contribuir a Betterlibs UI

## Puesta en marcha

```bash
corepack enable
pnpm install
pnpm build
```

## Estructura

```
packages/tokens   design tokens → variables CSS
packages/react    componentes y bloques
packages/icons    iconos
apps/docs        documentación (Next.js + Fumadocs)
apps/storybook   Storybook
apps/playground  plantillas de ejemplo (prerenderizadas en el build)
apps/e2e         Playwright: axe, teclado, regresión visual y Lighthouse CI
```

## Convenciones

- **TypeScript estricto** y props documentadas con JSDoc.
- **Estilos** con CSS Modules que solo usan tokens (`var(--bl-*)`), nunca valores sueltos.
- **Clases** con prefijo `bl-`; propiedades lógicas (`margin-inline`, `padding-block`) para soportar RTL.
- **API común**: `variant`, `size`, `asChild`, `className` y `ref`; las props HTML nativas se pasan al elemento.
- **Textos por defecto** en español y sobrescribibles por props (`closeLabel`, `nextLabel`…).
- Formato y lint con **Biome** (se ejecuta solo en el pre-commit).

## Flujo

1. Crea una rama desde `main`.
2. Cumple la *Definition of Done* de la plantilla de PR.
3. Añade un changeset con `pnpm changeset` si afecta a un paquete publicado.
4. Abre la PR; la CI ejecuta lint, tipos, tests, build, `size-limit`, `publint`, axe y teclado
   (Playwright), Lighthouse y regresión visual.
5. Si cambias algo visual a propósito, regenera las capturas: Actions → **Visual** → Run workflow
   con «update».

## Publicar

Al fusionar en `main`, la acción **Release** abre el PR «versión de los paquetes» con los
changesets pendientes. Al fusionar ese PR se publica en npm (requiere el secreto `NPM_TOKEN`).

## Commits

Mensajes claros en imperativo, con prefijo de tipo: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.

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
apps/             documentación, Storybook y playground (se añaden en fases posteriores)
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
4. Abre la PR; la CI ejecuta lint, tipos, tests y build.

## Commits

Mensajes claros en imperativo, con prefijo de tipo: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.

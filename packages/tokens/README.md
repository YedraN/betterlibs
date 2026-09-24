# @betterlibs/tokens

Design tokens de Betterlibs UI como variables CSS, más `createTheme()` para crear el tema de tu marca
con contraste WCAG AA verificado.

## Uso

```ts
import '@betterlibs/tokens/index.css' // tokens + reset + base (en capas CSS)
```

Archivos disponibles: `index.css`, `tokens.css`, `reset.css`, `base.css` y `tokens.json`.

Todo está dentro de `@layer bl.tokens, bl.reset, bl.base, bl.components`, así que tus estilos
(sin capa) siempre tienen prioridad.

## Modo oscuro

Automático según `prefers-color-scheme`. Para forzarlo: `<html data-theme="dark">` o `data-theme="light"`.

## Tema de marca

```ts
import { createTheme } from '@betterlibs/tokens'

const theme = createTheme({
  brand: '#0a5cff',        // genera la escala completa en OKLCH
  radius: 'soft',          // 'sharp' | 'soft' | 'round'
  fontSans: 'Inter, sans-serif',
  selector: ':root',       // o '[data-brand="acme"]' para varias marcas
})

theme.css         // CSS listo para inyectar
theme.accessible  // true si todos los pares cumplen WCAG AA
theme.contrast    // informe detallado
```

Si algún par no cumple WCAG AA, `createTheme` lanza `ThemeContrastError` (desactívalo con `strict: false`).

## Tokens principales

| Grupo | Ejemplo |
| --- | --- |
| Color semántico | `--bl-color-bg`, `--bl-color-text-muted`, `--bl-color-accent`, `--bl-color-danger-text` |
| Tipografía | `--bl-font-size-4xl` (fluido), `--bl-font-weight-semibold`, `--bl-leading-relaxed` |
| Espaciado | `--bl-space-4`, `--bl-section-md` (fluido) |
| Forma | `--bl-radius-md`, `--bl-shadow-lg` |
| Movimiento | `--bl-duration-normal`, `--bl-ease-standard` |
| Layout | `--bl-container-xl`, `--bl-container-prose`, `--bl-z-modal`, `--bl-control-height-md` |

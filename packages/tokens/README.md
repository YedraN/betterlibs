# @betterlibs/tokens

Design tokens de Betterlibs UI como variables CSS, más `createTheme()` para crear el tema de tu marca
con contraste WCAG AA verificado.

## Uso

```ts
import '@betterlibs/tokens/index.css' // tokens + reset + base (en capas CSS)
```

Archivos disponibles: `index.css`, `tokens.css`, `reset.css`, `base.css`, `editorial.css` y `tokens.json`.

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


## Preset editorial

```tsx
import '@betterlibs/tokens/index.css'
import '@betterlibs/tokens/editorial.css'

<div data-preset="editorial" data-theme="light">…</div>
```

Marfil y carbón, acento lima, superficies planas y radios de 6–14 px. Sigue el modo del sistema
si omites `data-theme`. Puede convivir con el tema habitual o aplicarse a `<html>`.
Los titulares usan Space Grotesk y el cuerpo Inter; carga las fuentes en tu aplicación o
configura tus familias. El paquete de tokens no descarga fuentes.

Para generar CSS personalizado durante el build, en lugar del archivo del preset:

```ts
import { createTheme, editorial } from '@betterlibs/tokens'

const theme = createTheme({ preset: editorial, brand: '#0f766e', selector: '[data-brand="studio"]' })
// resolveColor(theme.semantic.light.text, theme.palette)
```

El CSS generado requiere `index.css` o `tokens.css` para los tokens comunes. El preset se activa
explícitamente durante la migración del catálogo. Los informes validan los valores completos;
los ratios se redondean solo al mostrarse, siguiendo el
[criterio de contraste de WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Verificar estos pares no certifica toda la aplicación.

## Movimiento semántico

```ts
import { motionRoles, motionStagger, motionSprings } from '@betterlibs/tokens'

motionRoles.reveal // { duration: 360, exitDuration: 180, distance: 14, easing: ... }
motionStagger     // { interval: 48, maxDelay: 240 }, en ms
motionSprings.snappy // { stiffness: 400, damping: 35, mass: 1 }
```

En CSS usa `--bl-motion-reveal-duration`, `--bl-motion-reveal-distance` y
`--bl-motion-reveal-easing`. Los roles son `feedback`, `disclosure`, `reveal` y `navigation`.
Los springs son parámetros físicos para un motor compatible, no curvas CSS.
Estos datos no inician animaciones: tu integración debe respetar `prefers-reduced-motion`,
cancelar efectos activos cuando cambie la preferencia y dejar el contenido visible sin JS.

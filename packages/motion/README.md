# @betterlibs/motion

Movimiento opcional para páginas React: `MotionProvider`, `Reveal`, `Stagger`, `Presence`, `AnimatedNumber`,
`useMotionPreferences` y `useMotionAnimation`. React 19+, Motion 14.1+ y los tokens son peers
explícitos. `@betterlibs/react` no depende de este paquete ni del motor.

```bash
pnpm add @betterlibs/motion @betterlibs/tokens motion
```

```tsx
'use client'
import { MotionProvider, Reveal, Stagger } from '@betterlibs/motion'
import '@betterlibs/tokens/index.css'

export function Features() {
  return (
    <MotionProvider mode="system" intensity="subtle">
      <ul>
        <Stagger interval={48}>
          <Reveal as="li">Identidad</Reveal>
          <Reveal as="li">Movimiento</Reveal>
        </Stagger>
      </ul>
    </MotionProvider>
  )
}
```

El HTML de servidor siempre contiene el contenido visible. El motor `motion/mini` se carga por
import dinámico al iniciar el primer efecto. Si falla la carga, falta WAAPI/IntersectionObserver
o se pide movimiento reducido, la interfaz conserva su estado funcional y visible.

| API | Contrato |
| --- | --- |
| `AnimatedNumber` | `span` con ref; `value` finito, `startValue` opcional, `locale='es-ES'`, `format` de Intl, `duration` en ms y `replayKey`. SSR y lectores de pantalla reciben el final; la copia visual se anima con RAF, sin motor. Se cancela al salir del viewport, cambiar preferencias o desmontar; los cambios rápidos continúan desde la cifra visible. |
| `MotionProvider` | Sin wrapper. `mode`: `system` (defecto), `reduced`, `off`; `intensity`: `subtle` (defecto), `standard`. El sistema reducido y las restricciones de proveedores superiores prevalecen. |
| `Reveal` | Wrapper `div` por defecto; `as` permite `section`, `article`, `aside`, `li`, `ul`, `ol`, `span`. `preset`: `rise` o `fade`; `once=true`; `replayKey` repite al cambiar si está en vista. Ref al elemento real. |
| `Stagger` | Sin wrapper. Índices de hijos inmediatos; `interval` en ms (48). Espera total máxima de 240 ms. Un fragmento cuenta como un hijo. |
| `Presence` | Wrapper con `present` booleano. `preset="fade"` por defecto o `rise`. Durante salida es `inert` y `aria-hidden`; permite invertir una salida volviendo a `present=true`. |
| `useMotionPreferences` | Política efectiva, intensidad, preferencia del sistema y `enabled`. Funciona sin proveedor con política de sistema. |
| `useMotionAnimation` | `play(elements, preset?, { delay?, exit? })` devuelve `Promise<boolean>`; `false` significa interrupción, fallo o movimiento desactivado. `cancel()` cancela todas las llamadas del hook. Presets: `rise`, `fade`, `sequence`, `press`. |

`reduced` y `off` no ejecutan animaciones en estas primitivas. La distinción se expone para que
la aplicación pueda adaptar otros comportamientos. Cada efecto respeta las variables
`--bl-motion-*` heredadas del elemento (duraciones en ms/s, distancia en px, curva cubic-bezier).
Las preferencias cambiadas y el desmontaje cancelan también los efectos que esperan al motor.

```tsx
const trigger = useRef<HTMLButtonElement>(null)
<button ref={trigger} onClick={() => setOpen(!open)}>Detalles</button>
<Presence present={open} returnFocusRef={trigger}>
  <input aria-label="Nombre" />
</Presence>
```

Si el foco estaba dentro al cerrar, `returnFocusRef` lo restaura en el control indicado. Sin esa
referencia se desenfoca el descendiente. `Presence` no sustituye Dialog, sus roles ni su trampa
de foco; no utiliza altura animada. Los controles dejan de ser accesibles inmediatamente,
aunque la salida visual aún continúe. La región cerrada se elimina al terminar o interrumpir.

Cada `Reveal`/`Presence` añade un elemento: usa `as="li"` dentro de listas y no los coloques
entre filas/celdas de tablas. No existe `asChild`. Evita transiciones CSS sobre `transform` u
`opacity` del mismo elemento; coloca hover/gestos en un hijo. El hook conserva el transform
base y restaura los estilos inline al terminar o cancelar.

En Next.js, importa desde una frontera cliente; los hijos estáticos pueden provenir de un
Server Component. No se accede a `window` ni se carga el motor durante SSR. No se incluye CSS
propio ni se requiere un router. AnimatedNumber presenta cifras sin cargar el motor.

La elección de mini frente a `m` + `LazyMotion` sigue las capacidades y costes de la
[guía oficial de Motion](https://motion.dev/docs/react-reduce-bundle-size): para estas primitivas
basta WAAPI; las posiciones usan mini y un generador de spring diferidos. Los presupuestos del repo
cuentan también el motor peer, no solo el wrapper.

Para reproducir las mediciones en este monorepo: `pnpm --filter @betterlibs/motion measure`
registra chunks iniciales/diferidos en `docs/previews/ui-motion/bundle-cost.json`; `pnpm size`
comprueba los presupuestos de la API publicada. El fixture exploratorio de layout/drag se mide
con `pnpm exec size-limit --config .size-limit.motion-experiments.json`: supera el objetivo
de 30 kB y no forma parte de la API ni se considera una capacidad aprobada.

`useLayoutTransition(ref, transitionKey, { spring?: 'snappy' | 'gentle' })` conserva posiciones
de hijos directos marcados `data-bl-layout`, con claves React estables y wrappers sin otro
transform. Cambia la clave al modificar orden/retícula. Devuelve `{ cancel }`; no añade DOM,
escala tamaños, retiene salidas ni incorpora arrastre. El orden accesible cambia inmediatamente.

`useSpringTabsIndicator(listRef, { spring })` adapta el indicador de `@betterlibs/react` TabsList.
Solo la posición usa spring: foco, selección, panel y tamaño siguen siendo inmediatos. Mantiene
el fallback CSS del servidor, ajusta el resize sin animarlo y restaura estilos al desmontar.
No importa la UI: usa su clase pública estable `.bl-tabs-indicator`. Ambos hooks cancelan en
reducido/off o al fallar la carga. El primer render no descarga la capacidad.

Para un wrapper `span` con `rise`, aplica `display: inline-block` (los elementos inline no
reemplazados no admiten transforms).

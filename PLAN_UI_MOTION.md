# Betterlibs — Plan de UI y movimiento

Actualizado: 13 de octubre de 2026. Estado: en ejecución; fases 0–7 completadas.

Punto de continuidad guardado el 13 de octubre de 2026: fases 0–7 terminadas y entorno Docker
documentado. Al retomar, comenzar la fase 8 de calidad y distribución.

Este documento define la nueva dirección. El historial de desarrollo permanece en `PLAN.md`. Las fases 10–12 de aquel documento pasan a ser un catálogo de ideas: la secuencia de trabajo propuesta es la de este plan.

## Estado de implementación

**Fase 0 — Piloto visual completado (2026-10-12).**

- La portada `/` del playground muestra Betterlibs: Header tipográfico, Hero asimétrico,
  cuatro tarjetas bento, laboratorio de componentes, acceso a la plantilla y CTA invertido.
- Paleta marfil/carbón/lima y Space Grotesk local para titulares, con temas claro y oscuro.
- Demos funcionales: guardar una colección, confirmar una acción, añadir una tarjeta y
  previsualizar un nombre de proyecto con validación nativa.
- Entradas, secuencias y respuesta a la presión usando Web Animations API en un hook local.
  Los efectos se pueden repetir; el cambio de preferencia cancela los que siguen activos.
- Selector de movimiento de sistema, reducido o desactivado. El sistema reducido se respeta
  siempre. El HTML prerenderizado permanece visible sin JavaScript.
- Menú móvil con Radix, foco atrapado, Escape, restauración de foco y navegación a secciones.
  Los portales heredan el tema del piloto.
- La portada corporativa anterior permanece en `/plantillas/corporativa`; las demás rutas
  mantienen sus contenidos. Título, foco e historial se verificaron al cambiar entre demos.
- `VITE_DOCS_URL` permite configurar los enlaces de documentación; el valor local es
  `http://localhost:3000/docs`.

**Validación:** build del playground con 13 páginas prerenderizadas; typecheck de playground
y e2e; lint sin errores, con los 25 avisos previos del repositorio; 251 pruebas e2e de axe y
teclado superadas en Chromium. Las pruebas nuevas cubren movimiento, temas, menú, formularios,
hidratación y contenido sin JavaScript. Se comprobó que la página cabe a 320, 390, 768, 1024 y
1440 px. Estas comprobaciones no equivalen todavía a la validación entre tres motores,
la revisión con lector de pantalla ni las mediciones de rendimiento del plan completo.

Capturas de revisión: [escritorio claro](docs/previews/ui-motion/desktop-light.png),
[escritorio oscuro](docs/previews/ui-motion/desktop-dark.png),
[móvil claro](docs/previews/ui-motion/mobile-light.png) y
[móvil oscuro](docs/previews/ui-motion/mobile-dark.png).
Son capturas de revisión, no las referencias automatizadas de la suite visual.

**Fase 1 — Fundamentos editoriales completados (2026-10-12).**

- `@betterlibs/tokens/editorial.css` aplica la paleta marfil/carbón/lima, Space Grotesk,
  radios contenidos y superficies planas a `[data-preset="editorial"]`. Puede usarse en
  `<html>` o en un contenedor; la apariencia predeterminada del catálogo se conserva.
- `editorial` es un objeto exportado para `createTheme({ preset: editorial, brand, selector })`.
  `ThemePreset` permite definir fundamentos propios. El import explícito permite eliminar
  del bundle los presets que no se usan. `Theme.palette` resuelve sus referencias semánticas.
- Cada tema generado declara su propia paleta para que el contraste validado corresponda
  a los colores pintados, incluso al convivir con otros estilos.
- Roles tipográficos de portada, sección y entradilla; Inter para lectura y Space Grotesk
  para titulares, cargadas localmente por las aplicaciones. Los tokens no descargan fuentes.
- `motionRoles` define feedback, disclosure, reveal y navigation, con duración, salida,
  distancia y curva. `motionStagger` limita las secuencias a 240 ms de espera; `motionSprings`
  ofrece parámetros físicos snappy y gentle. Se publican en TS y JSON; los roles y stagger
  también tienen variables CSS. Son fundamentos, no un motor de animación.
- El hook local del piloto consume estos roles y lee los overrides CSS al reproducir efectos.
  Su paleta, familias y radios pasan a depender del preset compartido.
- El generador valida 56 pares por estilo entre claro y oscuro, 112 en total. Incluye el
  estado active del botón y bordes/foco sobre superficies. La aprobación usa el ratio sin
  redondear, aunque el informe lo muestre con dos decimales.
- Corregida la prioridad del modo claro explícito bajo un sistema oscuro y la aplicación
  automática del preset en `<html>`. La base deja el esquema nativo de color al tema.
- Storybook incorpora **Estilo → Editorial**, compatible con sus controles de tema y marca,
  y ejemplos de ambos modos, contenido largo, formulario e informe de contraste.
- Documentados instalación, personalización, roles, fuentes, superficies y movimiento reducido.
  Los portales de los ejemplos de documentación también reciben el preset.
- Corregidos mínimos de columnas y ajuste de textos del piloto al ampliar la tipografía;
  se conserva la navegación y el formulario a 390 y 1280 px con texto al 200 %.

**Validación:** build completo de paquetes, Storybook, documentación y 13 páginas prerenderizadas;
comprobación de tipos; 115 pruebas unitarias; lint sin errores con los 25 avisos previos;
estructura publicable de los paquetes validada con publint; 277 pruebas e2e de axe y teclado
superadas en Chromium. Los controles prioritarios se revisan también con el preset editorial,
incluido el diálogo abierto y su formulario.

**Tamaño (size-limit, minificado/Brotli):** tokens CSS comunes 4,31 kB (límite 5 kB),
preset CSS 2,40 kB (nuevo límite 3 kB), `createTheme` 4,89 kB (límite existente 5,5 kB),
`createTheme + editorial` 5,54 kB (nuevo límite 6 kB). Los presupuestos existentes de la UI
siguen pasando: Button 1,79 kB, formulario 4,47 kB y CSS de componentes 16,33 kB.

[Comparación de fundamentos en claro y oscuro](docs/previews/ui-motion/foundations-light-dark.png).
Es una captura de revisión, no una referencia automatizada de regresión visual.

**Fase 2 — Arquitectura opcional y coste completados (2026-10-12).**

- Nuevo `@betterlibs/motion`, con Motion 14.1 como peer explícito. Todas las fronteras cliente
  mantienen `use client` en el paquete compilado; la UI estática no importa el motor.
- `MotionProvider` y `useMotionPreferences`: sistema, reducido y desactivado, intensidad sutil
  o estándar. El sistema reducido prevalece siempre y un proveedor hijo no anula restricciones.
- `Reveal` mantiene el HTML visible, observa el viewport, permite repetir con `once={false}`
  o `replayKey` y ofrece wrappers semánticos con ref. `Stagger` no añade DOM y limita la espera
  a 240 ms. `Presence` conserva la salida visual con contenido inmediatamente inerte y oculto
  al árbol accesible; restaura el foco indicado y admite reapertura durante la salida.
- `useMotionAnimation` comparte tokens CSS, repetición y cancelación con el piloto. Los efectos
  pendientes de carga también se cancelan; al terminar se restauran los estilos inline.
- Se evaluó `m` + `LazyMotion`. Las primeras primitivas usan `motion/mini`, cargado bajo demanda:
  WAAPI basta para opacity/transform; el fallo del motor o falta de APIs deja el contenido estático.
- Portada Vite migrada a los exports públicos, cuatro stories y guía con demo interactiva Next.
  La comprobación en navegador de Next verifica interacción, cierre y foco sin errores; se comprobó
  también que bloquear la descarga del motor conserva contenido y permite cerrar el panel.
- No se añade CSS propio, adaptación de router, layout/drag ni animación de cifras a esta entrega.

**Coste:** fixtures Vite/Rolldown minificados, Brotli por chunk, excluyendo React/ReactDOM e
incluyendo Motion: UI estática 1,83 kB iniciales; Reveal/Presence 2,78 kB iniciales + 4,43 kB
diferidos (7,22 kB total); exploración layout/drag 35,54 kB. Esta última supera el objetivo
30 kB y no se aprueba para la API. Su medición vive en la configuración exploratoria separada;
los límites de la API básica no se elevan. Con size-limit, el paquete básico mide 6,67 kB,
el fixture básico 6,72 kB y el motor aislado 2,86 kB; los métodos tienen distinta partición y
optimización. Button sigue en 1,79 kB y el formulario en 4,47 kB.

Registro reproducible de chunks: [bundle-cost.json](docs/previews/ui-motion/bundle-cost.json).
`pnpm --filter @betterlibs/motion measure` lo regenera; `pnpm size` verifica los presupuestos;
`pnpm exec size-limit --config .size-limit.motion-experiments.json` mide la exploración avanzada.
Los fixtures JS no importan fuentes ni CSS; sus costes siguen en las comprobaciones separadas
existentes. [Demo de documentación](docs/previews/ui-motion/motion-demo.png), captura de revisión.

**Validación:** build de los cuatro paquetes, playground, Storybook y documentación; tipos;
124 pruebas unitarias; publint estricto de los cuatro paquetes; presupuestos publicados cumplidos.
Las pruebas de navegador cubren SSR sin JavaScript, cancelación, movimiento reducido en vivo,
repetición, salida inerte, foco, reapertura y fallback sin WAAPI. La suite completa de axe y teclado pasa 288 pruebas en Chromium. Lint conserva los 25 avisos anteriores sin errores.

**Fase 3 — UI prioritaria completada (2026-10-13).**

- Button incorpora contorno editorial, presión breve con el rol feedback y desplazamiento del
  icono final solo con puntero fino. Carga y deshabilitado conservan bloqueo, ancho y foco.
- Card outline/elevated usa superficie plana y borde; las tarjetas enlazadas responden al foco
  y al puntero sin desplazar su contenido. Las variantes decorativas siguen siendo explícitas.
- Input mantiene su marco geométrico y los estados nativos. Field presenta error/éxito después
  del control; cambiar el mensaje durante la edición conserva nodo, valor, foco y descripción.
- Tabs refuerza la selección con peso, subrayado o superficie de acento. Se reutiliza el indicador
  CSS existente, con tokens compartidos, RTL y ajuste a etiquetas dinámicas. Los paneles inactivos
  quedan ocultos incluso con forceMount; no se añade una adaptación con springs o motor.
- Accordion usa filas editoriales, un chevron sencillo y altura natural de Radix. El panel sale
  inerte y oculto al árbol accesible desde el cierre; conserva altura cero al cancelar la salida.
  Se cubren reapertura, contenido variable y modos controlado, único y múltiple.
- Dialog entra con 8 px de desplazamiento en 220 ms. El contenido se desmonta al cerrar para
  restaurar el foco inmediatamente; solo el fondo conserva una salida de 180 ms, sin interceptar
  clics. Las salidas coordinadas de contenido siguen reservadas a adaptaciones opcionales.
- Header usa marca tipográfica y refuerzo del borde al desplazarse. El menú táctil conserva
  foco, Escape y navegación; la cabecera oculta se muestra al recibir foco.
- SectionHeader usa los roles heading/hero/lead sin cambiar los tamaños explícitos. Antetítulos,
  títulos y acciones largos se ajustan al ancho disponible, también con texto al 200 %.
- Los tokens CSS ofrecen data-motion="system", "reduced" y "off". Las restricciones de un
  ancestro prevalecen y los cambios cancelan las animaciones CSS activas. El sistema reducido
  también cancela animaciones y transiciones. MotionProvider sigue sin DOM: al combinar ambos
  sistemas se configura la misma selección en proveedor y atributo, incluidos los portales.
- Cuatro stories de UI prioritaria, selector global de movimiento sin remontaje y ejemplos
  editoriales en las ocho páginas de documentación. Changeset de tokens y React preparado.
- El selector del piloto usa el acento compartido para que su fondo y texto seleccionado
  mantengan el contraste en oscuro al adoptar los nuevos estados de Tabs.

**Validación:** build de los cuatro paquetes, playground (13 páginas prerenderizadas),
Storybook y documentación; tipos; 127 pruebas unitarias y publint estricto superados. Se revisaron
seis capturas en claro/oscuro, con escritorio y móvil, sin errores de JavaScript. La corrida completa
de axe y teclado supera 306 pruebas en Chromium, incluidas 10 nuevas de estados editoriales:
carga, validación, diálogos, pestañas, salida inerte, cancelación, RTL, teclado/tacto y texto al 200 %.
Lint no tiene errores y presenta 27 avisos de estilos. La validación se realiza en Windows con
Node 24; no se reejecutó Docker en esta sesión.

**Tamaño (size-limit, minificado/Brotli):** Button 1,79 kB (límite 2,5 kB), formulario 4,47 kB
(6 kB), CSS de componentes 17,03 kB (19 kB), tokens CSS 4,51 kB (5 kB) y preset 2,40 kB (3 kB).
El paquete básico de movimiento sigue en 6,67 kB (8 kB); todos los presupuestos publicados pasan.

Capturas de revisión: [estados claros](docs/previews/ui-motion/phase3-estados-light.png),
[estados oscuros](docs/previews/ui-motion/phase3-estados-dark.png),
[contenido claro](docs/previews/ui-motion/phase3-contenido-light.png),
[contenido oscuro](docs/previews/ui-motion/phase3-contenido-dark.png),
[cabecera móvil clara](docs/previews/ui-motion/phase3-cabecera-light.png) y
[cabecera móvil oscura](docs/previews/ui-motion/phase3-cabecera-dark.png).
No son referencias automatizadas de regresión visual. Se regeneran tras construir Storybook con
`pnpm --filter @betterlibs/e2e exec node scripts/capture-editorial.mjs`.

**Fase 4 — Movimiento y primera página completados (2026-10-13).**

- AnimatedNumber completa las cinco primitivas públicas. El servidor muestra el final y los
  lectores de pantalla reciben una única copia accesible; los fotogramas visuales están ocultos
  al árbol accesible. No añade regiones live ni actualizaciones de estado React por frame.
- Formato Intl y locale explícito (es-ES por defecto), inicio opcional al entrar en vista,
  duración con el token navigation y repetición con replayKey. Los cambios rápidos parten de
  la cifra visible. Salir de vista, cambiar preferencias o desmontar cancela el frame pendiente;
  la preferencia restringida y la falta de RAF presentan el final. Las cifras no cargan el motor.
- Hero incorpora variant="editorial", con retícula 7/5 y escala fluida. CTA incorpora
  panelTone="inverse", con fondo y texto inversos del tema. Las variantes anteriores conservan
  sus contratos; la nueva variante editorial de Hero utiliza la escala del preset en lugar de size.
- BentoFeatures y BentoFeature son composiciones estáticas públicas: retícula 7/5 y 5/7 desde
  768 px, una columna en móvil, contenido/media/acciones configurables y wrappers opcionales.
  Los títulos internos se configuran explícitamente al cambiar la jerarquía de la sección.
- FeatureShowcase usa Tabs para selección automática o manual, controlada o interna y estados
  deshabilitados. La vista accesible cambia inmediatamente; no retiene salidas. Los borradores
  que deban persistir se guardan en el padre. Los bloques no importan @betterlibs/motion.
- La portada del playground consume los cuatro bloques públicos y añade una demostración
  explícita de cifras, sin inventar métricas. Mantiene guardar una colección, botones, tarjetas,
  formulario, preferencias, menú móvil y navegación a la plantilla corporativa con foco e historial.
- Cuatro stories nuevas comparan composiciones y cifras normales/reducidas/desactivadas.
  El selector global de Storybook configura tanto CSS como MotionProvider sin remontar por
  cambios de movimiento. Guías de composiciones, AnimatedNumber y primera página editorial
  disponibles con ejemplos interactivos Next y referencia de los nuevos props.
- Changeset de React y motion preparado. Las capturas de la landing cubren escritorio/móvil
  en claro/oscuro; el CTA y el hero tienen capturas de detalle. Se corrigió el color explícito
  de una etiqueta decorativa del bento al trasladarla a su nueva superficie.

**Validación:** build de los cuatro paquetes, playground (13 páginas prerenderizadas), Storybook
y documentación; tipos; 137 pruebas unitarias; publint estricto de los cuatro paquetes; límites
de tamaño publicados cumplidos. La suite completa supera 319 pruebas de axe y teclado en Chromium.
Los nuevos casos cubren SSR sin JavaScript, formato, cambios rápidos, cancelación en vivo,
preferencia del sistema, foco, selección y texto al 200 %. La prueba reproducible de Next verifica
interacción, cierre, foco, ausencia de errores de hidratación, SSR y fallback sin WAAPI:
`apps/e2e/scripts/verify-phase4-docs.mjs` (build Next arrancado en 3001 o BETTERLIBS_DOCS_TEST_URL).
Lint no tiene errores y conserva 27 avisos; entorno Windows/Node 24, sin reejecutar Docker.

**Coste:** con size-limit, AnimatedNumber aislado mide 1,53 kB (nuevo límite 2 kB) y las cinco
primitivas con el motor peer 7,38 kB (nuevo fixture con límite 8 kB). El fixture básico existente
mantiene 6,72 kB y su límite de 8 kB. Button sigue en 1,79 kB, formulario en 4,47 kB y CSS de
componentes en 17,34 kB (límite 19 kB). No se elevan los presupuestos existentes.

Con Vite/Rolldown y Brotli por chunk, excluyendo React/ReactDOM e incluyendo el peer Motion:
cifras aisladas 1,56 kB iniciales sin chunks diferidos; cinco primitivas 3,46 kB iniciales +
4,43 kB diferidos (7,89 kB total). UI estática 1,84 kB; Reveal/Presence 2,78 + 4,43 kB.
La exploración avanzada sigue en 35,54 kB y no se incorpora a la API. Los métodos difieren en
partición y optimización. Los fixtures JS no importan CSS ni fuentes: sus costes se mantienen
en las comprobaciones separadas existentes. El registro actualizado es
[bundle-cost.json](docs/previews/ui-motion/bundle-cost.json).

Capturas de revisión: [escritorio claro](docs/previews/ui-motion/phase4-desktop-light.png),
[escritorio oscuro](docs/previews/ui-motion/phase4-desktop-dark.png),
[móvil claro](docs/previews/ui-motion/phase4-mobile-light.png) y
[móvil oscuro](docs/previews/ui-motion/phase4-mobile-dark.png).
Se regeneran con `pnpm --filter @betterlibs/e2e exec node scripts/capture-phase4.mjs` después
de construir el playground. No sustituyen las referencias automatizadas Linux ni la revisión
manual con lectores de pantalla.

**Fase 5 — Interacciones y catálogo completados (2026-10-13).**

- Formularios editoriales: Select y Textarea comparten el marco de Field/Input; Checkbox y
  Radio conservan controles nativos y muestran sus marcas sin dibujo prolongado. Switch usa
  feedback breve y un thumb distinguible de su pista también en oscuro. FileInput elimina
  ampliación/brillos al arrastrar y ajusta nombres largos; quitar un archivo restaura el foco.
- Menús, Popover y Tooltip adoptan superficies opacas, bordes y entradas disclosure. Se
  mantienen acciones, radio/checkbox, submenús, elementos deshabilitados, flechas y Escape.
  El contenido cerrado se desmonta inmediatamente; forceMount permanece visualmente oculto.
- Drawer adopta superficie plana y una entrada de 8 px desde el lado elegido en editorial.
  Conserva scroll bloqueado, foco atrapado, contenido desplazable, pie y overlays anidados.
  Al cerrar se desmonta el contenido y vuelve el foco; solo el fondo mantiene su salida breve.
- Toast usa un borde de estado e icono sin brillo. La salida queda inerte, aria-hidden y sin
  interceptar puntero. Se mantienen F8, acciones, pausa y descarte táctil. Corregida la carrera
  en el store: un temporizador anterior no elimina una actualización con el mismo id ni
  acorta la salida de su reemplazo.
- Alert, Badge, Tag, Avatar, IconTile, Pagination, SocialLinks y AnnouncementBar adoptan
  superficies planas. Skeleton editorial y los puntos de Badge son estáticos. El resto de
  componentes de tipografía, layout y medios mantiene contratos basados en tokens; los
  bloques restantes y navegación de páginas corresponden a la fase 6.
- Carousel respeta restricciones data-motion de cualquier ancestro además del sistema,
  cancela scroll suave, detiene autoplay y conserva navegación directa. Suspende autoplay
  fuera de vista y ajusta sus controles al ampliar el texto. La UI no importa el motor.
- Nueva capacidad opcional acotada a posiciones: useLayoutTransition(ref, transitionKey,
  { spring }) anima hijos directos data-bl-layout con claves estables, sin wrappers, escala de
  tamaños, arrastre ni salidas retenidas. El orden DOM cambia inmediatamente y los borradores
  permanecen en los mismos nodos. Los cambios rápidos parten de la posición visual actual.
- useSpringTabsIndicator adapta el indicador existente de TabsList, sin importar la UI ni
  sustituir Radix. Solo la posición usa spring; selección, paneles, tamaño y foco cambian
  inmediatamente. Se verifican modo manual, vertical, RTL, resize y cancelación en vivo.
- Ambos hooks descargan mini y el generador de spring únicamente al animar un cambio real.
  SSR y primer montaje no cargan la capacidad. Restricciones, desmontaje, carga fallida y
  ausencia de WAAPI restauran el estado final. Los presets físicos vienen de tokens; no se
  incorpora domMax/drag ni se eleva el presupuesto de movimiento básico.
- Cinco stories de catálogo, ocho capturas claro/oscuro y demos compartidas con Next. Guía
  de interacciones y ejemplos editoriales en 19 páginas del catálogo; API, wrappers, propiedad
  de transform y límites documentados. Changeset de React y motion preparado.

**Validación:** build de los cuatro paquetes, playground (13 páginas prerenderizadas), Storybook
y documentación; tipos; 145 pruebas unitarias (98 React, 22 motion, 25 tokens); publint estricto
de los cuatro paquetes; presupuestos publicados cumplidos. La regresión completa pasa
345 pruebas de axe y teclado en Chromium, incluidos 16 nuevos casos de formulario, menús,
cuatro lados de Drawer, overlays anidados, Toast/F8, tacto, RTL, cancelación y fallback.
Se revisan estados de error/éxito, borradores, contraste y texto al 200 %. La verificación de
Next comprueba formularios, foco, Tabs, posiciones, SSR y fallback sin WAAPI, sin errores de
hidratación: `apps/e2e/scripts/verify-phase5-docs.mjs` (build Next en 3001 o
BETTERLIBS_DOCS_TEST_URL). Lint sin errores, con 30 avisos de estilos. Entorno Windows/Node 24;
Docker, Firefox/WebKit y lectores de pantalla no se reejecutaron en esta entrega.

**Coste:** size-limit mide posiciones con su motor en 5,72 kB (nuevo límite 10 kB) y Tabs con
spring, UI y Radix en 13,51 kB (nuevo límite 30 kB). Button sigue en 1,79 kB, formulario básico
en 4,47 kB, CSS de componentes en 17,81 kB (límite 19 kB) y tokens CSS en 4,51 kB (5 kB).
Movimiento básico y cinco primitivas mantienen 6,67 kB y 7,38 kB, ambos bajo sus límites de 8 kB.

Con Vite/Rolldown y Brotli por chunk, excluyendo React/ReactDOM e incluyendo el motor peer:
posiciones 1,48 kB iniciales + 4,74 kB diferidos = 6,23 kB; Tabs con spring, UI y Radix
9,22 + 4,74 = 13,96 kB. Ambos comparten la capacidad diferida en una aplicación. Los fixtures
estático, básico, cifras y cinco primitivas conservan sus costes anteriores. La exploración
completa domMax/layout/drag sigue en 35,54 kB y no se aprueba para la API; se reduce el alcance
a continuidad de posiciones antes de incorporar capacidades avanzadas. CSS y fuentes siguen
midiéndose por separado. Registro: [bundle-cost.json](docs/previews/ui-motion/bundle-cost.json).

Capturas de revisión: [formulario claro](docs/previews/ui-motion/phase5-formularios-light.png),
[formulario oscuro](docs/previews/ui-motion/phase5-formularios-dark.png),
[Drawer móvil claro](docs/previews/ui-motion/phase5-menus-y-overlays-light.png),
[Drawer móvil oscuro](docs/previews/ui-motion/phase5-menus-y-overlays-dark.png),
[posiciones claras](docs/previews/ui-motion/phase5-posiciones-light.png),
[posiciones oscuras](docs/previews/ui-motion/phase5-posiciones-dark.png),
[contenido móvil claro](docs/previews/ui-motion/phase5-contenido-light.png) y
[contenido móvil oscuro](docs/previews/ui-motion/phase5-contenido-dark.png).
Se regeneran con `pnpm --filter @betterlibs/e2e exec node scripts/capture-phase5.mjs` después
de construir Storybook. No son referencias automatizadas Linux.

**Fase 6 — Secciones y navegación completada (2026-10-13).**

- Tres plantillas completas y prerenderizadas: producto (`/plantillas/producto`), portfolio de
  estudio (`/plantillas/estudio`) y artículo (`/plantillas/articulo`). Comparten Header, Footer,
  temas, preferencias y portales. Se puede llegar desde la portada de Betterlibs.
- Producto incluye tablero con tareas reales en estado local, planes mensual/anual con importe,
  periodo y nota coherentes, testimonio, FAQ y formulario validado. El formulario de demostración
  prepara una solicitud; no envía ni almacena datos. Estudio incluye dos casos desarrollados,
  proceso, equipo y contacto de ejemplo. Artículo incluye autor, fecha, índice y lectura larga.
- Tres ilustraciones SVG locales, con dimensiones y alternativas, sin peticiones a servicios de
  imágenes. El contenido ficticio y los contactos de ejemplo se identifican antes de publicar.
- Bloques restantes adaptados al preset: Pricing, Testimonials, FAQ, LogoCloud, Timeline,
  TeamGrid, Stats, Blog/PostCard, CaseStudyCard, ContactSection, Newsletter y CookieConsent.
  Superficies planas, bordes, foco y contenido largo; las tarjetas editoriales no se elevan al
  pasar el puntero. El FAQ dividido también conserva la prop background.
- TextReveal compone Reveal/Stagger con líneas explícitas que pueden envolver texto en móvil.
  SSR conserva el contenido visible y una única copia accesible; no divide enlaces ni mide
  saltos automáticos. Admite ref, repetición y preferencias compartidas.
- ScrollProgress es un progress nativo, con documento o referencia de artículo como objetivo.
  Sigue directamente el scroll también en reducido/off, sin motor ni regiones live. Actualiza
  el nodo sin renders React por frame y limpia listeners, ResizeObserver y frames pendientes.
- El adaptador History del playground incluye búsquedas y fragmentos en su snapshot; mantiene
  posiciones por entrada y orienta el foco al destino o al h1. Enlaces externos, target,
  descargas y clics modificados conservan su comportamiento. Los hashes mal formados no rompen
  la navegación. View Transition ofrece un fundido progresivo con tokens; sin soporte o con
  restricciones se navega directamente. Las preferencias y cambios sucesivos cancelan el efecto.
- Receta real de Next App Router, en dos rutas `/ejemplos/navegacion`: entrada tras confirmar el
  pathname, metadata en servidor y foco con preventScroll. Link conserva historial, anclas y
  restauración; no se remonta el árbol ni se administra el router desde la librería.
- Corregido un fallo de Form: retirar el resumen al perder foco durante una pulsación movía el
  botón antes de completarse el clic. Se valida al enviar en ese caso; la salida con teclado
  conserva revalidación inmediata. La prueba de navegador reproduce el envío tras corregir errores.
- Cuatro stories de secciones, demos compartidas, guías de lectura y navegación, catálogo de
  plantillas actualizado y changesets de React/motion. La comprobación de overrides del piloto
  espera la capacidad diferida, evitando asumir que una animación ya existe al terminar el clic.

**Validación:** build completo de siete tareas, 16 páginas prerenderizadas, tipos, 149 pruebas
unitarias y publint estricto de los cuatro paquetes. Lint sin errores, con los 30 avisos previos.
La regresión completa pasa 370 pruebas de axe y teclado en Chromium. Los once recorridos nuevos
cubren SSR sin JavaScript, texto al 200 %, precios, formulario, anclas, historial, foco, preferencias,
menú táctil, descargas, target, clic modificado y fallback. Las tres páginas caben a 320, 390,
768, 1024 y 1440 px; se revisaron capturas en claro/oscuro con escritorio y móvil.

La prueba de Next comprueba lectura, SSR, hidratación, anclas, foco, scroll al volver, movimiento
reducido y fallback sin WAAPI, sin errores: `apps/e2e/scripts/verify-phase6-docs.mjs` (build en 3001,
o BETTERLIBS_DOCS_TEST_URL). Esta entrega se valida en Linux/Node 24. Docker está configurado,
pero no se arrancaron sus servicios en esta sesión: el socket requiere sudo interactivo.
Firefox/WebKit, lectores de pantalla y referencias de regresión siguen pendientes de fase 8.

**Coste:** size-limit mide lectura y texto, incluyendo motor, en 6,96 kB (límite 8 kB),
y ScrollProgress en 476 B (2 kB), sin motor. Con Vite/Rolldown y Brotli por chunk, lectura tiene
3,02 kB iniciales + 4,43 kB diferidos = 7,46 kB; progreso, 502 B iniciales y ninguno diferido.
Button conserva 1,79 kB; formulario 4,51 kB (6 kB), CSS de UI 18,17 kB (19 kB), tokens 4,51 kB
(5 kB) y preset 2,40 kB (3 kB). Los presupuestos publicados siguen pasando sin elevar los anteriores.
Registro: [bundle-cost.json](docs/previews/ui-motion/bundle-cost.json).

Capturas de revisión: [producto claro](docs/previews/ui-motion/phase6-producto-light-desktop.png),
[estudio claro](docs/previews/ui-motion/phase6-estudio-light-desktop.png),
[artículo claro](docs/previews/ui-motion/phase6-articulo-light-desktop.png) y
[artículo móvil oscuro](docs/previews/ui-motion/phase6-articulo-dark-mobile.png).
Hay doce capturas en total. Se regeneran con `pnpm --filter @betterlibs/e2e exec node
scripts/capture-phase6.mjs`, con el playground construido y servido en 4173. Son material de
revisión, no referencias automatizadas de regresión visual.

**Continuidad al cerrar la fase 6:** fase 7, completada a continuación.
Siguen pendientes las comprobaciones entre motores, lectores de pantalla, referencias Linux
verificadas y mediciones de rendimiento del plan completo.

**Fase 7 — Documentación completa (2026-10-13).**

- Portada editorial con composición real manipulable, rutas por uso y acceso a primera página.
  Galería `/docs/galeria` con seis ejemplos compilados y tres plantillas, filtros, búsqueda que
  tolera acentos, estado vacío, código desplegable y copia con alternativa ante fallo de permisos.
- Preview añade tema, preset, movimiento y repetición optativos. Los cambios conservan nodos,
  borradores y foco; repetición participa mediante replayKey. El lienzo y su contenedor de portales
  comparten atributos. El sistema reducido prevalece y cancelar no oculta contenido funcional.
- El generador lee los exports públicos de React y movimiento: 105 tipos propios, 11 firmas de
  funciones/hooks y 72 módulos CSS. El código copiable procede de los seis archivos que Next
  compila para las demos. Build y typecheck validan enlaces internos y referencias de 116 MDX.
- Nueva referencia de movimiento y guías de SSR/preferencias, composición Radix, rendimiento,
  migración y resolución de problemas. Instalación diferenciada para UI y movimiento mediante
  checkout/tarballs; fuentes, CSS global, portales, wrappers y costes se explican explícitamente.
- Corregidos contraste de navegación, jerarquía de títulos, main anidado y nombre del icono
  de GitHub. La interfaz de Fumadocs usa las claves contextualizadas de traducción al español.
  README, calidad, novedades y roadmap reflejan el nuevo plan sin trasladar resultados históricos.
- Docker calcula los enlaces de docs al playground y Storybook con los puertos configurados.
  El watcher regenera referencias React/motion y código de ejemplos; cierra todos sus observadores.
  La actualización de launcher/Compose requiere reconstruir con `./docker.sh`.

**Validación:** build y tipos de documentación, 116 páginas con enlaces/referencias válidos y lint
sin errores (30 avisos existentes). La prueba `apps/e2e/scripts/verify-phase7-docs.mjs` pasa en
Chromium: filtros, búsqueda general y navegación al resultado, copia y permiso denegado,
formularios, borradores, portal oscuro/off, Escape y foco, repetición/cancelación, preferencia
cambiada en vivo, 19 rutas, seis auditorías axe en claro/oscuro, API móvil, texto al 200 %, HTML
sin JavaScript y ausencia de errores de hidratación. Los scripts Next de fases 4, 5 y 6 se vuelven
a ejecutar y pasan. No se reejecutó la suite completa de UI de 370 casos: no cambia su código.

Se empaquetaron cuatro tarballs, verificando exports y conversión de dependencias workspace.
Un consumidor fuera del monorepo renderiza UI y movimiento en SSR desde ellos; reutiliza peers
instalados del checkout, por lo que no equivale a una instalación desde cero con descarga online.
El registro público respondió E404 para React/motion; publicación y despliegue siguen pendientes.
Compose valida puertos alternativos y las tres pruebas de ciclo de vida del lanzador pasan.
No se reconstruyeron contenedores: el socket requiere sudo interactivo. Entorno Linux/Node 24.

Ocho capturas de revisión, en claro/oscuro y escritorio/móvil, generadas con
`pnpm --filter @betterlibs/e2e exec node scripts/capture-phase7.mjs` (docs en 3001 o
BETTERLIBS_DOCS_TEST_URL): [portada clara](docs/previews/ui-motion/phase7-portada-light-desktop.png),
[portada móvil oscura](docs/previews/ui-motion/phase7-portada-dark-mobile.png),
[galería clara](docs/previews/ui-motion/phase7-galeria-light-desktop.png) y
[galería móvil oscura](docs/previews/ui-motion/phase7-galeria-dark-mobile.png).
No son referencias automatizadas de regresión visual.

**Siguiente fase:** fase 8, calidad y distribución: Firefox/WebKit, lectores de pantalla,
referencias visuales Linux verificadas, rendimiento del rediseño y preparación de lanzamiento.

**Entorno de desarrollo Docker completado (2026-10-12).**

- Una imagen de desarrollo y tres contenedores independientes: web en http://localhost:8080,
  documentación en http://localhost:3000/docs y Storybook en http://localhost:6006.
- `./docker.sh` construye, arranca en segundo plano y espera las respuestas HTTP. Los servicios
  se recuperan al arrancar Docker, salvo que se hayan detenido explícitamente.
- Fuentes montadas en solo lectura; dependencias y artefactos aislados por contenedor.
  Las aplicaciones recargan cambios y Turbo recompila la librería automáticamente.
- Healthchecks, rotación de logs y cierre de procesos hijos ante parada o fallo de una app.
  [Guía y controles](docker/README.md).

**Validación:** Compose y sintaxis correctos; tres pruebas de ciclo de vida del lanzador;
respuestas HTTP y navegadores comprobados en los tres servicios. Se verificaron interacción,
animación, preferencias, navegación, formulario, cierre y foco, sin errores de JavaScript.
Una fuente temporal, creada y modificada, se recompiló automáticamente en los tres contenedores;
la fuente de prueba se retiró. Este trabajo de infraestructura no cambia el estado de la fase 3.

## 1. Producto y público

**Betterlibs: componentes, secciones y patrones de movimiento para construir webs React con identidad.**

El público inicial son desarrolladores y equipos pequeños que construyen landings de producto, portfolios, webs de estudios y páginas de contenido. La propuesta combina un acabado visual reconocible, comportamiento accesible y animación que ya tiene resueltas sus variantes de móvil, teclado y movimiento reducido.

El criterio de selección del catálogo será: ¿permite construir una página mejor con menos trabajo? La cantidad de efectos disponibles no será el principal argumento del producto.

Tres niveles de uso:

1. **Componentes:** controles y contenido con estados completos y microinteracciones.
2. **Movimiento:** piezas pequeñas para apariciones, secuencias y cambios de contenido.
3. **Secciones y páginas:** composiciones que demuestren cómo combinar lo anterior.

La primera entrega se centra en webs y páginas de producto. Tablas de datos complejas, editores, calendarios y grandes paneles de administración quedan para una decisión posterior de producto.

## 2. Estado actual y decisiones de continuidad

La revisión del repositorio muestra una base aprovechable:

- React y TypeScript; paquetes de tokens, iconos y componentes.
- CSS Modules, variables CSS y capas de estilos; temas claro y oscuro y personalización de marca.
- Radix para comportamiento de componentes interactivos.
- Componentes de layout, tipografía, formularios, navegación y overlays, además de bloques de página.
- Storybook, documentación con Next/Fumadocs y un playground de una consultora, prerenderizado.
- Pruebas de comportamiento, accesibilidad automatizada y límites de tamaño.
- Duraciones y curvas de movimiento en los tokens, CSS para movimiento reducido y un hook de preferencia del usuario.

Las oportunidades concretas son:

- La identidad actual sigue vinculada a webs corporativas, con un catálogo amplio pero poca diferenciación visual.
- El movimiento está distribuido entre componentes; falta una gramática común de entrada, salida, continuidad y secuenciación.
- El playground muestra una empresa ficticia, pero enseña poco la propia librería y sus posibilidades.
- El build entrega un único `styles.css`: importar un componente no selecciona su CSS de forma independiente.
- Las pruebas visuales omiten casos sin referencias. Hay que crear las referencias para que la regresión visual sea una garantía real.
- La navegación del playground ya gestiona título, foco y desplazamiento: cualquier transición de página debe conservar esos comportamientos.

Se reutilizan los componentes y su comportamiento. Los cambios recientes de acabado sobrio son el punto de partida técnico; no condicionan la identidad nueva. El trabajo existente en el árbol local debe conservarse al iniciar la implementación.

## 3. Dirección visual propuesta: editorial en movimiento

La personalidad será gráfica, tipográfica y expresiva. Grandes títulos, una retícula visible en la composición, bloques de color y transiciones claras darán identidad a las páginas.

### Color

Paleta inicial para el piloto, pendiente de validar todos sus pares semánticos de contraste:

| Rol | Claro | Oscuro | Aplicación |
| --- | --- | --- | --- |
| Fondo principal | `#F5F3EE` | `#141414` | Lienzo cálido y legible |
| Superficie | `#FFFFFF` | `#222222` | Controles y paneles |
| Texto principal | `#171717` | `#F5F3EE` | Jerarquía y contenido |
| Acento | `#C7F45A` | `#C7F45A` | Acciones y detalles de identidad, con texto oscuro |
| Superficie invertida | `#171717` | `#F5F3EE` | Secciones de énfasis y CTA |

El acento lima se usa en superficies, indicadores y pequeños detalles. Los enlaces sobre fondo claro emplean un tono oscuro contrastado. Los colores de error, éxito y aviso mantienen roles propios. La marca debe poder cambiarse con el sistema de temas existente.

### Tipografía y escala

- Space Grotesk como candidata para titulares del escaparate; Inter para lectura y controles. La primera está publicada con licencia SIL OFL 1.1 en su [repositorio oficial](https://github.com/floriankarsten/space-grotesk).
- Fuentes locales WOFF2 en las demos, con fallback y carga controlada. El paquete de componentes no descarga fuentes ni obliga a usarlas.
- Titulares de portada entre aproximadamente 48 y 104 px mediante una escala fluida en `rem`; ajustar el extremo móvil según longitud, zoom e idioma.
- Texto de lectura de 16–18 px, ancho de 60–68 caracteres y jerarquía fuerte entre titular, entradilla y metadatos.
- Uso limitado de monoespaciada para índices, etiquetas y datos. Los textos de los controles conservan su legibilidad.

### Formas y composición

- Radios de 4–8 px en controles y 12–16 px en paneles. Cápsulas para chips y casos concretos.
- Bordes definidos, rellenos planos y sombras reservadas principalmente para capas flotantes.
- Retícula de 12 columnas en escritorio y una columna principal en móvil, con bloques de anchuras distintas.
- Secciones con aire, imágenes grandes, numeración editorial y alternancia de superficies claras e invertidas.
- Componentes geométricos, ilustraciones SVG y capturas de producto coherentes. Revisar y sustituir imágenes del playground que no correspondan al contenido.
- La composición responde al contenido: títulos largos, tarjetas con diferente longitud, etiquetas traducidas e imágenes ausentes son estados de diseño.

### Cómo cambia cada elemento

| Elemento | Diseño y comportamiento propuestos |
| --- | --- |
| Button | Contorno definido, variantes filled/outline/ghost compatibles con la API existente; presión breve y flecha que acompaña la acción |
| Card | Superficie editorial, título con jerarquía e imagen protagonista; cambios de borde y contenido para tarjetas enlazadas |
| Input | Etiqueta clara, control geométrico y estados de validación; el error aparece junto al campo y no desplaza el foco |
| Tabs | Selección inequívoca y transición breve del contenido; indicador continuo cuando exista adaptación animada |
| Accordion | Jerarquía de filas, icono de estado y apertura suave que tolera contenido de altura variable |
| Dialog/Drawer | Capa bien separada, entrada direccional corta y cierre interrumpible |
| Header | Marca tipográfica y enlaces claros; cambio de estado al desplazarse y panel móvil legible |
| Hero | Titular grande, composición asimétrica y una demostración visual del producto |
| Sección de features | Composición bento con distintos tamaños y contenidos reales, que se convierte en lectura lineal en móvil |
| CTA | Gran bloque de contraste y una acción principal evidente |

La portada de referencia empezará con una propuesta visible —«Interfaces que se sienten vivas»— y una pequeña demo manipulable. Después: cuatro capacidades en bento, un ejemplo de interacción, una composición reutilizable y el CTA. Esta página será la referencia visual del sistema.

## 4. Sistema de movimiento

Cada animación responde a una de cuatro funciones: confirmar una acción, explicar un cambio de estado, mantener continuidad o guiar la lectura.

| Uso | Duración orientativa | Recorrido | Criterio |
| --- | --- | --- | --- |
| Hover, presión y foco | 100–160 ms | 0–2 px o escala 0,98 | Respuesta inmediata |
| Controles y paneles pequeños | 160–240 ms | 4–8 px | Estado claro, sin rebote prolongado |
| Entradas y salidas de overlays | 180–280 ms | 8–16 px | La salida suele ser más corta |
| Aparición de una sección | 280–420 ms | 8–20 px | Una vez, al entrar en vista |
| Secuencia de elementos | 40–60 ms entre elementos | El del preset | Retraso total acotado a unos 240 ms |
| Cambio de contenido/página | 180–300 ms | Desvanecimiento o continuidad | La navegación no espera a un espectáculo |

Son valores iniciales para ajustar en el piloto, no tiempos obligatorios para todos los elementos. Los springs se reservan para indicadores y gestos que necesitan continuidad; se configuran mediante presets con amortiguación controlada.

Reglas de implementación:

- Un elemento tiene un único responsable de animar cada propiedad. Evitar que CSS y Motion compitan por `transform`.
- Preferir `transform` y `opacity` en efectos decorativos. La animación de altura se limita a componentes donde informa del cambio, y se mide.
- Las acciones, el foco y los estados accesibles se actualizan cuando cambia el estado funcional; no esperan al final de una animación.
- Poder interrumpir, invertir y volver a activar una transición. Probar clics rápidos, desmontaje y cambio de preferencia durante la ejecución.
- El contenido está visible en el HTML del servidor. Las apariciones no dejan contenido esencial oculto si el JavaScript falla o tarda.
- Suspender animaciones decorativas continuas cuando no están visibles. El modo reducido elimina parallax, desplazamientos grandes y secuencias; el modo desactivado presenta el estado final inmediatamente.
- Toda interacción funciona con teclado y tacto. El hover enriquece una interacción que ya es comprensible.
- Los contadores animados exponen el valor final de forma accesible; los fotogramas intermedios no se anuncian como actualizaciones continuas.
- Texto animado: conservar una lectura semántica única; las capas visuales duplicadas se ocultan a tecnologías de asistencia.
- Marquees o reproducción automática, si se incorporan más adelante, requieren controles de pausa y una alternativa estática.

## 5. Arquitectura propuesta

### Paquetes y responsabilidades

| Área | Responsabilidad |
| --- | --- |
| `@betterlibs/tokens` | Colores, tipografía, espacio y tokens semánticos de movimiento |
| `@betterlibs/react` | Componentes y bloques actuales, CSS y comportamiento accesible |
| `@betterlibs/motion` — nuevo | Primitivas y adaptaciones animadas opcionales para React |
| `@betterlibs/icons` | Sistema de iconos actual |

Se mantiene CSS Modules y Radix. Las transiciones pequeñas viven en CSS dentro de los componentes. La coordinación, presencia, springs y continuidad de layout utilizan Motion for React en el paquete opcional.

Motion será una dependencia peer explícita del paquete de movimiento. Importar `@betterlibs/react` no importará ese paquete ni su motor. Los límites de cliente se concentran en las partes interactivas; los componentes estáticos siguen utilizables desde Server Components.

Para el paquete opcional se evaluará `m` con `LazyMotion`: la documentación permite cargar capacidades según las necesidades, con `domAnimation` para animación y presencia y `domMax` para layout y arrastre. El coste inicial y el de las capacidades diferidas se medirán por separado, contando también las dependencias peer. [Guía oficial de tamaño de Motion](https://motion.dev/docs/react-reduce-bundle-size).

El proveedor respetará la preferencia del sistema mediante `reducedMotion="user"`; los presets personalizados también deberán gestionar sus alternativas. Esa opción no elimina por sí sola toda animación, por lo que el modo desactivado necesitará comportamiento explícito. [Guía oficial de accesibilidad de Motion](https://motion.dev/docs/react-accessibility).

### Tokens y API

Añadir roles como `motion.feedback`, `motion.disclosure`, `motion.reveal` y `motion.navigation`, junto con distancias, stagger máximo y presets de spring. CSS y el paquete opcional consumirán una misma definición de tokens.

API propuesta, sujeta al piloto técnico:

```tsx
import { Card } from '@betterlibs/react'
import { MotionProvider, Reveal, Stagger } from '@betterlibs/motion'

<MotionProvider mode="system" intensity="subtle">
  <Stagger interval={48}>
    <Reveal preset="rise" once>
      <Card>Contenido de la primera tarjeta</Card>
    </Reveal>
    <Reveal preset="rise" once>
      <Card>Contenido de la segunda tarjeta</Card>
    </Reveal>
  </Stagger>
</MotionProvider>
```

Este ejemplo define intención; no corresponde a exports existentes. `mode` tendrá `system`, `reduced` y `off`. `intensity` ajusta la expresividad y nunca invalida la preferencia de movimiento reducido. Las primitivas deben tener valores seguros aunque no haya un proveedor explícito. `interval` se define en milisegundos y la secuencia limita el retraso acumulado.

Los wrappers deben documentar su DOM, conservar refs y semántica y no crear automáticamente contenedores inválidos en listas o tablas. La composición de gestos, `asChild` y elementos interactivos anidados debe resolverse en el piloto antes de fijar la API.

Las adaptaciones avanzadas de Tabs y Dialog viven en el paquete opcional. Se diseñan alrededor de los contratos de Radix —incluidos montaje, portales y cierre— para conservar foco, Escape y control de estado. Durante una salida, un panel cerrado deja de ser interactivo y de participar en el orden de foco. Los componentes básicos mantienen sus transiciones CSS sin necesitar el motor.

### CSS y distribución

- Conservar `@betterlibs/react/styles.css` como import sencillo.
- Prototipar exports de estilos por componente o familia para quien necesite reducir CSS. Decidir la granularidad tras medir el piloto.
- Mantener orden de capas, imports de tokens y estilos compartidos sin duplicación.
- Verificar consumo real en Vite y Next mediante una aplicación pequeña que importe únicamente Button y otra que añada Reveal.
- Publicar el tamaño de esos casos incluyendo CSS y capacidades cargadas después del primer render.

### Transiciones de páginas

El paquete no administra el router. Primero se demuestra la navegación en el playground y después se documenta una receta específica para Next App Router.

La View Transition API es candidata como mejora progresiva: permite transiciones entre estados y documentos, pero se deben comprobar la capacidad concreta y la integración antes de activarla. Sin soporte, la navegación sigue funcionando directamente. [Referencia de MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).

La primera versión cubre entrada de página y continuidad simple. Salidas coordinadas o elementos compartidos entre rutas se incorporan solo en adaptadores que permitan conservar correctamente ambas vistas. Se verifican enlaces externos, anclas, navegación atrás/adelante, restauración de scroll, título y foco. No se cambia el router de una aplicación solo para obtener una animación.

## 6. Catálogo y prioridades

### Primera versión utilizable — MVP

**Ocho componentes prioritarios:** Button, Card, Input, Tabs, Accordion, Dialog, Header y SectionHeader. Se apoyan en la tipografía y layout existentes, actualizados con los nuevos tokens. Los demás componentes siguen disponibles; su adaptación se completa en la siguiente fase.

**Cinco piezas de movimiento:**

- `MotionProvider`: configuración, carga de capacidades y preferencias.
- `Reveal`: entrada en vista, con repetición opcional y contenido seguro en SSR.
- `Stagger`: secuencia acotada de hijos participantes.
- `Presence`: entrada/salida de contenido condicional, con reglas de interacción y foco documentadas.
- `AnimatedNumber`: transición de cifras con valor final accesible y formato configurable.

**Cuatro composiciones:** Hero editorial, BentoFeatures, FeatureShowcase con selector de contenido y CTA de contraste. Se reutilizan o adaptan los bloques existentes cuando su contrato ya encaja.

**Una página completa:** landing de Betterlibs con ejemplos interactivos y versión móvil, clara, oscura y con movimiento reducido. La documentación mínima de estos elementos forma parte del MVP.

### Segunda entrega

- Adaptación visual del resto del catálogo actual, especialmente formularios, menús, Toast y Drawer.
- Tabs con indicador continuo y patrones de cambios de layout usando capacidades opcionales.
- ScrollProgress, TextReveal por líneas y una transición de página probada.
- Pricing con cambio mensual/anual, Testimonials y FAQ adaptados al nuevo lenguaje.
- Tres plantillas completas: landing de producto, portfolio de estudio y página editorial de artículo.

### Exploración posterior

- MagneticButton y SpotlightCard, limitados a puntero fino y activación explícita.
- Galerías reordenables, comparadores visuales y parallax moderado con fallback estático.
- Marquee controlable y escenas narrativas de scroll cuando exista un caso real de uso.

No son requisitos de la primera entrega el cursor personalizado, el scroll controlado por JavaScript, fondos WebGL ni una biblioteca adicional de timelines. Su incorporación necesita una ventaja demostrable en una página concreta y un presupuesto de carga propio.

## 7. Documentación y experiencia de uso

La documentación será parte del producto desde la primera fase de implementación:

- Portada que muestre una composición real y permita manipular una interacción.
- Catálogo por uso: componentes, movimiento, secciones y páginas.
- En cada ejemplo: vista previa, código mínimo, personalización y estados de teclado, móvil y movimiento reducido.
- Controles para repetir una animación, cambiar tema y comparar movimiento normal/reducido/desactivado.
- Guías «primera página», composición con Radix, SSR/RSC, preferencias, rendimiento y navegación.
- Instalación diferenciada para UI básica y para UI con movimiento; errores de configuración con mensajes claros.
- Contenido y textos configurables; ejemplos en español y una ruta preparada para documentación inglesa si el producto se abre a ese público.
- Storybook concentra todos los estados de cada componente; las páginas de docs concentran recetas y ejemplos de uso.
- APIs estables y pocas variantes con propósito, evitando añadir props de efecto a todos los componentes.

La modalidad inicial sigue siendo un paquete instalable. Las plantillas aportan código de composición editable; no se construirá un CLI propio hasta que la instalación manual muestre una necesidad concreta.

## 8. Fases, dependencias y entregables

Estimaciones orientativas en días de trabajo efectivo para una persona familiarizada con el proyecto. Se recalibran después del piloto; no representan fechas de entrega comprometidas.

| Fase | Trabajo | Entregable y criterio para avanzar | Estimación |
| --- | --- | --- | --- |
| 0. Piloto de dirección — completada | Pantalla de referencia con Header, Hero, Card, Button y una interacción, en escritorio y móvil | Comparación visual con la demo actual; identidad, lectura y movimiento evaluables en navegador | 1–2 días |
| 1. Fundamentos — completada | Paleta semántica, escala tipográfica, superficies, radios y gramática de movimiento | Temas claro/oscuro, contraste validado y ejemplos de tokens; contenido largo y zoom comprobados | 2–3 días |
| 2. Arquitectura y coste — completada | Paquete opcional, límites RSC, provider, piloto de distribución CSS y fixtures de consumo | UI básica sin Motion en su bundle; demo Vite y Next; coste inicial y diferido registrado | 2–4 días |
| 3. UI prioritaria — completada | Los ocho componentes del MVP y sus estados | Stories, documentación y comportamiento de teclado/tacto correctos; sin regresiones funcionales | 3–5 días |
| 4. Movimiento y primera página — completada | Cinco primitivas, cuatro composiciones y landing de Betterlibs | MVP utilizable con documentación; contenido visible en SSR, movimiento reducido y efectos interrumpibles | 3–5 días |
| 5. Interacciones y catálogo — completada | Adaptar los componentes restantes y añadir adaptaciones avanzadas con una API coherente | Formularios, menús, overlays y layout probados; capacidad avanzada cargada solo donde se utiliza | 3–5 días |
| 6. Secciones y navegación — completada | Tres plantillas, bloques restantes y recetas de navegación | Webs con contenido completo, imágenes coherentes y navegación con foco/historial/scroll correctos | 4–7 días |
| 7. Documentación completa — completada | Galería, controles de demos, guías, APIs y migración | Un desarrollador puede instalar, personalizar y montar una página siguiendo solo las docs | 3–5 días |
| 8. Calidad y distribución | Referencias visuales, pruebas entre motores, mediciones y empaquetado | Checks de cierre, registro de limitaciones, changelog y paquetes preparados para publicar | 2–4 días |

La cadena principal es 0 → 1 → 2 → 3 → 4. Las pruebas y la documentación acompañan a cada fase; las fases finales completan la cobertura del conjunto.

**MVP:** aproximadamente 11–19 días efectivos; reservar margen de ajuste, alrededor de 3–5 semanas a dedicación completa. **Plan completo:** 23–40 días efectivos, aproximadamente 5–8 semanas, con posibilidad de ampliación si los adaptadores de navegación o la adaptación del catálogo lo requieren.

Al terminar cada fase se registra lo construido, evidencia de aceptación y deuda pendiente. Los problemas del piloto se resuelven antes de propagar el lenguaje a todo el catálogo.

## 9. Validación y presupuestos

### Comportamiento y accesibilidad

- Conservar las pruebas útiles existentes y añadir casos que cubran cambios de comportamiento.
- Axe y teclado: foco visible, Escape, orden de tabulación, restauración de foco y formularios durante carga/error/éxito.
- Pruebas de movimiento reducido y desactivado, incluida una modificación de preferencia en tiempo de ejecución.
- SSR/hidratación, montaje/desmontaje, clics rápidos e interacción durante una salida.
- Puntero grueso, teclado, títulos y etiquetas largas, zoom, imágenes fallidas y temas claro/oscuro.
- Pruebas de navegador en Chromium, Firefox y WebKit; registrar soporte por función y fallback.
- Revisión manual con al menos un lector de pantalla de escritorio y uno móvil antes de presentar una versión estable.

### Visual y movimiento

- Generar referencias visuales en el entorno Linux reproducible previsto por el proyecto.
- En la suite de lanzamiento, una referencia que falte no debe contar como validación superada.
- Capturar estados finales deterministas y, por separado, revisar entradas, salidas y puntos de interrupción. Una captura estática no acredita la calidad del movimiento.
- Comparar móvil y escritorio y revisar scroll, clipping, portales y overlays.

### Rendimiento

- Mantener los límites actuales de la UI básica: Button 2,5 kB, formulario básico 6 kB, CSS global 19 kB y tokens CSS 5 kB, según el método de `size-limit` del repositorio.
- Registrar tres fixtures: UI estática; UI con Reveal/Presence; UI con layout/gestos. Contar el motor aunque se distribuya como peer.
- Objetivo inicial sujeto al piloto: hasta 20 kB Brotli adicionales para el caso básico de movimiento y 30 kB para el caso avanzado, excluyendo React/ReactDOM. Si se supera, reducir capacidades o cambiar el enfoque antes de normalizar un aumento del presupuesto.
- Publicar JS inicial, chunks diferidos, CSS y fuentes por separado. La carga diferida no se considera una reducción del total transferido.
- Mantener la referencia del proyecto de Lighthouse ≥95 en rendimiento, accesibilidad, buenas prácticas y SEO en las páginas controladas; registrar entorno y mediana de varias ejecuciones.
- Revisar en móvil representativo tareas largas, fluidez durante scroll y apertura de overlays. Tomar 16,7 ms como referencia de un frame a 60 Hz, sin prometer una tasa de refresco universal.
- Evitar actualizaciones de estado React por cada movimiento del puntero o frame de scroll; utilizar valores de movimiento y observar solo lo necesario.

Los resultados de las pruebas anteriores pertenecen al diseño actual. El rediseño necesitará sus propias mediciones y referencias.

## 10. Compatibilidad, migración y publicación

- Mantener nombres, semántica y composición de los componentes que ya funcionen. Revisar cada cambio de contrato por separado.
- El nuevo lenguaje será el estilo recomendado una vez concluido. Identificar los tokens necesarios para conservar una apariencia sobria en consumidores existentes y ofrecer una receta o preset si puede mantenerse con poco coste.
- Documentar cambios de defaults visuales, variantes que se sustituyan y diferencias de espaciado. No mantener indefinidamente dos catálogos completos en paralelo.
- Revisar README, descripción de paquetes, keywords y portada: el posicionamiento deja de limitarse a webs corporativas.
- Usar Changesets y determinar la versión según el estado real de publicación y el alcance de cambios incompatibles; `0.0.0` local no demuestra que no existan consumidores.
- Preparar npm, hosting de docs/demos y changelog al cierre, resolviendo las dependencias externas ya pendientes. Esas tareas no bloquean la prueba local del MVP.

## 11. Riesgos y respuesta prevista

| Riesgo | Respuesta |
| --- | --- |
| Una estética vistosa que dificulta leer | Validar páginas con contenido real, zoom y móvil desde el piloto |
| Animación innecesaria en toda la página | Un propósito por efecto; presets y límites de duración/recorrido |
| Dependencia pesada en usos pequeños | Paquete opcional, carga por capacidades y fixtures medidos |
| Hydration o contenido oculto | HTML inicial visible y estados iniciales seguros |
| Salidas que interfieren con Radix | Adaptadores probados para montaje, portales, foco y cierre |
| Transiciones de rutas dependientes del framework | Recetas específicas y mejora progresiva; primer alcance acotado |
| Mucho catálogo con poco acabado | Hito pequeño de ocho componentes y una página antes de ampliar |
| Dos sistemas visuales difíciles de mantener | Migración documentada y compatibilidad limitada a tokens/recetas |

## 12. Primer trabajo concreto de implementación

Construir el piloto en el playground usando la estructura existente:

1. Header tipográfico con navegación funcional.
2. Hero asimétrico sobre fondo marfil, titular grande y CTA lima con texto oscuro.
3. Bento de cuatro elementos que muestre tipografía, interacción, movimiento y composición.
4. Un selector de contenido que muestre continuidad de estados.
5. CTA invertido y footer sencillo.

Incluir desde el piloto móvil, tema oscuro y control de movimiento. Entregar capturas comparables y una demo navegable antes de adaptar todo el catálogo. Ese será el primer resultado que permita juzgar si Betterlibs ha encontrado la nueva personalidad.

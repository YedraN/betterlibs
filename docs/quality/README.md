# Cierre de calidad de UI y movimiento

La fase 8 está en curso. Este directorio conserva mediciones del producto actual y el recorrido
manual pendiente. No se ha publicado una versión estable. Cada JSON incluye su entorno o estado;
las pruebas automatizadas no sustituyen una revisión con lectores de pantalla.

Medición de fase 8 anterior a Command: 155 pruebas unitarias y 1.111 pruebas de navegador aprobadas, dos omisiones
táctiles justificadas en Firefox y ninguna prueba inestable. Lighthouse: once páginas y tres
ejecuciones por página, medianas 95–98 en rendimiento y 100 en las otras tres categorías.
La candidata RC se ha instalado y verificado en un consumidor aislado. La compilación final de
documentación ya se ha repetido con éxito e incluye Command y sus 117 páginas.

La ampliación Command pasa 109 pruebas de React (ocho nuevas), 36 comprobaciones en Chromium,
Firefox y WebKit, los builds de UI/Storybook/Next, tipos, lint y presupuestos. Se conserva por
separado de la medición anterior de fase 8; la revisión manual sigue aplazada para el equipo de casa.

## Ampliación del catálogo

Las veinte entregas aprobadas se registran en `PLAN_COMPONENTES.md`. Los resultados nuevos
están en `catalogue.json` y la integración de las 19 demos Next en `catalogue-docs.json`.
Los informes anteriores conservan su alcance; Lighthouse no se ha repetido para acreditar
las nuevas páginas de componentes. La entrada avanzada y su CSS tienen presupuestos separados.

Para revisar esta ampliación con lectores de pantalla, abrir `/docs/componentes/avanzados`
o los iframes de «Componentes → Avanzados → Catálogo», en escritorio y móvil:

- Combobox y MultiSelect: escuchar etiqueta, búsqueda, carga/error, elección y retirada;
  confirmar el foco al cerrar y la lectura del límite de selecciones.
- Fechas y tabla: reconocer fechas completas y límites, intervalo, encabezados, ordenación,
  selección por página y estado de resultados.
- Sidebar y Stepper: abrir/cerrar en móvil, devolver el foco, reconocer el paso y sus errores,
  volver conservando datos y confirmar la finalización.
- Dropzone, Slider y ToggleGroup: reconocer valores, límites, formatos rechazados, progreso
  y cancelación; operar con teclado y gestos del lector.
- TreeView, SplitPane y Kanban: reconocer jerarquía, expansión, porcentaje y columnas;
  mover tarjetas con los controles equivalentes al arrastre y confirmar el resultado.
- Timeline y EmptyState: leer fechas, estados y detalles; reconocer y activar la salida propuesta.
- CodeBlock/CopyButton, ImageViewer e InlineEdit: cambiar variante, escuchar copia o error,
  leer alternativas de imágenes, cerrar al activador y guardar/cancelar sin perder el borrador.
- Command, notificaciones y filtros: reconocer recientes y opciones, anuncios agrupados,
  acciones/progreso/persistencia y filtros activos; evitar anuncios duplicados.

Registrar lector, versión, dispositivo, fecha y cualquier problema encontrado. Este recorrido
está preparado; no se considera ejecutado al superar axe o las pruebas de teclado.

## Revisión manual preparada

Construir y arrancar el playground (`pnpm build`, `pnpm --filter @betterlibs/playground dev`).
Para los casos del catálogo, arrancar también `pnpm --filter @betterlibs/storybook dev`. En
Storybook abrir «Componentes → Editorial → Catálogo» y seleccionar la story indicada; para
TextReveal usar la galería de documentación (`pnpm --filter @betterlibs/docs dev`, `/docs/galeria`).
Abrir el iframe de la story en una pestaña aparte
para que las regiones de la propia interfaz de Storybook no interfieran en la lectura.
Abrir las rutas siguientes con un lector de escritorio y otro móvil real. Registrar lector y
versión, sistema operativo, dispositivo, persona y fecha. En móvil usar los gestos del lector;
en escritorio comprobar también teclado. Leer la documentación de uso del lector elegido.

| Caso en el registro | Recorrido y resultado esperado |
| --- | --- |
| landmarks | `/`: recorrer regiones y encabezados; llegar al contenido con «Saltar al contenido» y reconocer navegación, main y footer. |
| reading-order | `/plantillas/producto`, `/plantillas/estudio` y `/plantillas/articulo`: recorrer de principio a fin; orden lógico, enlaces con propósito e imágenes con alternativa adecuada. |
| forms-errors | `/contacto` y story «Formularios»: enviar vacío, localizar resumen y campo inválido, corregir y volver a enviar; escuchar etiquetas, errores y estado de carga/éxito. |
| dialog-focus | Story «Menús y overlays»: abrir Dialog y Drawer, recorrer contenido, cerrar con Escape y con botón; devolver el foco al activador sin leer contenido cerrado. Probar también el menú móvil de `/`. |
| announcements | Story «Menús y overlays»: activar notificaciones; comprobar anuncio comprensible sin mover el foco ni duplicar mensajes. |
| navigation | Plantillas y galería: seguir enlace de ruta, volver y avanzar; reconocer nuevo título, foco del contenido y scroll restaurado; activar enlaces de sección. |
| reduced-motion | Activar reducción en el sistema y cambiar el control de movimiento de la demo; contenido visible y recorridos anteriores disponibles en reducido y off. |
| text-reveal | `/plantillas/articulo` y demos de TextReveal: leer el texto una sola vez, con frase completa; sin fragmentos repetidos o letras anunciadas por separado. |
| scroll-progress | `/plantillas/articulo`: avanzar por el artículo; progreso no interrumpe la lectura y el contenido sigue accesible al final. |

Anotar problemas con ruta, pasos, resultado observado y lector. Resolverlos y repetir el caso antes
de marcarlo `passed`. Añadir notas en el registro aunque no haya incidencias. Conservar `pending`
mientras falte cualquiera de las dos revisiones; el usuario pidió dejar este recorrido preparado.

Completar `manual-a11y.json` con `status: "passed"`, `reviewedProductCommit` obtenido con
`git log -1 --format=%H -- packages apps`, y objetos `desktop` y `mobile`. Cada objeto necesita
`reviewer`, `reader`, `version`, `os`, `device`, `date`, `notes` y `cases`: las nueve claves de la
tabla con valor `"passed"`. Ejecutar `node scripts/check-manual-a11y.mjs` desde la raíz. Un cambio
posterior en producto requiere repetir la revisión relevante y actualizar su commit.

## Referencias visuales Linux

El workflow Visual utiliza `mcr.microsoft.com/playwright:v1.63.0-noble`. Ejecutarlo con actualización
de referencias, revisar sus imágenes y diferencias y conservar las referencias aprobadas; después
ejecutarlo sin actualización. Incluye stories y páginas, escritorio/móvil y claro/oscuro. La suite
falla si falta una referencia. `VISUAL_ANY_OS=1` permite diagnóstico local, pero no crear referencias
fuera de Linux. En este equipo Windows no hay WSL ni un daemon Linux Docker disponible.

## Evidencia automatizada y distribución

Desde la raíz, con builds actualizados:

```bash
pnpm --filter @betterlibs/e2e exec playwright install chromium firefox webkit
pnpm --filter @betterlibs/e2e test:e2e --workers=2
pnpm --filter @betterlibs/e2e exec node scripts/summarize-browsers.mjs
pnpm lighthouse
pnpm --filter @betterlibs/e2e exec node scripts/summarize-lighthouse.mjs
pnpm --filter @betterlibs/e2e exec node scripts/profile-interactions.mjs
pnpm prepare:release
```

Ejecutar Lighthouse y perfilado sin builds ni otras baterías simultáneas. Lighthouse recoge tres
ejecuciones por ruta y exige mediana ≥95 en cuatro categorías. El perfil de scroll y overlays usa
Chromium, viewport 390×844 y CPU ×4: es emulación de escritorio, pendiente de contraste en un móvil
físico. Los bytes son cuerpos HTTP codificados y separan JS inicial, motor diferido, CSS, imágenes y
fuentes. El intervalo de frames es un diagnóstico con referencia 16,7 ms, no una garantía universal.
El perfil reutiliza el contexto y la caché tras la primera ruta. Lighthouse reinicia almacenamiento
y caché en cada ejecución; sus métricas de carga no se sustituyen por el perfil de interacciones.
`assets` captura los recursos al cargar y `afterInteractionsAssets` después del recorrido: permite
identificar también imágenes o motores solicitados por el scroll. En un móvil físico representativo,
repetir lectura y abrir/cerrar el menú con movimiento activo, reducido y off, registrar modelo,
navegador y sistema y conservar una traza de rendimiento; esa comprobación sigue pendiente.

`browsers.json` registra resultados por motor y omisiones justificadas. Firefox no permite el
contexto móvil/táctil de Playwright; esos dos casos se ejecutan en Chromium y WebKit. El swipe nativo
CDP solo se prueba en Chromium. WebKit automatizado en Windows no acredita las preferencias de
tabulación de Safari en un dispositivo Apple real.

`prepare:release` genera prereleases RC en `.release/candidate-*`, con changelogs, tarballs, hashes
y un manifiesto. Verifica exports, licencias, peers, SSR y resolución desde un consumidor independiente.
`release-candidate.json` identifica la última candidata. Las versiones del checkout no se cambian.
CI guarda los artefactos; el workflow Release es manual y exige lectores de pantalla y referencias
Linux antes de ejecutar Changesets. La publicación y el hosting siguen pendientes.

Las tres aplicaciones conservan su `vercel.json`: raíz de proyecto `apps/docs`, `apps/storybook`
o `apps/playground`, respectivamente. Después de conectar el repositorio al destino, configurar
`VITE_DOCS_URL` para los enlaces del playground y `NEXT_PUBLIC_PLAYGROUND_URL` y
`NEXT_PUBLIC_STORYBOOK_URL` para la documentación con las URLs públicas elegidas. No se ha creado
un destino de hosting ni configurado credenciales npm en esta fase.

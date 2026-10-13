# @betterlibs/react

## 1.0.0

### Major Changes

- e75b99e: Primera versión estable (1.0.0) de Betterlibs UI: tokens y temas con contraste verificado,
  más de 60 componentes, bloques corporativos, aviso de cookies RGPD e iconos.
  
  - Auditoría de accesibilidad automatizada: axe (WCAG 2.2 AA) en todas las stories y plantillas,
    en modo claro y oscuro, y recorridos de teclado de los patrones críticos.
  - `Carousel`: la zona desplazable es enfocable cuando las diapositivas no tienen nada enfocable,
    para poder moverla con las flechas (WCAG 2.1.1).
  - `Header`: al elegir un enlace del menú móvil, el foco va al título del contenido principal en
    lugar de volver al botón del menú.
  - `Pagination`: «Anterior» y «Siguiente» desactivados usan texto atenuado con contraste 4.5:1.
  - `PostCard`: la imagen acepta `srcSet` y `sizes` para imágenes adaptables.
  - `@betterlibs/icons`: los iconos se marcan como puros, así que importar uno solo añade ~0,4 kB.

### Minor Changes

- 7c9892a: Estilo más limpio por defecto: botones sólidos, tarjetas con borde discreto, controles planos,
  antetítulos de texto y hero con imagen sin marco ni resplandor. Los degradados de Button
  (`appearance="gradient"`), el cristal de Header (`surface="glass"`) y la decoración de CTA
  (`panelStyle="glow"`) se activan de forma explícita. Se mantienen las variantes decorativas de
  Card y los fondos de Section y Hero.
  
  Se simplifican los bloques de contenido y precios, se ajustan el ritmo tipográfico y los
  estados de los formularios, y `Button loading` bloquea también el envío nativo sin `onClick`.
- 8a403ba: Añade AnimatedNumber con formato Intl, valor final visible en SSR y una representación
  accesible única. Cancela los fotogramas al cambiar preferencias, salir de vista o desmontar;
  los cambios rápidos parten de la cifra visible y no actualizan estado React por fotograma.
  
  Publica BentoFeatures, BentoFeature y FeatureShowcase. Hero incorpora la variante editorial
  y CTA el panel inverso. Los bloques mantienen la UI independiente del motor opcional y
  permiten componer Reveal/Stagger con contenido visible en el servidor.
- 6ece7a0: Completar la adaptación editorial de las secciones de precios, testimonios, preguntas, proceso,
  equipo y conversión. Añadir TextReveal por líneas explícitas y ScrollProgress nativo sin motor,
  con contenido seguro en SSR, preferencias compartidas y limpieza de listeners.
- 75f7af3: Lenguaje visual «Profundidad suave»: tokens de efectos (elevación, degradados, halos, cristal y
  patrones), tipografía Inter y densidad compacta. Nuevos `Card`, `IconTile` y `GradientText`;
  `Section` y los bloques aceptan `background`; `Button` añade la variante `soft`; rediseño de
  todos los componentes y bloques.

### Patch Changes

- 8a403ba: Completa los estados editoriales de formularios, menús y feedback. Los overlays cerrados
  restauran el foco inmediatamente; Toast queda inerte al salir y conserva actualizaciones
  con el mismo id. Añade hooks opcionales de continuidad de posiciones e indicador de Tabs
  con springs diferidos, sin cargar capacidades avanzadas desde la UI básica.
- 8a403ba: Completa los estados editoriales de Button, Card, Input, Tabs, Accordion, Dialog, Header y
  SectionHeader con los roles compartidos de movimiento, sin incorporar el motor opcional a la UI.
  
  Los mensajes de Field se muestran después del control y conservan el foco durante la edición.
  Los paneles de Accordion quedan inertes desde el cierre y colapsan al cancelar su animación.
  Dialog desmonta el contenido al cerrar y restaura el foco sin esperar al desvanecimiento del fondo.
  Tabs oculta los paneles inactivos montados y ajusta su indicador a etiquetas dinámicas y RTL.
  
  Los tokens CSS permiten restringir el movimiento mediante data-motion="reduced" u "off".
  La preferencia del sistema cancela las animaciones y transiciones activas. Los tamaños explícitos
  de SectionHeader y las variantes decorativas existentes mantienen sus contratos.
- 6ece7a0: Evitar que retirar los errores durante una pulsación de puntero desplace el botón de envío
  antes del clic. La validación al enviar sigue revisando todos los campos y la salida con teclado
  conserva la revalidación inmediata.
- Updated dependencies [7c9892a]
- Updated dependencies [8a403ba]
- Updated dependencies [e75b99e]
- Updated dependencies [75f7af3]
  - @betterlibs/tokens@1.0.0
  - @betterlibs/icons@1.0.0

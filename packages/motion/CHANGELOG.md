# @betterlibs/motion

## 0.1.0

### Minor Changes

- 8a403ba: Completa los estados editoriales de formularios, menús y feedback. Los overlays cerrados
  restauran el foco inmediatamente; Toast queda inerte al salir y conserva actualizaciones
  con el mismo id. Añade hooks opcionales de continuidad de posiciones e indicador de Tabs
  con springs diferidos, sin cargar capacidades avanzadas desde la UI básica.
- 8a403ba: Añade AnimatedNumber con formato Intl, valor final visible en SSR y una representación
  accesible única. Cancela los fotogramas al cambiar preferencias, salir de vista o desmontar;
  los cambios rápidos parten de la cifra visible y no actualizan estado React por fotograma.
  
  Publica BentoFeatures, BentoFeature y FeatureShowcase. Hero incorpora la variante editorial
  y CTA el panel inverso. Los bloques mantienen la UI independiente del motor opcional y
  permiten componer Reveal/Stagger con contenido visible en el servidor.
- 6ece7a0: Completar la adaptación editorial de las secciones de precios, testimonios, preguntas, proceso,
  equipo y conversión. Añadir TextReveal por líneas explícitas y ScrollProgress nativo sin motor,
  con contenido seguro en SSR, preferencias compartidas y limpieza de listeners.
- 7c9892a: Añade un paquete opcional con MotionProvider, Reveal, Stagger, Presence y hooks de preferencias
  y animación. Respeta movimiento reducido, mantiene contenido visible en SSR, carga Motion mini
  por separado y cancela efectos pendientes/activos al cambiar preferencias o desmontar.

### Patch Changes

- Updated dependencies [7c9892a]
- Updated dependencies [8a403ba]
- Updated dependencies [e75b99e]
- Updated dependencies [75f7af3]
  - @betterlibs/tokens@1.0.0

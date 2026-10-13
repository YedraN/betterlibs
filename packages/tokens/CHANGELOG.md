# @betterlibs/tokens

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

- 7c9892a: Añade el preset editorial marfil/carbón/lima mediante `editorial.css` y `createTheme({ preset: editorial })`, con tipografía expresiva, superficies planas y radios contenidos. Publica roles de movimiento, stagger y presets físicos de spring compartidos por CSS y JavaScript.
  
  Valida contraste sin redondear, incluye el estado active y controles sobre superficies, y corrige el esquema nativo de color del documento y la prioridad del modo claro explícito en temas acotados bajo un sistema oscuro. `Theme.palette` permite resolver las referencias semánticas del preset. El objeto `editorial` y el tipo `ThemePreset` permiten seleccionar o definir fundamentos sin incluir otros presets en el bundle. El estilo predeterminado se mantiene durante la migración del catálogo.
- 75f7af3: Lenguaje visual «Profundidad suave»: tokens de efectos (elevación, degradados, halos, cristal y
  patrones), tipografía Inter y densidad compacta. Nuevos `Card`, `IconTile` y `GradientText`;
  `Section` y los bloques aceptan `background`; `Button` añade la variante `soft`; rediseño de
  todos los componentes y bloques.

### Patch Changes

- 8a403ba: Completa los estados editoriales de Button, Card, Input, Tabs, Accordion, Dialog, Header y
  SectionHeader con los roles compartidos de movimiento, sin incorporar el motor opcional a la UI.
  
  Los mensajes de Field se muestran después del control y conservan el foco durante la edición.
  Los paneles de Accordion quedan inertes desde el cierre y colapsan al cancelar su animación.
  Dialog desmonta el contenido al cerrar y restaura el foco sin esperar al desvanecimiento del fondo.
  Tabs oculta los paneles inactivos montados y ajusta su indicador a etiquetas dinámicas y RTL.
  
  Los tokens CSS permiten restringir el movimiento mediante data-motion="reduced" u "off".
  La preferencia del sistema cancela las animaciones y transiciones activas. Los tamaños explícitos
  de SectionHeader y las variantes decorativas existentes mantienen sus contratos.

# @betterlibs/icons

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

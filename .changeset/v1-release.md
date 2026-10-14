---
'@betterlibs/react': major
'@betterlibs/tokens': major
'@betterlibs/icons': major
---

Preparación de la primera versión de Betterlibs UI: tokens, preset editorial, componentes,
bloques, aviso de cookies e iconos. La aceptación estable requiere el cierre de calidad del
plan UI/motion, incluidas referencias Linux revisadas y lectores de pantalla.

- Auditoría de accesibilidad automatizada: axe (WCAG 2.2 AA) en todas las stories y plantillas,
  en modo claro y oscuro, y recorridos de teclado de los patrones críticos.
- `Carousel`: la zona desplazable es enfocable cuando las diapositivas no tienen nada enfocable,
  para poder moverla con las flechas (WCAG 2.1.1).
- `Header`: al elegir un enlace del menú móvil, el foco va al título del contenido principal en
  lugar de volver al botón del menú.
- `Pagination`: «Anterior» y «Siguiente» desactivados usan texto atenuado con contraste 4.5:1.
- `PostCard`: la imagen acepta `srcSet` y `sizes` para imágenes adaptables.
- `@betterlibs/icons`: los iconos se marcan como puros, así que importar uno solo añade ~0,4 kB.

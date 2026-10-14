---
"@betterlibs/react": patch
"@betterlibs/motion": patch
---

Conserva el envío del formulario con un solo clic también cuando el navegador no enfoca
el botón y comunica relatedTarget nulo. Presence restaura el foco cuando el navegador
desenfoca un descendiente al aplicar inert antes del efecto de cierre.

SkipLink declara tabindex=0 para conservar el acceso de teclado al salto de contenido
también en motores que no incluyen enlaces implícitos en su recorrido predeterminado.

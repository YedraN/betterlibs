---
'@betterlibs/react': patch
'@betterlibs/tokens': patch
---

Completa los estados editoriales de Button, Card, Input, Tabs, Accordion, Dialog, Header y
SectionHeader con los roles compartidos de movimiento, sin incorporar el motor opcional a la UI.

Los mensajes de Field se muestran después del control y conservan el foco durante la edición.
Los paneles de Accordion quedan inertes desde el cierre y colapsan al cancelar su animación.
Dialog desmonta el contenido al cerrar y restaura el foco sin esperar al desvanecimiento del fondo.
Tabs oculta los paneles inactivos montados y ajusta su indicador a etiquetas dinámicas y RTL.

Los tokens CSS permiten restringir el movimiento mediante data-motion="reduced" u "off".
La preferencia del sistema cancela las animaciones y transiciones activas. Los tamaños explícitos
de SectionHeader y las variantes decorativas existentes mantienen sus contratos.

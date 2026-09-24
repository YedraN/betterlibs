# @betterlibs/icons

58 iconos SVG de trazo como componentes React, pensados para webs corporativas.

```tsx
import { ArrowRightIcon, MailIcon } from '@betterlibs/icons'

<ArrowRightIcon />                         // decorativo: se oculta a lectores de pantalla
<MailIcon title="Correo electrónico" />    // informativo: se anuncia
<ArrowRightIcon size={20} strokeWidth={2} />
```

- Tamaño por defecto `1em` y color `currentColor`: se adaptan al texto.
- Crea los tuyos con `createIcon('Nombre', ['M5 12h14', { c: [12, 12, 4] }])`.
- Algunos trazados (p. ej. `PhoneIcon`) están adaptados de [Lucide](https://lucide.dev) (licencia ISC).

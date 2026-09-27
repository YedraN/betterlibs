# @betterlibs/icons

64 iconos SVG de trazo como componentes React, pensados para webs corporativas.

```tsx
import { ArrowRightIcon, MailIcon } from '@betterlibs/icons'

<ArrowRightIcon />                         // decorativo: se oculta a lectores de pantalla
<MailIcon title="Correo electrónico" />    // informativo: se anuncia
<ArrowRightIcon size={20} strokeWidth={2} />
```

- Tamaño por defecto `1em` y color `currentColor`: se adaptan al texto.
- Incluye LinkedIn, X, Instagram, Facebook, YouTube y GitHub en versión de trazo (no son los logotipos
  oficiales; si una red exige su logo exacto, usa el SVG de su kit de marca).
- Crea los tuyos con `createIcon('Nombre', ['M5 12h14', { c: [12, 12, 4] }])`.
- Algunos trazados (p. ej. `PhoneIcon`) están adaptados de [Lucide](https://lucide.dev) (licencia ISC).

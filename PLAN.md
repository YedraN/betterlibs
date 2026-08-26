# Plan de desarrollo — Betterlibs

## Objetivo

Crear una web React + TypeScript que permita descubrir librerías destacadas del ecosistema Node.js, con una interfaz moderna, futurista y útil desde el primer vistazo.

## Alcance de esta primera versión

- Catálogo curado de librerías agrupadas por categoría.
- Buscador por nombre, descripción, etiqueta o categoría.
- Filtros rápidos por categoría y ordenación por popularidad o relevancia.
- Tarjetas con métricas, etiquetas y enlaces a npm y GitHub.
- Modal de detalle con información ampliada.
- Diseño responsive, accesible y de alto contraste.

## Ejecución

- [x] 1. Definir el alcance de la v1 y crear este plan.
- [x] 2. Inicializar el proyecto React con TypeScript y la base de estilos.
- [x] 3. Crear los datos curados y los componentes del catálogo.
- [x] 4. Implementar búsqueda, filtros, ordenación y detalle.
- [x] 5. Aplicar la dirección visual futurista y el diseño responsive.
- [x] 6. Compilar y verificar la aplicación.

## Decisiones de producto

- La v1 usa datos locales cuidadosamente estructurados para ofrecer una experiencia funcional sin depender de una API externa.
- El contenido se presenta en español, mientras que los nombres y etiquetas técnicas conservan la terminología habitual del ecosistema.
- El diseño evita efectos que resten legibilidad: el tono futurista se apoya en una retícula oscura, acentos eléctricos, transparencias y microanimaciones discretas.

## Fuera de alcance en v1

- Cuentas de usuario, favoritos persistentes y panel administrativo.
- Sincronización automática con npm/GitHub.
- Backend o base de datos.

## Verificación final

- `npm run build` finaliza sin errores de TypeScript ni de empaquetado.
- La salida de producción se genera en `dist/`.
- Se comprobó la estructura de los flujos de búsqueda, filtros, ordenación y modal en el código. La previsualización automatizada local no pudo abrirse desde el navegador integrado porque bloqueó `localhost` (`ERR_BLOCKED_BY_CLIENT`); el servidor de desarrollo de Vite sí arrancó correctamente en `http://localhost:5173/`.

## Ajuste visual posterior

- [x] Unificar las esquinas con una escala de radios para controles, tarjetas y modal.
- [x] Añadir animaciones de entrada, interacción y contexto con compatibilidad para `prefers-reduced-motion`.

## Ampliación de catálogo

- [x] Investigar y seleccionar 100 librerías actuales de los ecosistemas Node.js y TypeScript.
- [x] Clasificarlas en Backend, Frontend, Datos, DevTools, IA y Testing, con enlaces a npm y GitHub.

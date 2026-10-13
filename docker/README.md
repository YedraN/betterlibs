# Desarrollo con Docker

Solo necesitas Docker Engine o Docker Desktop con Compose. Node y pnpm se instalan en la imagen.
Desde la raíz del proyecto:

```bash
./docker.sh
```

El script construye la imagen, arranca tres contenedores en segundo plano y espera a que los
tres respondan. Si tu usuario necesita sudo para acceder a Docker, pide la contraseña en tu
terminal. No modifica los grupos ni permisos del equipo. La primera construcción descarga
las dependencias; las siguientes reutilizan la capa de instalación mientras no cambien los manifests.

| Servicio | URL predeterminada |
| --- | --- |
| Web / playground | http://localhost:8080 |
| Documentación | http://localhost:3000/docs |
| Storybook | http://localhost:6006 |

Se publica únicamente en localhost. Se usa 8080 para la web para no ocupar el 5173 del Vite local.
Los enlaces de la web apuntan al puerto de documentación configurado.

## Actualizaciones al editar

Los directorios de fuentes se montan en solo lectura. Vite, Next y Storybook detectan cambios;
Turbo recompila tokens, iconos, React y motion siguiendo las dependencias. La documentación
también regenera las referencias de React y movimiento y el código copiable de la galería
cuando cambian sus fuentes.

Cada contenedor mantiene sus propios node_modules, dist, .next y archivos generados. No monta
los node_modules del host ni escribe artefactos o archivos propiedad de root en el proyecto.
Si un proceso principal termina, el lanzador detiene sus procesos hijos y Docker reinicia el servicio.

Para cambios en dependencias, configuraciones de build, nuevos paquetes, Dockerfile o Compose,
ejecuta de nuevo `./docker.sh` para reconstruir la imagen. Los cambios habituales de componentes,
páginas, estilos y contenido no requieren comandos.

## Reinicio y controles

`restart: unless-stopped` permite recuperar los servicios al reiniciar Docker, siempre que no
los hayas detenido. El daemon debe estar en marcha. Es el comportamiento documentado por
[Docker](https://docs.docker.com/engine/containers/start-containers-automatically/).

```bash
./docker.sh status  # estado y salud de los tres contenedores
./docker.sh logs    # seguir los logs; Ctrl+C deja los servicios en marcha
./docker.sh stop    # detener conservando los contenedores
./docker.sh down    # retirar los contenedores de este proyecto
./docker.sh         # arrancar o actualizar otra vez
```

Los logs tienen rotación para evitar crecimiento ilimitado. Los healthchecks verifican una
respuesta HTTP de cada app; no sustituyen las pruebas de comportamiento de la librería.

## Cambiar puertos

Crea un `.env` en la raíz (no se incluye en la imagen ni en Git):

```dotenv
BETTERLIBS_WEB_PORT=8081
BETTERLIBS_DOCS_PORT=3001
BETTERLIBS_STORYBOOK_PORT=6008
```

Después ejecuta `./docker.sh`. Compose aplica estos puertos y los enlaces entre las tres apps; el
script imprime las URLs reales de los contenedores. También puedes usar Compose directamente:

```bash
docker compose up --build --detach --wait --wait-timeout 300
```

Si un puerto ya está ocupado, detén el servidor correspondiente o cambia su puerto en `.env`.
Si falla la construcción o un healthcheck, `./docker.sh logs` muestra el servicio afectado.

## Comprobar el lanzador

Las pruebas de parada, fallo de una app y fallo del build inicial no necesitan un daemon Docker.
Con Node instalado, ejecuta `node --test docker/dev.test.mjs` desde la raíz del proyecto.

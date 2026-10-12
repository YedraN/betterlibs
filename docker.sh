#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

if ! command -v docker >/dev/null; then
  echo 'Docker no está instalado.' >&2
  exit 1
fi

docker_command=(docker)
if ! docker info >/dev/null 2>&1; then
  if [[ -t 0 ]] && command -v sudo >/dev/null; then
    echo 'Se necesita sudo para acceder a Docker en este equipo.' >&2
    docker_command=(sudo docker)
  else
    echo 'Sin acceso a Docker. Ejecuta ./docker.sh desde una terminal con acceso al daemon.' >&2
    exit 1
  fi
fi

case "${1:-up}" in
  up)
    "${docker_command[@]}" compose up --build --detach --wait --wait-timeout 300
    web_address=$("${docker_command[@]}" compose port web 5173)
    docs_address=$("${docker_command[@]}" compose port docs 3000)
    storybook_address=$("${docker_command[@]}" compose port storybook 6006)
    echo "Web:           http://${web_address/127.0.0.1/localhost}"
    echo "Documentación: http://${docs_address/127.0.0.1/localhost}/docs"
    echo "Storybook:     http://${storybook_address/127.0.0.1/localhost}"
    ;;
  stop) "${docker_command[@]}" compose stop ;;
  down) "${docker_command[@]}" compose down ;;
  logs) "${docker_command[@]}" compose logs --follow ;;
  status) "${docker_command[@]}" compose ps ;;
  *) echo 'Uso: ./docker.sh [up|stop|down|logs|status]' >&2; exit 1 ;;
esac

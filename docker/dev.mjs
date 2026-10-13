import { spawn } from 'node:child_process'
import { watch } from 'node:fs'

const commands = {
  web: [
    '--filter',
    '@betterlibs/playground',
    'exec',
    'vite',
    '--host',
    '0.0.0.0',
    '--port',
    '5173',
    '--strictPort',
  ],
  docs: ['--filter', '@betterlibs/docs', 'dev', '--hostname', '0.0.0.0', '--port', '3000'],
  storybook: [
    '--filter',
    '@betterlibs/storybook',
    'exec',
    'storybook',
    'dev',
    '--host',
    '0.0.0.0',
    '--port',
    '6006',
    '--ci',
    '--no-open',
  ],
}
// biome-ignore lint/suspicious/noUndeclaredEnvVars: Docker launcher, not a cached Turbo task.
const service = process.env.BETTERLIBS_SERVICE
if (!Object.hasOwn(commands, service ?? '')) {
  console.error('BETTERLIBS_SERVICE debe ser web, docs o storybook.')
  process.exit(1)
}

const children = new Set()
let stopping = false
const apiWatchers = []
let apiTimer

function shutdown(code) {
  if (stopping) return
  stopping = true
  for (const watcher of apiWatchers) watcher.close()
  clearTimeout(apiTimer)
  for (const child of children) {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {}
  }
  // Stop pnpm's entire process groups, including their Vite/Next/Turbo children.
  setTimeout(() => {
    for (const child of children) {
      try {
        process.kill(-child.pid, 'SIGKILL')
      } catch {}
    }
    process.exit(code)
  }, 5000).unref()
  if (children.size === 0) process.exit(code)
  process.exitCode = code
}

function launch(args, persistent = false) {
  const child = spawn('pnpm', args, { stdio: 'inherit', detached: true })
  children.add(child)
  child.once('error', (error) => {
    console.error(error.message)
    shutdown(1)
  })
  child.once('exit', (code, signal) => {
    children.delete(child)
    if (stopping) {
      if (children.size === 0) process.exit(process.exitCode ?? 0)
    } else if (persistent) {
      // The process-group leader can exit while a Vite/Next descendant is still alive.
      try {
        process.kill(-child.pid, 'SIGTERM')
      } catch {}
      console.error(`Proceso detenido (${signal ?? code}); reiniciando el servicio con Docker.`)
      shutdown(1)
    }
  })
  return child
}

process.once('SIGTERM', () => shutdown(0))
process.once('SIGINT', () => shutdown(0))

// Source mounts can be newer than the image. Build once before starting the app.
await new Promise((resolve, reject) => {
  const child = launch(['exec', 'turbo', 'run', 'build', '--filter=./packages/*'])
  child.once('exit', (code) =>
    code === 0 ? resolve() : reject(new Error(`Build inicial fallido: ${code}`)),
  )
  child.once('error', reject)
}).catch((error) => {
  console.error(error.message)
  shutdown(1)
})

if (!stopping) {
  launch(['exec', 'turbo', 'watch', 'build', '--filter=./packages/*'], true)
  launch(commands[service], true)
  if (service === 'docs') {
    // The API reference is derived from source, not only the compiled packages.
    for (const directory of [
      'packages/react/src',
      'packages/motion/src',
      'apps/docs/components/docs/examples',
    ]) {
      apiWatchers.push(
        watch(directory, { recursive: true }, () => {
          clearTimeout(apiTimer)
          apiTimer = setTimeout(() => launch(['--filter', '@betterlibs/docs', 'generate']), 300)
        }),
      )
    }
  }
}

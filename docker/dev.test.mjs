import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const launcher = fileURLToPath(new URL('./dev.mjs', import.meta.url))

async function waitFor(check) {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (check()) return
    await delay(25)
  }
  assert.fail('El proceso no llegó al estado esperado en 5 s')
}

function alive(pid) {
  try {
    process.kill(pid, 0)
    // An orphan already terminated can briefly remain a zombie until init reaps it.
    return !/\) Z /.test(readFileSync(`/proc/${pid}/stat`, 'utf8'))
  } catch {
    return false
  }
}

async function fixture(t, extra = {}) {
  const root = await mkdtemp(join(tmpdir(), 'betterlibs-docker-processes-'))
  await mkdir(join(root, 'bin'))
  await mkdir(join(root, 'packages/react/src'), { recursive: true })
  const fakePnpm = join(root, 'bin/pnpm')
  await writeFile(
    fakePnpm,
    `#!/usr/bin/env node
import { spawn } from 'node:child_process'
const args = process.argv.slice(2)
if (args.includes('run')) process.exit(process.env.FAIL_BUILD ? 2 : 0)
const type = args.includes('watch') ? 'watch' : 'app'
console.log(JSON.stringify({ pid: process.pid, type }))
if (type === 'app') {
  spawn(process.execPath, ['-e', "console.log(JSON.stringify({pid:process.pid,type:'grandchild'}));setInterval(()=>{},1000)"], {stdio:'inherit'})
  if (process.env.FAIL_APP) setTimeout(() => process.exit(2), 200)
}
setInterval(() => {}, 1000)
`,
  )
  await chmod(fakePnpm, 0o755)
  const child = spawn(process.execPath, [launcher], {
    cwd: root,
    env: {
      ...process.env,
      PATH: `${join(root, 'bin')}:${process.env.PATH}`,
      BETTERLIBS_SERVICE: 'docs',
      ...extra,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let stdout = ''
  child.stdout.on('data', (chunk) => {
    stdout += chunk
  })
  child.stderr.resume()
  const events = () =>
    stdout
      .split('\n')
      .filter((line) => line.startsWith('{'))
      .map((line) => JSON.parse(line))
  const exited = new Promise((resolve) => child.once('exit', resolve))
  t.after(async () => {
    child.kill('SIGTERM')
    for (const { pid } of events()) {
      try {
        process.kill(pid, 'SIGKILL')
      } catch {}
    }
    await rm(root, { recursive: true, force: true })
  })
  return { child, events, exited }
}

test('SIGTERM detiene el watcher, la app y sus descendientes', async (t) => {
  const { child, events, exited } = await fixture(t)
  await waitFor(() => events().length === 3)
  child.kill('SIGTERM')
  assert.equal(await exited, 0)
  await waitFor(() => events().every(({ pid }) => !alive(pid)))
})

test('el fallo de una app cierra también el watcher y devuelve error para Docker', async (t) => {
  const { events, exited } = await fixture(t, { FAIL_APP: '1' })
  assert.equal(await exited, 1)
  assert.equal(events().length, 3)
  await waitFor(() => events().every(({ pid }) => !alive(pid)))
})

test('un build inicial fallido no arranca servidores', async (t) => {
  const { events, exited } = await fixture(t, { FAIL_BUILD: '1' })
  assert.equal(await exited, 1)
  assert.deepEqual(events(), [])
})

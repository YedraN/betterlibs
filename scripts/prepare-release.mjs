import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdir, mkdtemp, readdir, readFile, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { promisify } from 'node:util'
import { gunzipSync } from 'node:zlib'

const root = resolve(import.meta.dirname, '..')
const require = createRequire(import.meta.url)
const execute = promisify(execFile)
const names = ['tokens', 'icons', 'react', 'motion']
const base = join(root, '.release')
await mkdir(base, { recursive: true })
const stage = await mkdtemp(join(base, 'candidate-'))
const pnpm = process.env.npm_execpath
if (!pnpm) throw new Error('Ejecuta este script con pnpm prepare:release.')
const runPnpm = async (args, cwd) => {
  const executable = /\.(?:c?js|mjs)$/.test(pnpm) ? process.execPath : pnpm
  const prefix = executable === process.execPath ? [pnpm] : []
  const result = await execute(executable, [...prefix, ...args], {
    cwd,
    windowsHide: true,
    maxBuffer: 5_000_000,
  })
  if (result.stderr) process.stderr.write(result.stderr)
  return result.stdout
}
const rootPackage = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
await writeFile(
  join(stage, 'package.json'),
  JSON.stringify(
    {
      name: 'betterlibs-release-preview',
      private: true,
      packageManager: rootPackage.packageManager,
    },
    null,
    2,
  ),
)
await writeFile(join(stage, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n')
await cp(join(root, '.changeset'), join(stage, '.changeset'), { recursive: true })
for (const name of names) {
  const source = join(root, 'packages', name)
  const dest = join(stage, 'packages', name)
  await mkdir(dest, { recursive: true })
  await cp(join(source, 'dist'), join(dest, 'dist'), { recursive: true })
  for (const file of ['README.md', 'package.json']) await cp(join(source, file), join(dest, file))
  await cp(join(root, 'LICENSE'), join(dest, 'LICENSE'))
}
const changesetPackage = require.resolve('@changesets/cli/package.json')
const changesetMeta = JSON.parse(await readFile(changesetPackage, 'utf8'))
const changesetCLI = resolve(dirname(changesetPackage), Object.values(changesetMeta.bin)[0])
for (const args of [['pre', 'enter', 'rc'], ['version']]) {
  const result = await execute(process.execPath, [changesetCLI, ...args], {
    cwd: stage,
    windowsHide: true,
    maxBuffer: 5_000_000,
  })
  process.stdout.write(result.stdout)
}
const tarballs = join(stage, 'tarballs')
await mkdir(tarballs)
// Resolve only known internal workspace ranges against Changesets' candidate versions.
const versions = new Map()
for (const name of names) {
  const pkg = JSON.parse(await readFile(join(stage, 'packages', name, 'package.json'), 'utf8'))
  versions.set(pkg.name, pkg.version)
}
for (const name of names) {
  const file = join(stage, 'packages', name, 'package.json')
  const pkg = JSON.parse(await readFile(file, 'utf8'))
  for (const kind of ['dependencies', 'peerDependencies', 'devDependencies']) {
    for (const [dependency, range] of Object.entries(pkg[kind] ?? {})) {
      if (!String(range).startsWith('workspace:')) continue
      const version = versions.get(dependency)
      if (!version || !['workspace:*', 'workspace:^', 'workspace:~'].includes(range))
        throw new Error(`Rango interno desconocido: ${dependency} ${range}`)
      pkg[kind][dependency] = `${range === 'workspace:*' ? '' : range.slice(-1)}${version}`
    }
  }
  await writeFile(file, `${JSON.stringify(pkg, null, 2)}\n`)
}
await runPnpm(['-r', '--filter', './packages/*', 'pack', '--pack-destination', tarballs], stage)

function filesFromTar(buffer) {
  const tar = gunzipSync(buffer)
  const files = new Map()
  for (let offset = 0; offset + 512 <= tar.length; ) {
    const header = tar.subarray(offset, offset + 512)
    const name = header.subarray(0, 100).toString().replace(/\0.*$/, '')
    if (!name) break
    const size =
      Number.parseInt(header.subarray(124, 136).toString().replace(/\0.*$/, '').trim(), 8) || 0
    const prefix = header.subarray(345, 500).toString().replace(/\0.*$/, '')
    files.set(prefix ? `${prefix}/${name}` : name, tar.subarray(offset + 512, offset + 512 + size))
    offset += 512 + Math.ceil(size / 512) * 512
  }
  return files
}
const archives = []
for (const filename of await readdir(tarballs)) {
  if (!filename.endsWith('.tgz')) continue
  const bytes = await readFile(join(tarballs, filename))
  const files = filesFromTar(bytes)
  const pkg = JSON.parse(files.get('package/package.json').toString())
  if (!pkg.version.includes('-rc.')) throw new Error(`La versión no es candidata: ${pkg.name}`)
  for (const kind of ['dependencies', 'peerDependencies']) {
    if (Object.values(pkg[kind] ?? {}).some((range) => String(range).startsWith('workspace:')))
      throw new Error(`Queda workspace en ${pkg.name}`)
  }
  for (const entry of Object.values(pkg.exports)) {
    for (const path of typeof entry === 'string' ? [entry] : Object.values(entry)) {
      if (!files.has(`package/${path.replace(/^\.\//, '')}`))
        throw new Error(`Export ausente: ${pkg.name} ${path}`)
    }
  }
  if (!files.has('package/LICENSE') || !files.has('package/CHANGELOG.md'))
    throw new Error(`Falta licencia/changelog: ${pkg.name}`)
  const js = [...files.keys()].filter((file) => file.endsWith('.js'))
  if (
    pkg.name === '@betterlibs/react' &&
    js.some((file) =>
      /(?:from\s*|import\s*\()["'](?:motion|@betterlibs\/motion)/.test(files.get(file).toString()),
    )
  )
    throw new Error('La UI estática importa el motor')
  if (
    pkg.name === '@betterlibs/motion' &&
    !files.get('package/dist/index.js').toString().startsWith('"use client"')
  )
    throw new Error('Falta la frontera cliente')
  archives.push({
    name: pkg.name,
    version: pkg.version,
    file: filename,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    exports: pkg.exports,
  })
}
if (archives.length !== 4) throw new Error('Se requieren cuatro tarballs')
const consumer = join(stage, 'consumer')
await mkdir(consumer)
await writeFile(
  join(consumer, 'pnpm-workspace.yaml'),
  `packages: []\nlinkWorkspacePackages: false\noverrides:\n${archives.map((archive) => `  '${archive.name}': 'file:../tarballs/${archive.file}'`).join('\n')}\n`,
)
const motionPackage = JSON.parse(await readFile(join(root, 'packages/motion/package.json'), 'utf8'))
await writeFile(
  join(consumer, 'package.json'),
  JSON.stringify(
    {
      name: 'isolated-consumer',
      private: true,
      type: 'module',
      dependencies: {
        ...Object.fromEntries(
          archives.map((archive) => [archive.name, `file:../tarballs/${archive.file}`]),
        ),
        react: motionPackage.devDependencies.react,
        'react-dom': motionPackage.devDependencies['react-dom'],
        motion: motionPackage.devDependencies.motion,
      },
    },
    null,
    2,
  ),
)
// Fresh node_modules. Offline can reuse pnpm's cache without resolving peers from the checkout.
await runPnpm(
  [
    'install',
    '--ignore-scripts',
    ...(process.env.BETTERLIBS_RELEASE_OFFLINE === '1' ? ['--offline'] : []),
  ],
  consumer,
)
await writeFile(
  join(consumer, 'verify.mjs'),
  `import { fileURLToPath } from 'node:url'
import { realpathSync } from 'node:fs'
import { relative } from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Button, Hero, Form, CookieConsent, Command } from '@betterlibs/react'
import { Combobox, DataTable, CodeBlock } from '@betterlibs/react/advanced'
import { Reveal, AnimatedNumber, TextReveal, ScrollProgress } from '@betterlibs/motion'
import { editorial } from '@betterlibs/tokens'
for (const name of ['@betterlibs/react', '@betterlibs/motion', '@betterlibs/tokens', '@betterlibs/icons', 'react', 'react-dom', 'motion']) {
  if (relative(process.cwd(), realpathSync(fileURLToPath(import.meta.resolve(name)))).startsWith('..')) throw new Error('Dependency escaped consumer: ' + name)
}
const html = renderToString(createElement('main', null, createElement(Button, null, 'Guardar'), createElement(Reveal, null, 'Visible'), createElement(AnimatedNumber, { value: 42 }), createElement(TextReveal, { lines: ['Lectura'] }), createElement(ScrollProgress, { label: 'Progreso' }), createElement(CookieConsent, { policyHref: '/cookies', initialBanner: true })))
if (!html.includes('Guardar') || !html.includes('42') || !html.includes('Visible') || !html.includes('Lectura') || !html.includes('Rechazar todas') || !editorial || !Hero || !Form) throw new Error('Invalid SSR')
const commandHtml = renderToString(createElement(Command, { items: [{ id: 'new', label: 'Nueva colección' }], onSelect: () => {} }))
if (!commandHtml.includes('Nueva colección') || !commandHtml.includes('role="combobox"') || !commandHtml.includes('role="listbox"')) throw new Error('Invalid Command export or SSR')
const advancedHtml = renderToString(createElement('main', null,
  createElement(Combobox, { label: 'Proyecto', options: [{ value: 'atlas', label: 'Atlas' }], defaultValue: 'atlas', name: 'project' }),
  createElement(DataTable, { label: 'Colecciones', rows: [{ id: 'atlas', title: 'Atlas' }], rowId: row => row.id, columns: [{ id: 'title', header: 'Nombre', value: row => row.title }] }),
  createElement(CodeBlock, { label: 'Ejemplo', snippets: [{ id: 'ts', label: 'TypeScript', code: 'const atlas = 1' }] })))
if (!advancedHtml.includes('Atlas') || !advancedHtml.includes('<table') || !advancedHtml.includes('const atlas = 1')) throw new Error('Invalid advanced export or SSR')
for (const name of ['@betterlibs/react/advanced', '@betterlibs/react/advanced/styles.css']) {
  if (relative(process.cwd(), realpathSync(fileURLToPath(import.meta.resolve(name)))).startsWith('..')) throw new Error('Advanced export escaped consumer: ' + name)
}
console.log('Fresh isolated consumer: exports, peers and visible SSR verified')
`,
)
const verification = await execute(process.execPath, ['verify.mjs'], {
  cwd: consumer,
  windowsHide: true,
  maxBuffer: 1_000_000,
})
console.log(verification.stdout.trim())
const report = {
  preparedAt: new Date().toISOString(),
  node: process.version,
  stage: relative(root, stage).replaceAll('\\', '/'),
  status: 'candidate-only; publication and stable acceptance pending',
  install:
    process.env.BETTERLIBS_RELEASE_OFFLINE === '1'
      ? 'fresh isolated node_modules, cached registry dependencies'
      : 'fresh isolated node_modules, registry dependency resolution',
  consumerRoot: await realpath(consumer),
  archives,
}
await writeFile(join(stage, 'manifest.json'), `${JSON.stringify(report, null, 2)}\n`)
await mkdir(join(root, 'docs/quality'), { recursive: true })
await writeFile(
  join(root, 'docs/quality/release-candidate.json'),
  `${JSON.stringify({ ...report, consumerRoot: relative(root, consumer).replaceAll('\\', '/') }, null, 2)}\n`,
)
console.log(
  `Candidato preparado: ${relative(root, stage)}. Las versiones y changesets del checkout permanecen intactos.`,
)

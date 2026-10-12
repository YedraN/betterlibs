import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { brotliCompressSync } from 'node:zlib'
import react from '@vitejs/plugin-react'
import { build } from 'vite'

// Real consumer chunks, excluding React/ReactDOM, including every byte of the peer engine.
const rows = []
for (const fixture of ['static', 'basic', 'advanced']) {
  const result = await build({
    configFile: false,
    plugins: [react()],
    logLevel: 'error',
    build: {
      write: false,
      target: 'es2022',
      minify: true,
      rolldownOptions: {
        input: resolve(import.meta.dirname, `../fixtures/${fixture}.tsx`),
        external: [/^react($|\/)/, /^react-dom($|\/)/],
        preserveEntrySignatures: 'strict',
      },
    },
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((item) =>
    'output' in item ? item.output : [],
  )
  const chunks = outputs.filter((item) => item.type === 'chunk')
  const initial = new Set(chunks.filter((chunk) => chunk.isEntry).map((chunk) => chunk.fileName))
  for (const filename of initial) {
    for (const dependency of chunks.find((chunk) => chunk.fileName === filename)?.imports ?? [])
      initial.add(dependency)
  }
  const sizes = chunks.map((chunk) => ({
    file: chunk.fileName,
    initial: initial.has(chunk.fileName),
    bytes: Buffer.byteLength(chunk.code),
    brotli: brotliCompressSync(chunk.code).byteLength,
  }))
  rows.push({
    fixture,
    initialBrotli: sizes
      .filter((chunk) => chunk.initial)
      .reduce((sum, chunk) => sum + chunk.brotli, 0),
    deferredBrotli: sizes
      .filter((chunk) => !chunk.initial)
      .reduce((sum, chunk) => sum + chunk.brotli, 0),
    chunks: sizes,
  })
}
const report = {
  engine: 'motion@14.1.0',
  tool: 'Vite 8 / Rolldown, ES2022, minified; node Brotli default',
  excluded: 'React and ReactDOM, including the JSX runtime',
  css: 'No CSS is imported by these JS fixtures; existing CSS is measured separately by size-limit.',
  rows,
}
await writeFile(
  resolve(import.meta.dirname, '../../../docs/previews/ui-motion/bundle-cost.json'),
  `${JSON.stringify(report, null, 2)}\n`,
)
console.log(
  JSON.stringify(
    rows.map(({ fixture, initialBrotli, deferredBrotli }) => ({
      fixture,
      initialBrotli,
      deferredBrotli,
    })),
    null,
    2,
  ),
)

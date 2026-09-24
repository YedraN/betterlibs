/**
 * Genera los CSS y el JSON de tokens en dist/ y falla si el tema por defecto
 * no cumple los contrastes WCAG AA exigidos.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkContrast, primitiveVars, semanticVars, themeCss } from '../src/css.ts'
import * as primitives from '../src/primitives.ts'
import { dark, light } from '../src/semantic.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
mkdirSync(dist, { recursive: true })

const report = [...checkContrast('light', light), ...checkContrast('dark', dark)]
const failures = report.filter((r) => !r.pass)
if (failures.length > 0) {
  console.error('✖ El tema por defecto no cumple WCAG AA:')
  for (const f of failures)
    console.error(`  [${f.mode}] ${f.usage}: ${f.ratio}:1 (mínimo ${f.min}:1)`)
  process.exit(1)
}

const layerOrder = '@layer bl.tokens, bl.reset, bl.base, bl.components;'
const header = '/* Betterlibs UI — generado automáticamente, no editar. */'
const layer = (name: string, css: string) =>
  `@layer bl.${name} {\n${css
    .trim()
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')}\n}\n`

const tokens = themeCss(
  ':root',
  { ...primitiveVars(), ...semanticVars('light') },
  semanticVars('dark'),
  semanticVars('light'),
)
const reset = readFileSync(join(root, 'src/css/reset.css'), 'utf8')
const base = readFileSync(join(root, 'src/css/base.css'), 'utf8')

const files = {
  'tokens.css': `${header}\n${layerOrder}\n\n${layer('tokens', tokens)}`,
  'reset.css': `${header}\n${layerOrder}\n\n${layer('reset', reset)}`,
  'base.css': `${header}\n${layerOrder}\n\n${layer('base', base)}`,
  'index.css': `${header}\n${layerOrder}\n\n${layer('tokens', tokens)}\n${layer('reset', reset)}\n${layer('base', base)}`,
  'tokens.json': `${JSON.stringify(
    {
      ...primitives,
      semantic: { light, dark },
      contrast: report,
    },
    (_, value) => (typeof value === 'function' ? undefined : value),
    2,
  )}\n`,
}

for (const [name, content] of Object.entries(files)) writeFileSync(join(dist, name), content)

console.log(`✔ Tokens generados en dist/ (${report.length} pares de contraste WCAG AA verificados)`)

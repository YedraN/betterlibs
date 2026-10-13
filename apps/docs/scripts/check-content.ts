import { readdirSync, readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../content/docs')
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)],
  )
}
const files = walk(root).filter((file) => file.endsWith('.mdx'))
const pathFor = (file: string) =>
  `/docs/${relative(root, file)
    .replaceAll('\\', '/')
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)index$/, '')}`.replace(/\/$/, '')
const routes = new Set(files.map(pathFor))
const errors: string[] = []
for (const file of files) {
  const source = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '')
  const matches = [
    ...source.matchAll(/\]\(([^)]+)\)/g),
    ...source.matchAll(/href="(\/docs[^"{]*)"/g),
  ]
  for (const match of matches) {
    const target = match[1]?.trim().replace(/\s+"[^"]*"$/, '')
    if (!target || target.startsWith('#') || /^[a-z]+:/i.test(target)) continue
    const url = new URL(
      target,
      `https://local.test${pathFor(file)}${file.endsWith('/index.mdx') ? '/' : ''}`,
    )
    if (!url.pathname.startsWith('/docs')) continue
    const path = url.pathname.replace(/\/$/, '')
    if (!routes.has(path)) errors.push(`${relative(root, file)} → ${target}`)
  }
}
const generated = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../generated/api.json'), 'utf8'),
)
for (const file of files) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(
    /<(PropsTable|FunctionTable|CssReference)\s+(?:name|module)="([^"]+)"/g,
  )) {
    const section =
      match[1] === 'PropsTable' ? 'props' : match[1] === 'FunctionTable' ? 'functions' : 'css'
    if (!generated[section]?.[match[2] ?? ''])
      errors.push(`${relative(root, file)} → ${section}.${match[2]}`)
  }
}
if (errors.length) throw new Error(`Referencias de documentación inválidas:\n${errors.join('\n')}`)
console.log(`${files.length} páginas: enlaces internos y referencias API/CSS válidos.`)

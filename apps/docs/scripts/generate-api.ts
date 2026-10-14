/**
 * Genera `generated/api.json` con la referencia de la librería para la documentación:
 * - props: las props PROPIAS de cada tipo `*Props` exportado (no las heredadas del HTML), con su
 *   tipo tal como está escrito, descripción y `@default` del JSDoc.
 * - css: por cada CSS Module, sus clases públicas (`bl-{módulo}-{clase}`) y los tokens que usa.
 * - functions: firmas y parámetros de exports públicos de movimiento.
 * - examples.json: código de los mismos archivos que renderiza la galería.
 *
 * Se ejecuta antes de `dev`, `build` y `typecheck` de la documentación.
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

const reactRoot = resolve(import.meta.dirname, '../../../packages/react')
const srcRoot = join(reactRoot, 'src')
const motionRoot = resolve(import.meta.dirname, '../../../packages/motion/src')
const outFile = resolve(import.meta.dirname, '../generated/api.json')

type PropDoc = {
  name: string
  type: string
  /** Tipo resuelto cuando `type` es un alias (`ButtonVariant` → `'primary' | …`). */
  expanded?: string
  required: boolean
  description?: string
  default?: string
  /** Archivo relativo a React/src, o prefijado con motion/ para Motion/src. */
  source: string
}

// ── Props ──────────────────────────────────────────────────────────────────────────────────

const configPath = join(reactRoot, 'tsconfig.json')
const config = ts.readConfigFile(configPath, ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, reactRoot)
const program = ts.createProgram({
  rootNames: [
    join(srcRoot, 'index.ts'),
    join(srcRoot, 'advanced/index.ts'),
    join(motionRoot, 'index.ts'),
  ],
  options: { ...parsed.options, noEmit: true },
})
const checker = program.getTypeChecker()
const indexFile = program.getSourceFile(join(srcRoot, 'index.ts'))
if (!indexFile) throw new Error('No se encuentra packages/react/src/index.ts')
const moduleSymbol = checker.getSymbolAtLocation(indexFile)
if (!moduleSymbol) throw new Error('No se pueden leer las exportaciones de la librería')
const advancedFile = program.getSourceFile(join(srcRoot, 'advanced/index.ts'))
const advancedSymbol = advancedFile && checker.getSymbolAtLocation(advancedFile)
if (!advancedSymbol) throw new Error('No se pueden leer las exportaciones avanzadas')

const normalizePath = (path: string) => path.replaceAll('\\', '/')
const ownSources = [srcRoot, motionRoot].map((root) => `${normalizePath(root)}/`)

function isOwnDeclaration(declaration: ts.Declaration) {
  return ownSources.some((root) =>
    normalizePath(declaration.getSourceFile().fileName).startsWith(root),
  )
}

function typeText(symbol: ts.Symbol, declaration: ts.Declaration): string {
  if (
    (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) &&
    declaration.type
  ) {
    return declaration.type.getText().replace(/\s+/g, ' ')
  }
  return checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, declaration))
}

/** Si el tipo escrito es un alias de una unión de literales, devuelve la unión expandida. */
function expand(text: string, type: ts.Type): string | undefined {
  if (!/^[A-Z]\w*$/.test(text) || !type.isUnion()) return undefined
  const members = type.types
    .map((member) => checker.typeToString(member))
    .filter((member) => member !== 'undefined')
  if (members.length === 0 || members.some((member) => !/^(['"\d]|true|false)/.test(member))) {
    return undefined
  }
  return members.join(' | ')
}

function propsOf(type: ts.Type): PropDoc[] {
  // En uniones (p. ej. `AccordionProps`), todas las props posibles de cualquiera de los miembros;
  // si una prop aparece en varios, prevalece la declarada en la librería.
  const isOwn = (property: ts.Symbol) => Boolean(property.getDeclarations()?.some(isOwnDeclaration))
  const byName = new Map<string, ts.Symbol>()
  const candidates = type.isUnion()
    ? type.types.flatMap((member) => checker.getPropertiesOfType(member))
    : checker.getPropertiesOfType(type)
  for (const property of candidates) {
    const current = byName.get(property.getName())
    if (!current || (!isOwn(current) && isOwn(property))) byName.set(property.getName(), property)
  }
  const properties = [...byName.values()]
  const props: PropDoc[] = []
  for (const property of properties) {
    const declaration = property.getDeclarations()?.find(isOwnDeclaration)
    if (!declaration) continue
    const tags = property.getJsDocTags(checker)
    const defaultTag = tags.find((tag) => tag.name === 'default')
    const text = typeText(property, declaration)
    props.push({
      name: property.getName(),
      type: text,
      expanded: expand(text, checker.getTypeOfSymbolAtLocation(property, declaration)),
      required: (property.flags & ts.SymbolFlags.Optional) === 0,
      description: ts.displayPartsToString(property.getDocumentationComment(checker)) || undefined,
      default: defaultTag?.text ? ts.displayPartsToString(defaultTag.text) : undefined,
      source: normalizePath(declaration.getSourceFile().fileName).startsWith(
        `${normalizePath(motionRoot)}/`,
      )
        ? `motion/${normalizePath(relative(motionRoot, declaration.getSourceFile().fileName))}`
        : normalizePath(relative(srcRoot, declaration.getSourceFile().fileName)),
    })
  }
  return props.sort((a, b) => Number(b.required) - Number(a.required))
}

const props: Record<string, PropDoc[]> = {}
const motionFile = program.getSourceFile(join(motionRoot, 'index.ts'))
const motionSymbol = motionFile && checker.getSymbolAtLocation(motionFile)
if (!motionSymbol) throw new Error('No se pueden leer las exportaciones de motion')
for (const exported of [
  ...checker.getExportsOfModule(moduleSymbol),
  ...checker.getExportsOfModule(advancedSymbol),
  ...checker.getExportsOfModule(motionSymbol),
]) {
  const name = exported.getName()
  if (!/(Props|OwnProps|Options)$/.test(name)) continue
  const symbol =
    exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
  if (!(symbol.flags & ts.SymbolFlags.TypeAlias) && !(symbol.flags & ts.SymbolFlags.Interface)) {
    continue
  }
  const list = propsOf(checker.getDeclaredTypeOfSymbol(symbol))
  if (list.length > 0) props[name] = list
}

const functions: Record<
  string,
  {
    description: string
    signatures: {
      signature: string
      returns: string
      parameters: { name: string; type: string; optional: boolean; properties: PropDoc[] }[]
    }[]
  }
> = {}
for (const exported of checker.getExportsOfModule(motionSymbol)) {
  const symbol =
    exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
  const declaration = symbol.getDeclarations()?.find(isOwnDeclaration)
  if (!declaration || symbol.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) continue
  const signatures = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()
  if (!signatures.length) continue
  functions[exported.getName()] = {
    description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
    signatures: signatures.map((signature) => ({
      signature: checker.signatureToString(signature, declaration, ts.TypeFormatFlags.NoTruncation),
      returns: checker.typeToString(
        checker.getReturnTypeOfSignature(signature),
        declaration,
        ts.TypeFormatFlags.NoTruncation,
      ),
      parameters: signature.getParameters().map((parameter) => {
        const node = parameter.valueDeclaration ?? parameter.getDeclarations()?.[0] ?? declaration
        const type = checker.getTypeOfSymbolAtLocation(parameter, node)
        return {
          name: parameter.getName().startsWith('__') ? 'props' : parameter.getName(),
          type: checker.typeToString(type, node, ts.TypeFormatFlags.NoTruncation),
          optional:
            Boolean(parameter.flags & ts.SymbolFlags.Optional) ||
            (ts.isParameter(node) && Boolean(node.questionToken || node.initializer)),
          properties: propsOf(type),
        }
      }),
    })),
  }
}

// ── CSS ────────────────────────────────────────────────────────────────────────────────────

type CssDoc = { classes: string[]; tokens: string[] }

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const css: Record<string, CssDoc> = {}
for (const file of walk(srcRoot).filter((path) => path.endsWith('.module.css'))) {
  const source = readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@layer[^{;]*/g, '')
  const moduleName = basename(file).replace(/\.module\.css$/, '')
  // Clases: `.nombre` en selectores (se descartan las que están dentro de valores).
  const selectors = source.replace(/\{[^{}]*\}/g, '{}')
  const classes = new Set(
    [...selectors.matchAll(/\.([a-zA-Z][\w-]*)/g)]
      .map((match) => match[1] as string)
      .filter((name) => !/^\d/.test(name)),
  )
  const tokens = new Set([...source.matchAll(/var\((--bl-[\w-]+)/g)].map((m) => m[1] as string))
  css[moduleName] = {
    classes: [...classes].map((name) => `bl-${kebab(moduleName)}-${name}`),
    tokens: [...tokens].sort(),
  }
}

mkdirSync(dirname(outFile), { recursive: true })
const exampleRoot = resolve(import.meta.dirname, '../components/docs/examples')
const examples = Object.fromEntries(
  readdirSync(exampleRoot)
    .filter((name) => name.endsWith('.tsx'))
    .sort()
    .map((name) => [name.replace(/\.tsx$/, ''), readFileSync(join(exampleRoot, name), 'utf8')]),
)
writeFileSync(join(dirname(outFile), 'examples.json'), `${JSON.stringify(examples, null, 2)}\n`)
writeFileSync(outFile, `${JSON.stringify({ props, css, functions }, null, 2)}\n`)
console.log(
  `API de la librería: ${Object.keys(props).length} tipos de props, ${Object.keys(functions).length} funciones, ${Object.keys(css).length} módulos CSS y ${Object.keys(examples).length} ejemplos → ${normalizePath(outFile)}`,
)

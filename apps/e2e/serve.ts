/**
 * Servidor estático mínimo que imita a un hosting de producción: compresión (brotli/gzip),
 * URLs limpias (`/servicios` → `servicios/index.html`), caché de `assets/` y `404.html`.
 *
 *   node serve.ts <carpeta> <puerto>
 */
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { promisify } from 'node:util'
import { brotliCompress, constants, gzip } from 'node:zlib'

const [dir = '.', port = '4173'] = process.argv.slice(2)
const root = resolve(dir)

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
}

const brotliAsync = promisify(brotliCompress)
const gzipAsync = promisify(gzip)

/**
 * Respuestas comprimidas en memoria: se comprime una vez por archivo y versión, como un CDN.
 * Se guarda la promesa para no comprimir dos veces el mismo archivo en peticiones simultáneas,
 * y la compresión es asíncrona para no bloquear el resto de peticiones.
 */
const compressed = new Map<string, Promise<Buffer>>()

function compress(file: string, version: number, body: Buffer, encoding: 'br' | 'gzip') {
  const key = `${encoding}:${version}:${file}`
  let result = compressed.get(key)
  if (!result) {
    result =
      encoding === 'br'
        ? brotliAsync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } })
        : gzipAsync(body, { level: 6 })
    compressed.set(key, result)
  }
  return result
}

async function isFile(path: string) {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

async function resolveFile(pathname: string) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '')
  const base = join(root, clean)
  if (!base.startsWith(root)) return undefined
  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    if (await isFile(candidate)) return candidate
  }
  return undefined
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const file = await resolveFile(url.pathname)
  const target = file ?? join(root, '404.html')
  let body: Buffer
  try {
    body = await readFile(target)
  } catch {
    res.writeHead(404).end('No encontrado')
    return
  }
  const type = types[extname(target)] ?? 'application/octet-stream'
  const headers: Record<string, string> = { 'Content-Type': type, Vary: 'Accept-Encoding' }
  if (url.pathname.startsWith('/assets/')) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable'
  }
  const accept = String(req.headers['accept-encoding'] ?? '')
  if (/text|javascript|json|svg/.test(type)) {
    const encoding = accept.includes('br') ? 'br' : accept.includes('gzip') ? 'gzip' : undefined
    if (encoding) {
      body = await compress(target, (await stat(target)).mtimeMs, body, encoding)
      headers['Content-Encoding'] = encoding
    }
  }
  res.writeHead(file ? 200 : 404, headers).end(body)
}).listen(Number(port), () => {
  console.log(`Sirviendo ${root} en http://localhost:${port}`)
})

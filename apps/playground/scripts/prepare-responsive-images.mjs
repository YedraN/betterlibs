import { readdir, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const folder = new URL('../public/images/', import.meta.url)
const rows = []
for (const file of (await readdir(folder)).filter((name) => name.endsWith('-1200x800.webp'))) {
  const source = new URL(file, folder)
  const target = new URL(file.replace('-1200x800', '-800x533'), folder)
  await sharp(fileURLToPath(source))
    .resize(800, 533)
    .webp({ quality: 70, effort: 6 })
    .toFile(fileURLToPath(target))
  const avif = []
  for (const [width, height] of [
    [640, 427],
    [800, 533],
    [1200, 800],
  ]) {
    const variant = new URL(file.replace('-1200x800.webp', `-${width}x${height}.avif`), folder)
    await sharp(fileURLToPath(source))
      .resize(width, height)
      .avif({ quality: 50, effort: 4 })
      .toFile(fileURLToPath(variant))
    avif.push({
      file: variant.pathname.split('/').at(-1),
      width,
      height,
      bytes: (await stat(variant)).size,
    })
  }
  rows.push({
    source: file,
    sourceBytes: (await stat(source)).size,
    variant: target.pathname.split('/').at(-1),
    variantBytes: (await stat(target)).size,
    avif,
  })
}
await writeFile(
  new URL('../../../docs/quality/responsive-images.json', import.meta.url),
  `${JSON.stringify({ tool: 'sharp 0.35.4; WebP q70/e6 + AVIF q50/e4; responsive 640/800/1200', rows }, null, 2)}\n`,
)
console.log(JSON.stringify(rows, null, 2))

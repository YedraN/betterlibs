import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const record = JSON.parse(await readFile(resolve(root, 'docs/quality/manual-a11y.json'), 'utf8'))
const requiredCases = [
  'landmarks',
  'reading-order',
  'forms-errors',
  'dialog-focus',
  'announcements',
  'navigation',
  'reduced-motion',
  'text-reveal',
  'scroll-progress',
]
const revision = execFileSync('git', ['log', '-1', '--format=%H', '--', 'packages', 'apps'], {
  cwd: root,
  encoding: 'utf8',
  windowsHide: true,
}).trim()
if (record.status !== 'passed' || record.reviewedProductCommit !== revision)
  throw new Error(
    'Falta la revisión manual de lectores de pantalla para la revisión actual del producto. Consulta docs/quality/README.md.',
  )
for (const kind of ['desktop', 'mobile']) {
  const evidence = record[kind]
  if (
    !evidence?.reviewer ||
    !evidence?.reader ||
    !evidence?.version ||
    !evidence?.os ||
    !evidence?.device ||
    !evidence?.date
  )
    throw new Error(`Falta el entorno de revisión ${kind}`)
  for (const name of requiredCases) {
    if (evidence.cases?.[name] !== 'passed')
      throw new Error(`Falta una comprobación manual: ${kind}/${name}`)
  }
}
console.log('Revisión manual de escritorio y móvil registrada para el commit actual del producto.')

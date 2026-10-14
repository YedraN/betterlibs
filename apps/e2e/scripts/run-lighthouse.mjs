import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { createServer } from 'node:net'
import { chromium } from '@playwright/test'

// Own the browser lifecycle: chrome-launcher's profile cleanup can fail with EPERM on Windows.
// Lighthouse still applies its normal mobile simulation and resets storage/cache for each run.
const reservation = createServer()
await new Promise((resolve, reject) => {
  reservation.once('error', reject)
  reservation.listen(0, '127.0.0.1', resolve)
})
const port = reservation.address().port
await new Promise((resolve) => reservation.close(resolve))
const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] })
try {
  await browser.newPage()
  const require = createRequire(import.meta.url)
  const child = spawn(process.execPath, [require.resolve('@lhci/cli/src/cli.js'), 'autorun'], {
    stdio: 'inherit',
    windowsHide: true,
    env: { ...process.env, BETTERLIBS_LIGHTHOUSE_DEBUG_PORT: String(port) },
  })
  process.exitCode = await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code) => resolve(code ?? 1))
  })
} finally {
  await browser.close()
}

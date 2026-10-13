import { chromium } from '@playwright/test'

const origin = process.env.BETTERLIBS_DOCS_TEST_URL ?? 'http://localhost:3001'
const url = `${origin}/docs/guias/interacciones-editoriales`
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ reducedMotion: 'no-preference' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|mismatch/i.test(message.text()))
      errors.push(message.text())
  })
  await page.goto(url)
  const form = page.getByRole('form', { name: 'Nueva colección' })
  await form.getByRole('button', { name: 'Guardar colección' }).click()
  if (
    !(await page
      .locator('.bl-error-summary-root')
      .evaluate((element) => element === document.activeElement))
  )
    throw new Error('El resumen no recibe foco')
  await form.getByRole('textbox', { name: /Nombre de la colección/ }).fill('Atlas')
  await form.getByRole('textbox', { name: /Descripción/ }).fill('Colección editorial')
  await form.getByRole('button', { name: 'Guardar colección' }).click()
  await form.getByText('Colección guardada', { exact: true }).waitFor()
  await page.getByRole('button', { name: 'Abrir panel', exact: true }).click()
  await page.getByRole('textbox', { name: 'Título del borrador' }).fill('Atlas Next')
  await page.keyboard.press('Escape')
  if (
    !(await page
      .getByRole('button', { name: 'Abrir panel', exact: true })
      .evaluate((element) => element === document.activeElement))
  )
    throw new Error('Drawer no restaura foco')
  await page.getByRole('button', { name: 'Invertir orden' }).click()
  await page.getByRole('combobox', { name: 'Movimiento', exact: true }).selectOption('off')
  await page.getByRole('button', { name: 'Cambiar retícula' }).click()
  await page.getByRole('tab', { name: 'Código', exact: true }).click()
  await page.getByRole('textbox', { name: 'Nota de código', exact: true }).waitFor()
  if (
    await page
      .locator('[data-bl-layout]')
      .evaluateAll((items) => items.some((item) => item.style.transform))
  )
    throw new Error('Queda una inversión en off')
  const context = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await context.newPage()
  await staticPage.goto(url)
  if ((await staticPage.locator('[data-bl-layout]').count()) !== 3)
    throw new Error('Faltan piezas en SSR')
  await staticPage.getByRole('textbox', { name: /Nombre de la colección/ }).waitFor()
  await staticPage.getByRole('tabpanel', { name: 'Lectura' }).waitFor()
  await context.close()
  const fallback = await browser.newPage({ reducedMotion: 'no-preference' })
  fallback.on('pageerror', (error) => errors.push(error.message))
  await fallback.addInitScript(() => {
    Element.prototype.animate = undefined
  })
  await fallback.goto(url)
  await fallback.getByRole('button', { name: 'Invertir orden' }).click()
  await fallback.getByRole('tab', { name: 'Diseño', exact: true }).click()
  await fallback.getByRole('tabpanel', { name: 'Diseño' }).waitFor()
  await fallback.close()
  if (errors.length) throw new Error(errors.join('\n'))
  console.log(
    'Next: formularios, Drawer/foco, Tabs, posiciones, SSR y fallback sin WAAPI verificados; sin errores de hidratación.',
  )
} finally {
  await browser.close()
}

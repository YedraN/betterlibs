import { fireEvent, render as mount, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { CodeBlock } from './CodeBlock'
import { Combobox } from './Combobox'
import { CopyButton } from './CopyButton'
import { EmptyState } from './EmptyState'
import { ImageViewer } from './ImageViewer'
import { Slider } from './Slider'
import { Timeline } from './Timeline'

const render = (ui: ReactNode) => mount(<main>{ui}</main>)

describe('Contenido y presentación', () => {
  it('CopyButton copia el texto exacto y comunica un permiso denegado', async () => {
    const user = userEvent.setup()
    render(<CopyButton text="const answer = 42" />)
    await user.click(screen.getByRole('button', { name: 'Copiar' }))
    expect(await navigator.clipboard.readText()).toBe('const answer = 42')
    expect(screen.getByRole('status').textContent).toBe('Copiado.')
    const write = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('Denied'))
    await user.click(screen.getByRole('button', { name: 'Copiar' }))
    expect(screen.getByRole('status').textContent).toContain('Selecciona el texto')
    write.mockRestore()
  })
  it('CodeBlock alterna variantes y conserva grupos independientes en dos bloques', async () => {
    const snippets = [
      { id: 'react', label: 'React', code: '<Button>Guardar</Button>' },
      { id: 'html', label: 'HTML', code: '<button>Guardar</button>' },
    ]
    render(
      <>
        <CodeBlock label="Acción" snippets={snippets} lineNumbers />
        <CodeBlock label="Acción" snippets={snippets} />
      </>,
    )
    const choices = screen.getAllByRole('radio', { name: 'HTML' })
    await userEvent.click(choices[0] as HTMLElement)
    expect(
      screen
        .getAllByRole('radio', { name: 'React' })
        .filter((item) => (item as HTMLInputElement).checked),
    ).toHaveLength(1)
    expect(
      screen
        .getAllByRole('radio', { name: 'HTML' })
        .filter((item) => (item as HTMLInputElement).checked),
    ).toHaveLength(1)
    await expectNoA11yViolations(document.body)
  })
  it('EmptyState muestra el camino de salida y Timeline funciona sin JavaScript', async () => {
    const action = vi.fn()
    render(
      <>
        <EmptyState
          title="Crea tu primera colección"
          description="Guarda referencias para tu próximo proyecto."
          actions={
            <button type="button" onClick={action}>
              Crear colección
            </button>
          }
        />
        <Timeline
          label="Actividad"
          items={[
            {
              id: '1',
              title: 'Publicación',
              status: 'complete',
              date: '2026-10-14',
              details: 'Versión lista para revisar.',
            },
          ]}
        />
      </>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Crear colección' }))
    expect(action).toHaveBeenCalledOnce()
    expect(
      renderToString(
        <Timeline
          label="Actividad"
          items={[{ id: '1', title: 'Publicación', details: 'Detalles' }]}
        />,
      ),
    ).toContain('<details>')
    await expectNoA11yViolations(document.body)
  })
  it('ImageViewer navega, limita el zoom y devuelve el foco a la miniatura correcta', async () => {
    render(
      <ImageViewer
        label="Portadas"
        images={[
          { id: '1', src: '/atlas.svg', alt: 'Atlas' },
          { id: '2', src: '/notes.svg', alt: 'Cuaderno' },
        ]}
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Ampliar Atlas' })
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('button', { name: 'Imagen siguiente' }))
    expect(screen.getByRole('img', { name: 'Cuaderno' })).toBeTruthy()
    for (let index = 0; index < 4; index++)
      await userEvent.click(screen.getByRole('button', { name: 'Ampliar imagen' }))
    expect(screen.getByRole('button', { name: 'Ampliar imagen' }).hasAttribute('disabled')).toBe(
      true,
    )
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
  })
  it('ImageViewer comunica un fallo de carga sin perder los controles', async () => {
    render(
      <ImageViewer label="Portadas" images={[{ id: '1', src: '/missing.svg', alt: 'Atlas' }]} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Ampliar Atlas' }))
    fireEvent.error(screen.getByRole('img', { name: 'Atlas' }))
    expect(screen.getByRole('alert').textContent).toContain('No se pudo cargar')
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeTruthy()
  })
  it('entradas opcionales conservan controles y valores iniciales en SSR', () => {
    const html = renderToString(
      <main>
        <Combobox
          label="Proyecto"
          options={[{ value: 'atlas', label: 'Atlas' }]}
          defaultValue="atlas"
        />
        <Slider label="Tamaño" defaultValue={[24]} />
        <CodeBlock
          label="Código"
          snippets={[{ id: '1', label: 'JS', code: '<script>texto</script>' }]}
        />
      </main>,
    )
    expect(html).toContain('Atlas')
    expect(html).toContain('type="range"')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>texto')
  })
})

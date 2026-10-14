import { fireEvent, render as mount, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { InlineEdit } from './InlineEdit'
import { Kanban } from './Kanban'
import { SplitPane } from './SplitPane'
import { TreeView } from './TreeView'

const render = (ui: ReactNode) => mount(<main>{ui}</main>)

describe('Interacciones y foco', () => {
  it('SplitPane invierte las flechas horizontales en una interfaz RTL', async () => {
    render(<SplitPane label="Editor" first="Texto" second="Vista" />)
    const handle = screen.getByRole('separator')
    handle.style.direction = 'rtl'
    handle.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(handle.getAttribute('aria-valuenow')).toBe('52')
  })
  it('InlineEdit muestra errores de validación inesperados y cancela al desmontarse', async () => {
    const failingValidation = vi.fn(() => {
      throw new Error('Invalid configuration')
    })
    const save = vi.fn((_value: string, _signal: AbortSignal) => new Promise<void>(() => {}))
    const { rerender, unmount } = render(
      <InlineEdit label="Nombre" value="Atlas" onSave={save} validate={failingValidation} />,
    )
    await userEvent.click(screen.getByRole('button'))
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('alert').textContent).toContain('se conserva')
    expect(save).not.toHaveBeenCalled()
    rerender(
      <main>
        <InlineEdit label="Nombre" value="Atlas" onSave={save} />
      </main>,
    )
    await userEvent.keyboard('{Enter}')
    expect(save).toHaveBeenCalledOnce()
    const signal = save.mock.calls[0]?.[1]
    unmount()
    expect(signal?.aborted).toBe(true)
  })
  it('TreeView expande, entra en hijos, vuelve al padre y selecciona por teclado', async () => {
    const select = vi.fn()
    render(
      <TreeView
        label="Archivos"
        nodes={[
          { id: 'root', label: 'Atlas', children: [{ id: 'child', label: 'Portada' }] },
          { id: 'last', label: 'Notas' },
        ]}
        onValueChange={select}
      />,
    )
    screen.getByRole('treeitem', { name: 'Atlas' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('treeitem', { name: 'Atlas' }).getAttribute('aria-expanded')).toBe(
      'true',
    )
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: 'Portada' })),
    )
    await userEvent.keyboard('{Enter}')
    expect(select).toHaveBeenCalledWith('child')
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('treeitem', { name: 'Atlas' })),
    )
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.queryByRole('treeitem', { name: 'Portada' })).toBeNull()
    await expectNoA11yViolations(document.body)
  })
  it('SplitPane permite extremos y cambios de tamaño con teclado', async () => {
    const change = vi.fn()
    render(
      <SplitPane
        label="Editor y vista previa"
        first="Editor"
        second="Vista previa"
        onValueChange={change}
      />,
    )
    const handle = screen.getByRole('separator')
    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(change).toHaveBeenCalledWith(52)
    await userEvent.keyboard('{End}')
    expect(handle.getAttribute('aria-valuenow')).toBe('80')
    await userEvent.keyboard('{Home}')
    expect(handle.getAttribute('aria-valuenow')).toBe('20')
    await expectNoA11yViolations(document.body)
  })
  it('Kanban mueve y reordena con controles sin exigir arrastre', async () => {
    const change = vi.fn()
    render(
      <Kanban
        label="Trabajo"
        columns={[
          { id: 'todo', title: 'Pendiente' },
          { id: 'done', title: 'Completado' },
        ]}
        defaultValue={[
          { id: '1', title: 'Portada', columnId: 'todo' },
          { id: '2', title: 'Galería', columnId: 'todo' },
        ]}
        onValueChange={change}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Bajar Portada' }))
    expect(change.mock.calls.at(-1)?.[0].map((card: { id: string }) => card.id)).toEqual(['2', '1'])
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Mover Portada' }), 'done')
    expect(
      within(screen.getByRole('region', { name: 'Completado' })).getByText('Portada'),
    ).toBeTruthy()
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Mover Portada' })),
    )
    await expectNoA11yViolations(document.body)
  })
  it('InlineEdit conserva el borrador después de un fallo y permite cancelar', async () => {
    const save = vi
      .fn()
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValueOnce(undefined)
    render(<InlineEdit label="Nombre" value="Atlas" onSave={save} />)
    await userEvent.click(screen.getByRole('button', { name: 'Editar nombre: Atlas' }))
    const input = screen.getByRole('textbox', { name: 'Nombre' })
    await userEvent.clear(input)
    await userEvent.type(input, 'Cuaderno')
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('alert').textContent).toContain('se conserva')
    expect((input as HTMLInputElement).value).toBe('Cuaderno')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('button', { name: 'Editar nombre: Atlas' }),
      ),
    )
    expect(save).toHaveBeenCalledOnce()
  })
  it('InlineEdit evita guardar un valor inválido y bloquea envíos concurrentes', async () => {
    const save = vi.fn(() => new Promise<void>(() => {}))
    render(
      <InlineEdit
        label="Nombre"
        value="Atlas"
        onSave={save}
        validate={(value) => (value ? undefined : 'Escribe un nombre.')}
      />,
    )
    await userEvent.click(screen.getByRole('button'))
    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(save).not.toHaveBeenCalled()
    await userEvent.type(screen.getByRole('textbox'), 'Cuaderno')
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(save).toHaveBeenCalledOnce()
  })
})

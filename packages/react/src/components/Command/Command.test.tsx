import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Command, type CommandItem } from './Command'

const items: [CommandItem, CommandItem, CommandItem] = [
  { id: 'new', label: 'Nueva colección', group: 'Colecciones', keywords: ['crear'] },
  { id: 'delete', label: 'Eliminar colección', group: 'Colecciones', disabled: true },
  { id: 'theme', label: 'Cambiar tema', group: 'Preferencias', description: 'Claro u oscuro' },
]

describe('Command', () => {
  it('muestra recientes sin duplicados y permite limpiar una búsqueda y reintentar un error', async () => {
    const retry = vi.fn()
    const { rerender } = render(
      <Command items={items} recentIds={['theme', 'theme']} onSelect={vi.fn()} />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getAllByRole('option')[0]?.getAttribute('aria-label')).toBe('Cambiar tema')
    await userEvent.type(screen.getByRole('combobox'), 'crear')
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
    expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('')
    rerender(
      <Command items={items} onSelect={vi.fn()} error="No se pudo buscar." onRetry={retry} />,
    )
    expect(screen.queryByRole('option')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Volver a intentar' }))
    expect(retry).toHaveBeenCalledOnce()
  })
  it('navega sin salir del campo, omite acciones deshabilitadas y ejecuta con Enter', async () => {
    const select = vi.fn()
    render(<Command items={items} onSelect={select} />)
    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}')
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Cambiar tema' }).id,
    )
    expect(document.activeElement).toBe(input)
    await userEvent.keyboard('{Enter}')
    expect(select).toHaveBeenCalledWith(items[2])
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(select).toHaveBeenLastCalledWith(items[0])
    await userEvent.keyboard('{ArrowUp}{Enter}')
    expect(select).toHaveBeenLastCalledWith(items[2])
  })

  it('filtra tildes, términos y keywords, y comunica búsquedas sin resultados', async () => {
    render(<Command items={items} onSelect={vi.fn()} />)
    await userEvent.type(screen.getByRole('combobox'), 'crear coleccion')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option').textContent).toContain('Nueva colección')
    await userEvent.clear(screen.getByRole('combobox'))
    await userEvent.type(screen.getByRole('combobox'), 'imposible')
    expect(screen.queryByRole('option')).toBeNull()
    expect(screen.getByRole('status').textContent).toContain('Prueba otra búsqueda')
    expect(screen.getByRole('combobox').hasAttribute('aria-activedescendant')).toBe(false)
  })

  it('mantiene la misma secuencia de grupos a la vista y con teclado', async () => {
    const select = vi.fn()
    render(
      <Command
        items={[items[0], items[2], { id: 'open', label: 'Abrir colección', group: 'Colecciones' }]}
        onSelect={select}
      />,
    )
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(select).toHaveBeenCalledWith(expect.objectContaining({ id: 'open' }))
  })

  it('ejecuta por puntero y evita seleccionar opciones deshabilitadas', async () => {
    const select = vi.fn()
    render(<Command items={items} onSelect={select} />)
    await userEvent.click(screen.getByRole('option', { name: 'Eliminar colección' }))
    expect(select).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('option', { name: 'Cambiar tema' }))
    expect(select).toHaveBeenCalledWith(items[2])
    expect(document.activeElement).toBe(screen.getByRole('combobox'))
  })

  it('suspende la ejecución durante carga y recupera una opción vigente al cambiar resultados', async () => {
    const select = vi.fn()
    const { rerender } = render(<Command items={items} onSelect={select} />)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{ArrowDown}')
    rerender(<Command items={items} onSelect={select} loading />)
    await userEvent.keyboard('{Enter}')
    expect(select).not.toHaveBeenCalled()
    expect(screen.getByRole('listbox').getAttribute('aria-busy')).toBe('true')
    expect(screen.queryByRole('option')).toBeNull()
    rerender(<Command items={[items[0]]} onSelect={select} />)
    await userEvent.keyboard('{Enter}')
    expect(select).toHaveBeenCalledWith(items[0])
  })

  it('permite búsqueda controlada y resultados filtrados por el consumidor', async () => {
    const change = vi.fn()
    const { rerender } = render(
      <Command
        items={items}
        onSelect={vi.fn()}
        query="buscar"
        onQueryChange={change}
        filter={false}
      />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(3)
    await userEvent.type(screen.getByRole('combobox'), 'x')
    expect(change).toHaveBeenCalledWith('buscarx')
    rerender(<Command items={items} onSelect={vi.fn()} query="oscuro" />)
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('no ejecuta Enter de composición IME ni envía el formulario contenedor', async () => {
    const select = vi.fn()
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={submit}>
        <Command items={items} onSelect={select} />
      </form>,
    )
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter', isComposing: true })
    expect(select).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.keyboard('{Enter}')
    expect(select).toHaveBeenCalledOnce()
    expect(submit).not.toHaveBeenCalled()
  })

  it('tiene nombres, relaciones ARIA y contenido inicial en SSR', async () => {
    const { container } = render(<Command items={items} onSelect={vi.fn()} />)
    await expectNoA11yViolations(container)
    const html = renderToString(<Command items={items} onSelect={vi.fn()} />)
    expect(html).toContain('Nueva colección')
    expect(html).toContain('role="combobox"')
    expect(html).toContain('role="listbox"')
  })
})

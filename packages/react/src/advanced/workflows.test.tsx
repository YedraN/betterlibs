import { fireEvent, render as mount, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { DataTable } from './DataTable'
import { Dropzone } from './Dropzone'
import { FilterToolbar } from './FilterToolbar'
import { Sidebar } from './Sidebar'
import { Stepper } from './Stepper'

const rows = [
  { id: '1', name: 'Atlas', price: 20 },
  { id: '2', name: 'Cuaderno', price: 5 },
  { id: '3', name: 'Estudio', price: 10 },
]
const render = (ui: ReactNode) => mount(<main>{ui}</main>)
const columns = [
  { id: 'name', header: 'Nombre', value: (row: (typeof rows)[number]) => row.name, sortable: true },
  {
    id: 'price',
    header: 'Precio',
    value: (row: (typeof rows)[number]) => row.price,
    sortable: true,
  },
]

describe('Tabla y filtros', () => {
  it('ordena números, pagina, filtra y selecciona solo la página visible', async () => {
    const select = vi.fn()
    render(
      <DataTable
        label="Proyectos"
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        pageSize={2}
        selectable
        onSelectionChange={select}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Precio/ }))
    expect(screen.getByRole('columnheader', { name: /Precio/ }).getAttribute('aria-sort')).toBe(
      'ascending',
    )
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar esta página' }))
    expect(select).toHaveBeenCalledWith(['2', '3'])
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(screen.getByRole('cell', { name: 'Atlas' })).toBeTruthy()
    await userEvent.type(screen.getByRole('textbox', { name: 'Buscar en proyectos' }), 'ninguno')
    expect(screen.getByRole('cell', { name: /No hay coincidencias/ })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toContain('2 seleccionados')
    await expectNoA11yViolations(document.body)
  })
  it('no ejecuta selección en carga y permite reintentar un error', async () => {
    const retry = vi.fn()
    const { rerender } = render(
      <DataTable
        label="Proyectos"
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        selectable
        loading
      />,
    )
    expect(screen.getByRole('checkbox').hasAttribute('disabled')).toBe(true)
    rerender(
      <DataTable
        label="Proyectos"
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        error="Fallo de conexión"
        onRetry={retry}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Volver a intentar' }))
    expect(retry).toHaveBeenCalledOnce()
  })
  it('restablece filtros sin dejar selecciones invisibles y comunica resultados', async () => {
    const change = vi.fn()
    render(
      <FilterToolbar
        label="Proyectos"
        filters={[
          { id: 'state', label: 'Estado', options: [{ value: 'open', label: 'En curso' }] },
        ]}
        onValueChange={change}
        resultCount={3}
      />,
    )
    await userEvent.type(screen.getByRole('textbox'), 'Atlas')
    await userEvent.selectOptions(screen.getByRole('combobox'), 'open')
    await userEvent.click(screen.getByRole('button', { name: 'Quitar filtro estado' }))
    expect(change).toHaveBeenLastCalledWith({ query: 'Atlas', filters: {} })
    await userEvent.click(screen.getByRole('button', { name: 'Restablecer filtros' }))
    expect(change).toHaveBeenLastCalledWith({ query: '', filters: {} })
  })
})

describe('Pasos y archivos', () => {
  it('Stepper conserva el borrador al volver y detiene avances inválidos', async () => {
    const complete = vi.fn()
    let invalid = true
    render(
      <Stepper
        label="Publicar"
        steps={[
          { id: 'first', title: 'Contenido', content: <input aria-label="Título" /> },
          { id: 'last', title: 'Revisión', content: 'Comprueba el contenido.' },
        ]}
        validate={() => (invalid ? 'Añade un título.' : undefined)}
        onComplete={complete}
      />,
    )
    await userEvent.type(screen.getByRole('textbox'), 'Atlas')
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByRole('alert').textContent).toContain('Añade')
    invalid = false
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('Atlas')
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Completar' }))
    expect(complete).toHaveBeenCalledOnce()
  })
  it('Dropzone rechaza tamaño y formato, y revoca las vistas previas al desmontar', async () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview')
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const change = vi.fn()
    const { unmount } = render(
      <Dropzone label="Imágenes" accept="image/png" maxBytes={10} onFilesChange={change} />,
    )
    const input = screen.getByLabelText('Imágenes', { selector: 'input' })
    fireEvent.change(input, {
      target: {
        files: [
          new File(['abc'], 'atlas.png', { type: 'image/png' }),
          new File(['text'], 'notes.txt', { type: 'text/plain' }),
        ],
      },
    })
    expect(change.mock.calls[0]?.[0]).toHaveLength(1)
    expect(screen.getByRole('alert').textContent).toContain('formato no admitido')
    expect(screen.getByRole('img').getAttribute('src')).toBe('blob:preview')
    unmount()
    expect(revoke).toHaveBeenCalledWith('blob:preview')
    create.mockRestore()
    revoke.mockRestore()
  })
  it('Dropzone cancela la operación y permite iniciar una nueva subida', async () => {
    let signal: AbortSignal | undefined
    const upload = vi.fn((_files: File[], next: AbortSignal) => {
      signal = next
      return new Promise<void>(() => {})
    })
    render(<Dropzone label="Documentos" onUpload={upload} />)
    fireEvent.change(screen.getByLabelText('Documentos', { selector: 'input' }), {
      target: { files: [new File(['abc'], 'notes.txt')] },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Subir archivos' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar subida' }))
    expect(signal?.aborted).toBe(true)
    await userEvent.click(screen.getByRole('button', { name: 'Subir archivos' }))
    expect(upload).toHaveBeenCalledTimes(2)
  })
  it('Sidebar ofrece un menú móvil con foco restaurado', async () => {
    render(
      <Sidebar
        label="Navegación"
        items={[{ id: 'home', label: 'Inicio', href: '#home' }]}
        activeId="home"
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Abrir navegación' })
    await userEvent.click(trigger)
    expect(
      within(screen.getByRole('dialog'))
        .getByRole('link', { name: 'Inicio' })
        .getAttribute('aria-current'),
    ).toBe('page')
    await userEvent.keyboard('{Escape}')
    expect(document.activeElement).toBe(trigger)
  })
})

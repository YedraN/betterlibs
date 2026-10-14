import { fireEvent, render as mount, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Field } from '../components/Field/Field'
import { expectNoA11yViolations } from '../test/axe'
import { Combobox } from './Combobox'
import { DatePicker } from './DatePicker'
import { dateKey, parseDate, shiftMonth } from './dates'
import { MultiSelect } from './MultiSelect'
import { Slider } from './Slider'
import { ToggleGroup } from './ToggleGroup'

const options = [
  { value: 'atlas', label: 'Atlas' },
  { value: 'notes', label: 'Cuaderno', disabled: true },
  { value: 'studio', label: 'Estudio' },
]
const render = (ui: ReactNode) => mount(<main>{ui}</main>)

describe('Selectores avanzados', () => {
  it('Combobox filtra, selecciona, cierra y conserva un único valor de formulario', async () => {
    const change = vi.fn()
    const { container } = render(
      <form>
        <Field label="Proyecto" name="project" required>
          <Combobox label="Proyecto" options={options} onValueChange={change} />
        </Field>
      </form>,
    )
    const trigger = screen.getByRole('combobox', { name: /Proyecto/ })
    await userEvent.click(trigger)
    const input = screen.getByRole('combobox', { name: 'Buscar proyecto' })
    expect(input.getAttribute('name')).toBeNull()
    expect(input.hasAttribute('required')).toBe(false)
    expect(input.id).not.toBe(trigger.id)
    await userEvent.type(input, 'estudio')
    await userEvent.keyboard('{Enter}')
    expect(change).toHaveBeenCalledWith('studio')
    expect(document.activeElement).toBe(trigger)
    expect(
      new FormData(container.querySelector('form') as HTMLFormElement).getAll('project'),
    ).toEqual(['studio'])
    expect(container.querySelector('form')?.checkValidity()).toBe(true)
    await expectNoA11yViolations(container)
  })
  it('Combobox requerido falla vacío y su acción deshabilitada no se selecciona', async () => {
    const { container } = render(
      <form>
        <Combobox label="Proyecto" name="project" required options={options} />
      </form>,
    )
    expect(container.querySelector('form')?.checkValidity()).toBe(false)
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'Cuaderno' }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('project')).toBe('')
  })
  it('MultiSelect respeta el límite y permite quitar un valor sin cerrar la búsqueda', async () => {
    const change = vi.fn()
    render(
      <MultiSelect label="Proyectos" options={options} maxSelected={1} onValueChange={change} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Elegir proyectos (0)' }))
    await userEvent.click(screen.getByRole('option', { name: 'Añadir Atlas' }))
    expect(screen.getByRole('option', { name: 'Añadir Estudio' }).hasAttribute('disabled')).toBe(
      true,
    )
    await userEvent.click(screen.getByRole('option', { name: 'Quitar Atlas' }))
    expect(change).toHaveBeenLastCalledWith([])
    expect(screen.getByRole('dialog')).toBeTruthy()
    await userEvent.keyboard('{Escape}')
    await expectNoA11yViolations(document.body)
  })
  it('Slider de intervalo comunica sus extremos y nunca permite cruzarlos', () => {
    const change = vi.fn()
    render(
      <Slider
        label="Presupuesto"
        defaultValue={[20, 80]}
        onValueChange={change}
        formatValue={(value) => `${value} €`}
      />,
    )
    const low = screen.getByRole('slider', { name: 'Mínimo' })
    const high = screen.getByRole('slider', { name: 'Máximo' })
    expect(low.getAttribute('max')).toBe('80')
    expect(high.getAttribute('min')).toBe('20')
    fireEvent.change(low, { target: { value: '30' } })
    expect(change).toHaveBeenCalledWith([30, 80])
    expect(high.getAttribute('min')).toBe('30')
  })
  it('ToggleGroup recorre solo opciones habilitadas sin seleccionarlas al explorar', async () => {
    const change = vi.fn()
    render(<ToggleGroup label="Vista" options={options} onValueChange={change} />)
    screen.getByRole('button', { name: 'Atlas' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Estudio' }))
    expect(change).not.toHaveBeenCalled()
    await userEvent.keyboard(' ')
    expect(change).toHaveBeenCalledWith(['studio'])
    expect(screen.getByRole('button', { name: 'Estudio' }).tabIndex).toBe(0)
  })
})

describe('Fechas', () => {
  it('navega a meses parcialmente disponibles y limita el foco a las fechas permitidas', async () => {
    render(
      <DatePicker
        label="Entrega"
        defaultValue={{ start: '2026-10-01' }}
        min="2026-09-20"
        max="2026-11-15"
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Abrir calendario/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Mes anterior' }))
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-09-20')
    expect(
      (screen.getByRole('button', { name: 'Mes anterior' }) as HTMLButtonElement).disabled,
    ).toBe(true)
    await userEvent.keyboard('{PageDown}{PageDown}')
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-15')
    expect(
      (screen.getByRole('button', { name: 'Mes siguiente' }) as HTMLButtonElement).disabled,
    ).toBe(true)
  })
  it('rechaza fechas imposibles y conserva el último día al cambiar de mes', () => {
    expect(parseDate('2026-02-30')).toBeUndefined()
    expect(dateKey(shiftMonth(new Date(2026, 0, 31, 12), 1))).toBe('2026-02-28')
  })
  it('calendario mueve el foco con flechas y selecciona respetando min/max', async () => {
    const change = vi.fn()
    render(
      <DatePicker
        label="Entrega"
        defaultValue={{ start: '2026-10-14' }}
        min="2026-10-10"
        max="2026-10-16"
        onValueChange={change}
      />,
    )
    const trigger = screen.getByRole('button', { name: /Abrir calendario/ })
    await userEvent.click(trigger)
    const grid = screen.getByRole('grid')
    const start = within(grid).getByRole('button', { name: /miércoles, 14/ })
    start.focus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() =>
      expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-15'),
    )
    await userEvent.keyboard('{Enter}')
    expect(change).toHaveBeenCalledWith({ start: '2026-10-15' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
  it('intervalo comunica fechas invertidas y ordena la selección del calendario', async () => {
    const change = vi.fn()
    render(
      <DatePicker
        label="Estancia"
        mode="range"
        defaultValue={{ start: '2026-10-14' }}
        onValueChange={change}
      />,
    )
    fireEvent.change(screen.getByLabelText('Estancia: fin'), { target: { value: '2026-10-10' } })
    expect(screen.getByRole('alert').textContent).toContain('posterior')
    await userEvent.click(screen.getByRole('button', { name: /Abrir calendario/ }))
    await userEvent.click(screen.getByRole('button', { name: /viernes, 16 de octubre/ }))
    expect(change).toHaveBeenLastCalledWith({ start: '2026-10-16' })
    await userEvent.click(screen.getByRole('button', { name: /jueves, 15 de octubre/ }))
    expect(change).toHaveBeenLastCalledWith({ start: '2026-10-15', end: '2026-10-16' })
  })
})

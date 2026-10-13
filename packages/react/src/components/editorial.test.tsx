import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Accordion, AccordionItem } from './Accordion/Accordion'
import { Field } from './Field/Field'
import { Input } from './Input/Input'

describe('estados de la UI editorial', () => {
  it('un error que aparece durante la edición conserva el nodo, valor, foco y descripción', async () => {
    function Example() {
      const [value, setValue] = useState('')
      return (
        <Field
          label="Colección"
          error={value.length > 0 && value.length < 3 ? 'Escribe tres caracteres.' : undefined}
          success={value.length >= 3 ? 'Nombre disponible.' : undefined}
        >
          <Input value={value} onChange={(event) => setValue(event.target.value)} />
        </Field>
      )
    }
    render(<Example />)
    const input = screen.getByRole('textbox', { name: 'Colección' }) as HTMLInputElement
    await userEvent.type(input, 'ab')
    expect(document.activeElement).toBe(input)
    expect(input.value).toBe('ab')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const description = document.getElementById(input.getAttribute('aria-describedby') ?? '')
    expect(description?.textContent).toContain('Escribe tres caracteres.')
    expect(
      input.compareDocumentPosition(description as Node) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await userEvent.type(input, 'c')
    expect(document.activeElement).toBe(input)
    expect(input.getAttribute('aria-invalid')).toBeNull()
    expect(screen.getByText('Nombre disponible.')).toBeTruthy()
  })

  it('un acordeón controlado excluye el contenido cerrado y admite reapertura', () => {
    const { rerender } = render(
      <Accordion value="a">
        <AccordionItem value="a" title="Pregunta">
          <a href="#main">Respuesta enlazada</a>
        </AccordionItem>
      </Accordion>,
    )
    const panel = screen.getByRole('region')
    expect(panel?.hasAttribute('inert')).toBe(false)
    rerender(
      <Accordion value="">
        <AccordionItem value="a" title="Pregunta">
          <a href="#main">Respuesta enlazada</a>
        </AccordionItem>
      </Accordion>,
    )
    // JSDOM desmonta sin animación; en navegador, la salida permanece inerte.
    expect(screen.queryByRole('link')).toBeNull()
    rerender(
      <Accordion value="a">
        <AccordionItem value="a" title="Pregunta">
          <a href="#main">Respuesta enlazada</a>
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getByRole('link').closest('[inert]')).toBeNull()
  })

  it('en modo múltiple, cerrar una pregunta conserva la otra abierta y su callback', async () => {
    const changes: string[][] = []
    const { container } = render(
      <Accordion
        type="multiple"
        defaultValue={['a', 'b']}
        onValueChange={(value) => changes.push(value)}
      >
        <AccordionItem value="a" title="Primera">
          <a href="#main">Enlace A</a>
        </AccordionItem>
        <AccordionItem value="b" title="Segunda">
          <a href="#main">Enlace B</a>
        </AccordionItem>
      </Accordion>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Primera' }))
    expect(changes).toEqual([['b']])
    expect(screen.queryByRole('link', { name: 'Enlace A' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Enlace B' }).closest('[inert]')).toBeNull()
    expect(container.querySelector('[data-state="open"]')).toBeTruthy()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { Alert } from './Alert/Alert'
import { Button } from './Button/Button'
import { Checkbox, CheckboxGroup } from './Checkbox/Checkbox'
import { ErrorSummary } from './ErrorSummary/ErrorSummary'
import { Field } from './Field/Field'
import { Fieldset } from './Fieldset/Fieldset'
import { FileInput, formatFileSize } from './FileInput/FileInput'
import { Form } from './Form/Form'
import { Input } from './Input/Input'
import { Radio, RadioGroup } from './Radio/RadioGroup'
import { Select } from './Select/Select'
import { Switch } from './Switch/Switch'
import { Textarea } from './Textarea/Textarea'

const describedBy = (element: HTMLElement) =>
  (element.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent)

describe('Field', () => {
  it('enlaza etiqueta, ayuda y error con el control', () => {
    render(
      <Field
        label="Email"
        description="Te responderemos aquí."
        error="Introduce un email válido"
        required
      >
        <Input type="email" />
      </Field>,
    )
    const input = screen.getByLabelText(/Email/)
    expect(input.tagName).toBe('INPUT')
    expect(input.hasAttribute('required')).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(describedBy(input)).toEqual([
      'Te responderemos aquí.',
      'Error: Introduce un email válido',
    ])
  })

  it('marca obligatorios con asterisco oculto y opcionales con texto', () => {
    const { container } = render(
      <>
        <Field label="Nombre" required>
          <Input />
        </Field>
        <Field label="Empresa" indicator="optional">
          <Input />
        </Field>
      </>,
    )
    const asterisk = container.querySelector('[data-required]')
    expect(asterisk?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByLabelText('Empresa (opcional)')).toBeTruthy()
  })

  it('muestra éxito solo si no hay error y respeta disabled y readOnly', () => {
    render(
      <>
        <Field label="Código" success="Código aplicado" readOnly>
          <Input defaultValue="HOLA" />
        </Field>
        <Field label="Bloqueado" disabled>
          <Input />
        </Field>
      </>,
    )
    const code = screen.getByLabelText('Código')
    expect(describedBy(code)).toEqual(['Código aplicado'])
    expect(code.hasAttribute('readonly')).toBe(true)
    expect(screen.getByLabelText('Bloqueado').hasAttribute('disabled')).toBe(true)
  })
})

describe('Input, Textarea y Select', () => {
  it('Input con contraseña permite mostrarla', async () => {
    render(
      <Field label="Contraseña">
        <Input type="password" />
      </Field>,
    )
    const input = screen.getByLabelText('Contraseña')
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' })
    expect(input.getAttribute('type')).toBe('password')
    await userEvent.click(toggle)
    expect(input.getAttribute('type')).toBe('text')
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })

  it('Input pasa la ref al <input> y className al marco', () => {
    const ref = { current: null as HTMLInputElement | null }
    const { container } = render(<Input ref={ref} className="mi-campo" aria-label="Campo" />)
    expect(ref.current?.tagName).toBe('INPUT')
    expect(container.firstElementChild?.classList.contains('mi-campo')).toBe(true)
  })

  it('Textarea cuenta caracteres y anuncia el límite', async () => {
    render(
      <Field label="Mensaje">
        <Textarea maxLength={10} showCount />
      </Field>,
    )
    const textarea = screen.getByLabelText('Mensaje')
    expect(screen.getByText('0/10')).toBeTruthy()
    expect(describedBy(textarea)).toContain('Máximo 10 caracteres.')
    await userEvent.type(textarea, 'Hola')
    expect(screen.getByText('4/10')).toBeTruthy()
  })

  it('Select obligatorio con marcador empieza vacío y no deja volver al marcador', () => {
    render(
      <Field label="Tamaño" required>
        <Select
          placeholder="Selecciona una opción"
          options={[
            { value: 'a', label: 'Pequeña' },
            { value: 'b', label: 'Grande' },
          ]}
        />
      </Field>,
    )
    const select = screen.getByLabelText(/Tamaño/) as HTMLSelectElement
    expect(select.value).toBe('')
    expect(
      screen.getByRole('option', { name: 'Selecciona una opción' }).hasAttribute('disabled'),
    ).toBe(true)
    expect(select.validity.valueMissing).toBe(true)
  })
})

describe('Checkbox, RadioGroup y Switch', () => {
  it('Checkbox admite estado mixto y avisa del cambio', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Todos" indeterminate onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Todos' }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    await userEvent.click(screen.getByText('Todos'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('CheckboxGroup es un grupo con nombre y comparte el name', () => {
    render(
      <CheckboxGroup label="Servicios" name="servicios">
        <Checkbox value="web" label="Web" />
        <Checkbox value="seo" label="SEO" />
      </CheckboxGroup>,
    )
    expect(screen.getByRole('group', { name: 'Servicios' })).toBeTruthy()
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox.getAttribute('name')).toBe('servicios')
    }
  })

  it('RadioGroup expone radiogroup y funciona controlado', async () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup label="Canal" value="email" onValueChange={onValueChange} required>
        <Radio value="email" label="Email" />
        <Radio value="telefono" label="Teléfono" />
      </RadioGroup>,
    )
    const group = screen.getByRole('radiogroup', { name: /Canal/ })
    expect(group.getAttribute('aria-required')).toBe('true')
    expect((screen.getByLabelText('Email') as HTMLInputElement).checked).toBe(true)
    await userEvent.click(screen.getByLabelText('Teléfono'))
    expect(onValueChange).toHaveBeenCalledWith('telefono')
  })

  it('Switch es un interruptor accesible', async () => {
    const onCheckedChange = vi.fn()
    render(<Switch label="Cookies analíticas" onCheckedChange={onCheckedChange} />)
    const toggle = screen.getByRole('switch', { name: 'Cookies analíticas' })
    await userEvent.click(toggle)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})

describe('FileInput', () => {
  it('lista los archivos elegidos con su tamaño', async () => {
    const onFilesChange = vi.fn()
    render(
      <Field label="Adjunta tu CV">
        <FileInput onFilesChange={onFilesChange} />
      </Field>,
    )
    const input = screen.getByLabelText('Adjunta tu CV') as HTMLInputElement
    const file = new File(['x'.repeat(2048)], 'cv.pdf', { type: 'application/pdf' })
    await userEvent.upload(input, file)
    expect(onFilesChange).toHaveBeenCalledWith([file])
    expect(screen.getByText('cv.pdf')).toBeTruthy()
    expect(screen.getByText('2 KB')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Quitar cv.pdf' })).toBeTruthy()
  })

  it('formatea tamaños en español', () => {
    expect(formatFileSize(500)).toBe('500 bytes')
    expect(formatFileSize(1536)).toBe('1,5 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
  })
})

function ContactForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <Form
      aria-label="Contacto"
      validate={(data) => ({
        empresa: data.get('empresa') === 'ACME' ? 'Esa empresa ya es cliente' : undefined,
      })}
      onSubmit={(event: FormEvent) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Field label="Nombre" name="nombre" required>
        <Input />
      </Field>
      <Field label="Email" name="email" required>
        <Input type="email" />
      </Field>
      <Field label="Empresa" name="empresa">
        <Input />
      </Field>
      <CheckboxGroup label="Servicios" name="servicios" required>
        <Checkbox value="web" label="Web" />
        <Checkbox value="seo" label="SEO" />
      </CheckboxGroup>
      <Button type="submit">Enviar</Button>
    </Form>
  )
}

describe('Form', () => {
  it('cancela el envío, muestra errores y un resumen enlazado que recibe el foco', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/Email/), 'ana-empresa.com')
    await userEvent.type(screen.getByLabelText('Empresa'), 'ACME')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onSubmit).not.toHaveBeenCalled()
    const summary = document.querySelector('[data-bl-error-summary]') as HTMLElement
    expect(document.activeElement).toBe(summary)
    const links = Array.from(summary.querySelectorAll('a')).map((a) => a.textContent)
    expect(links).toEqual([
      'Nombre: Este campo es obligatorio',
      'Email: Introduce un email válido, como nombre@empresa.com',
      'Empresa: Esa empresa ya es cliente',
      'Servicios: Selecciona al menos una opción',
    ])
    expect(screen.getByLabelText(/Nombre/).getAttribute('aria-invalid')).toBe('true')

    await userEvent.click(screen.getByRole('link', { name: /^Email/ }))
    expect(document.activeElement).toBe(screen.getByLabelText(/Email/))
  })

  it('quita el error al corregir el campo y envía cuando todo es válido', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    const name = screen.getByLabelText(/Nombre/)
    expect(name.getAttribute('aria-invalid')).toBe('true')

    await userEvent.type(name, 'Ana')
    fireEvent.blur(name)
    expect(name.getAttribute('aria-invalid')).toBeNull()

    await userEvent.type(screen.getByLabelText(/Email/), 'ana@empresa.com')
    await userEvent.click(screen.getByLabelText('SEO'))
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(document.querySelector('[data-bl-error-summary]')).toBeNull()
  })

  it('muestra errores del servidor y los oculta al modificar el campo', async () => {
    render(
      <Form errors={{ email: 'Ya existe una cuenta con este email' }}>
        <Field label="Email" name="email">
          <Input type="email" defaultValue="ana@empresa.com" />
        </Field>
      </Form>,
    )
    const input = screen.getByLabelText('Email')
    expect(describedBy(input)).toEqual(['Error: Ya existe una cuenta con este email'])
    await userEvent.type(input, 'a')
    expect(input.getAttribute('aria-invalid')).toBeNull()
  })

  it('explica el asterisco solo si hay campos obligatorios', () => {
    const { rerender } = render(
      <Form>
        <Field label="Nombre" required>
          <Input />
        </Field>
      </Form>,
    )
    expect(screen.getByText(/son obligatorios/)).toBeTruthy()
    rerender(
      <Form>
        <Field label="Nombre">
          <Input />
        </Field>
      </Form>,
    )
    expect(screen.queryByText(/son obligatorios/)).toBeNull()
  })

  it('no tiene problemas de accesibilidad con errores visibles', async () => {
    const { container } = render(<ContactForm onSubmit={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    await expectNoA11yViolations(container)
  })
})

describe('Alert y ErrorSummary', () => {
  it('Alert muestra icono, título y botón de cerrar', async () => {
    const onDismiss = vi.fn()
    render(
      <Alert tone="success" title="Enviado" onDismiss={onDismiss}>
        Gracias
      </Alert>,
    )
    expect(screen.getByText('Enviado')).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('ErrorSummary no se pinta sin errores', () => {
    const { container } = render(<ErrorSummary errors={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('los componentes de formulario pasan axe', async () => {
    const { container } = render(
      <form>
        <Fieldset legend="Datos" description="Todos los datos son privados.">
          <Field label="Web" description="Con https://">
            <Input type="url" prefix="https://" />
          </Field>
          <Field label="Mensaje">
            <Textarea maxLength={200} showCount />
          </Field>
          <Field label="Tamaño">
            <Select placeholder="Elige" options={[{ value: 'a', label: 'A' }]} />
          </Field>
          <Field label="Adjuntos">
            <FileInput multiple />
          </Field>
        </Fieldset>
        <RadioGroup label="Canal" name="canal" variant="card">
          <Radio value="email" label="Email" description="Respuesta en 24 h" />
        </RadioGroup>
        <Checkbox label="Acepto" error="Acepta para continuar" />
        <Switch label="Boletín" description="Un email al mes" />
        <Alert tone="warning" title="Aviso">
          Texto
        </Alert>
      </form>,
    )
    await expectNoA11yViolations(container)
  })
})

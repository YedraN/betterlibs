import { GlobeIcon, MailIcon, SearchIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Fieldset } from '../Fieldset/Fieldset'
import { FileInput } from '../FileInput/FileInput'
import { Grid } from '../Grid/Grid'
import { Input } from '../Input/Input'
import { Select } from '../Select/Select'
import { Stack } from '../Stack/Stack'
import { Textarea } from '../Textarea/Textarea'
import { Field } from './Field'

const meta = {
  title: 'Componentes/Formularios/Field',
  component: Field,
  args: {
    label: 'Email de trabajo',
    description: 'Te enviaremos la propuesta a esta dirección.',
    required: true,
    children: null,
  },
  argTypes: {
    indicator: { control: 'inline-radio', options: ['required', 'optional', 'none'] },
    error: { control: 'text' },
    success: { control: 'text' },
  },
  render: (args) => (
    <div style={{ maxWidth: '28rem' }}>
      <Field {...args}>
        <Input type="email" autoComplete="email" placeholder="nombre@empresa.com" />
      </Field>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '`Field` une etiqueta, ayuda, error y control, y los enlaza con `htmlFor` y `aria-describedby`. La etiqueta siempre visible (no uses el `placeholder` como etiqueta) y el error explica **cómo corregirlo**. El error aparece sobre el control para que se vea aunque el teclado del móvil tape la parte inferior.',
      },
    },
  },
} satisfies Meta<typeof Field>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Estados: Story = {
  render: () => (
    <Grid columns={{ base: 1, md: 2 }} gap="6" style={{ maxWidth: '48rem' }}>
      <Field label="Normal" description="Texto de ayuda.">
        <Input placeholder="Escribe aquí" />
      </Field>
      <Field label="Con error" error="Introduce un email válido, como nombre@empresa.com">
        <Input type="email" defaultValue="nombre@empresa" />
      </Field>
      <Field label="Validado" success="Código de descuento aplicado">
        <Input defaultValue="BIENVENIDA10" />
      </Field>
      <Field label="Solo lectura" readOnly description="Se rellena con tu cuenta.">
        <Input defaultValue="ES-4821" />
      </Field>
      <Field label="Deshabilitado" disabled>
        <Input defaultValue="No editable" />
      </Field>
      <Field label="Opcional" indicator="optional">
        <Input />
      </Field>
    </Grid>
  ),
}

export const Inputs: StoryObj<typeof Input> = {
  name: 'Input',
  render: () => (
    <Stack gap="6" style={{ maxWidth: '28rem' }}>
      <Field label="Sitio web" description="Incluye el dominio completo.">
        <Input type="url" prefix="https://" iconStart={<GlobeIcon />} placeholder="empresa.com" />
      </Field>
      <Field label="Presupuesto aproximado, en euros">
        <Input type="number" inputMode="numeric" suffix="€" min={0} step={500} />
      </Field>
      <Field label="Teléfono" description="Solo para coordinar la reunión.">
        <Input type="tel" autoComplete="tel" prefix="+34" />
      </Field>
      <Field label="Contraseña" description="Al menos 12 caracteres.">
        <Input type="password" autoComplete="new-password" minLength={12} />
      </Field>
      <Field label="Buscar en el blog" hideLabel>
        <Input type="search" iconStart={<SearchIcon />} placeholder="Buscar artículos" />
      </Field>
      <Stack gap="3">
        <Input size="sm" aria-label="Pequeño" placeholder="Pequeño (sm)" />
        <Input size="md" aria-label="Mediano" placeholder="Mediano (md, 44px)" />
        <Input size="lg" aria-label="Grande" iconStart={<MailIcon />} placeholder="Grande (lg)" />
      </Stack>
    </Stack>
  ),
}

function TextareaDemo() {
  const [value, setValue] = useState('')
  return (
    <Field
      label="¿En qué podemos ayudarte?"
      description="Cuéntanos tu proyecto: objetivos, plazos y cualquier detalle útil."
    >
      <Textarea
        rows={5}
        maxLength={500}
        showCount
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Field>
  )
}

export const Textareas: StoryObj<typeof Textarea> = {
  name: 'Textarea',
  render: () => (
    <Stack gap="6" style={{ maxWidth: '32rem' }}>
      <TextareaDemo />
      <Field label="Comentarios" indicator="optional" description="Crece con el contenido.">
        <Textarea autoResize rows={2} />
      </Field>
    </Stack>
  ),
}

export const Selects: StoryObj<typeof Select> = {
  name: 'Select',
  render: () => (
    <Stack gap="6" style={{ maxWidth: '28rem' }}>
      <Field label="Tamaño de la empresa" required>
        <Select
          placeholder="Selecciona una opción"
          options={[
            { value: '1-10', label: '1 a 10 personas' },
            { value: '11-50', label: '11 a 50 personas' },
            { value: '51-250', label: '51 a 250 personas' },
            { value: '250+', label: 'Más de 250 personas' },
          ]}
        />
      </Field>
      <Field label="Oficina más cercana" description="Agrupadas por país.">
        <Select
          defaultValue="mad"
          options={[
            {
              label: 'España',
              options: [
                { value: 'mad', label: 'Madrid' },
                { value: 'bcn', label: 'Barcelona' },
                { value: 'vlc', label: 'Valencia' },
              ],
            },
            {
              label: 'Portugal',
              options: [{ value: 'lis', label: 'Lisboa' }],
            },
          ]}
        />
      </Field>
      <Field label="Idioma" error="Selecciona un idioma">
        <Select placeholder="Selecciona un idioma">
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </Select>
      </Field>
    </Stack>
  ),
}

export const Archivos: StoryObj<typeof FileInput> = {
  name: 'FileInput',
  render: () => (
    <Stack gap="6" style={{ maxWidth: '32rem' }}>
      <Field label="Adjunta tu CV" description="PDF o DOCX, máximo 5 MB.">
        <FileInput accept=".pdf,.docx" />
      </Field>
      <Field label="Documentación del proyecto" indicator="optional">
        <FileInput multiple />
      </Field>
    </Stack>
  ),
}

export const Agrupar: StoryObj<typeof Fieldset> = {
  name: 'Fieldset',
  render: () => (
    <Fieldset
      legend="Datos de facturación"
      legendSize="lg"
      description="Aparecerán en la factura."
      style={{ maxWidth: '36rem' }}
    >
      <Field label="Razón social" required>
        <Input autoComplete="organization" />
      </Field>
      <Grid columns={{ base: 1, sm: 2 }} gap="5">
        <Field label="CIF / NIF" required>
          <Input autoComplete="off" />
        </Field>
        <Field label="Código postal" required>
          <Input autoComplete="postal-code" inputMode="numeric" htmlSize={5} />
        </Field>
      </Grid>
    </Fieldset>
  ),
}

import { SendIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Alert } from '../Alert/Alert'
import { Button } from '../Button/Button'
import { Checkbox, CheckboxGroup } from '../Checkbox/Checkbox'
import { ErrorSummary } from '../ErrorSummary/ErrorSummary'
import { Field } from '../Field/Field'
import { Grid } from '../Grid/Grid'
import { Input } from '../Input/Input'
import { Radio, RadioGroup } from '../Radio/RadioGroup'
import { Select } from '../Select/Select'
import { Textarea } from '../Textarea/Textarea'
import { Form } from './Form'
import type { FormErrors } from './validation'

const meta = {
  title: 'Componentes/Formularios/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component:
          '`Form` valida al enviar (reglas nativas + `validate`), muestra los errores bajo cada etiqueta y un **resumen enlazado** al principio, y mueve el foco al resumen. Los errores se revisan al salir de cada campo para quitarlos en cuanto se corrigen. Prueba a enviar el formulario vacío.',
      },
    },
  },
} satisfies Meta<typeof Form>
export default meta
type Story = StoryObj<typeof meta>

function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  if (sent) {
    return (
      <Alert
        tone="success"
        title="Hemos recibido tu mensaje"
        role="status"
        actions={
          <Button variant="outline" size="sm" onClick={() => setSent(false)}>
            Enviar otro mensaje
          </Button>
        }
      >
        Te responderemos en un plazo de 24 horas laborables.
      </Alert>
    )
  }

  return (
    <Form
      aria-label="Formulario de contacto"
      validate={(data) => ({
        telefono:
          data.get('canal') === 'telefono' && !data.get('telefono')
            ? 'Introduce un teléfono para poder llamarte'
            : undefined,
      })}
      onSubmit={(event) => {
        event.preventDefault()
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          setSent(true)
        }, 1200)
      }}
    >
      <Grid columns={{ base: 1, sm: 2 }} gap="5">
        <Field label="Nombre" name="nombre" required>
          <Input autoComplete="given-name" />
        </Field>
        <Field label="Apellidos" name="apellidos" indicator="optional">
          <Input autoComplete="family-name" />
        </Field>
      </Grid>
      <Field label="Email de trabajo" name="email" description="Te responderemos aquí." required>
        <Input type="email" autoComplete="email" />
      </Field>
      <Field label="Empresa" name="empresa">
        <Input autoComplete="organization" />
      </Field>
      <Field label="Tamaño de la empresa" name="tamano" required>
        <Select
          placeholder="Selecciona una opción"
          options={[
            { value: '1-10', label: '1 a 10 personas' },
            { value: '11-50', label: '11 a 50 personas' },
            { value: '51+', label: 'Más de 50 personas' },
          ]}
        />
      </Field>
      <CheckboxGroup label="¿Qué servicios te interesan?" name="servicios" required>
        <Checkbox value="web" label="Diseño web" />
        <Checkbox value="seo" label="Posicionamiento SEO" />
        <Checkbox value="ads" label="Campañas de pago" />
      </CheckboxGroup>
      <RadioGroup
        label="¿Cómo prefieres que te contactemos?"
        name="canal"
        defaultValue="email"
        orientation="horizontal"
      >
        <Radio value="email" label="Por email" />
        <Radio value="telefono" label="Por teléfono" />
      </RadioGroup>
      <Field label="Teléfono" name="telefono" description="Solo si prefieres que te llamemos.">
        <Input type="tel" autoComplete="tel" />
      </Field>
      <Field label="Mensaje" name="mensaje" required>
        <Textarea minLength={20} maxLength={1000} showCount rows={5} />
      </Field>
      <Checkbox
        name="privacidad"
        required
        label={
          <>
            He leído y acepto la <a href="#privacidad">política de privacidad</a>
          </>
        }
      />
      <div>
        <Button type="submit" loading={loading} loadingLabel="Enviando…" iconEnd={<SendIcon />}>
          Enviar mensaje
        </Button>
      </div>
    </Form>
  )
}

export const FormularioDeContacto: Story = {
  name: 'Formulario de contacto',
  render: () => (
    <div style={{ maxWidth: '40rem' }}>
      <ContactForm />
    </div>
  ),
}

function ServerErrorsDemo() {
  const [errors, setErrors] = useState<FormErrors>()
  return (
    <Form
      style={{ maxWidth: '28rem' }}
      errors={errors}
      onSubmit={(event) => {
        event.preventDefault()
        // Simula una respuesta del servidor con errores.
        setErrors({ email: 'Ya existe una cuenta con este email' })
      }}
    >
      <Field label="Email" name="email" required>
        <Input type="email" defaultValue="ana@empresa.com" />
      </Field>
      <div>
        <Button type="submit">Crear cuenta</Button>
      </div>
    </Form>
  )
}

export const ErroresDelServidor: Story = {
  name: 'Errores del servidor',
  render: () => <ServerErrorsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Los errores que devuelve tu API se pasan en `errors` (por `name`) y se muestran igual que los del navegador. Se ocultan en cuanto se modifica el campo.',
      },
    },
  },
}

export const Resumen: StoryObj<typeof ErrorSummary> = {
  name: 'ErrorSummary suelto',
  render: () => (
    <ErrorSummary
      style={{ maxWidth: '36rem' }}
      errors={[
        { label: 'Email', message: 'Introduce un email válido, como nombre@empresa.com' },
        { label: 'Mensaje', message: 'Escribe al menos 20 caracteres' },
      ]}
    />
  ),
}

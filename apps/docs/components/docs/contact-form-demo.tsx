'use client'

import { SendIcon } from '@betterlibs/icons'
import {
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  Field,
  Form,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Select,
  Textarea,
} from '@betterlibs/react'
import { useState } from 'react'

/**
 * Formulario de contacto completo para la guía. Simula el envío: prueba a enviarlo vacío para
 * ver el resumen de errores.
 */
export function ContactFormDemo() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  if (status === 'sent') {
    return (
      <Alert
        tone="success"
        title="Hemos recibido tu mensaje"
        role="status"
        actions={
          <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
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
        setStatus('sending')
        setTimeout(() => setStatus('sent'), 1200)
      }}
    >
      <Grid columns={{ base: 1, sm: 2 }} gap="5">
        <Field label="Nombre" name="nombre" required>
          <Input autoComplete="given-name" />
        </Field>
        <Field label="Apellidos" name="apellidos">
          <Input autoComplete="family-name" />
        </Field>
      </Grid>
      <Field label="Email de trabajo" name="email" description="Te responderemos aquí." required>
        <Input type="email" autoComplete="email" />
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
        <Button
          type="submit"
          loading={status === 'sending'}
          loadingLabel="Enviando…"
          iconEnd={<SendIcon />}
        >
          Enviar mensaje
        </Button>
      </div>
    </Form>
  )
}

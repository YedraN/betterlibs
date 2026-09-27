import { SendIcon } from '@betterlibs/icons'
import {
  Button,
  Checkbox,
  ConsentGate,
  ContactSection,
  FAQ,
  Field,
  Form,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  toast,
} from '@betterlibs/react'
import { useState } from 'react'
import { contactDetails, faqs, services } from '../site/data'
import { PageHeader } from '../site/PageHeader'
import { usePageTitle } from '../site/SiteLayout'

function ContactForm() {
  const [sending, setSending] = useState(false)
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
        const form = event.currentTarget
        setSending(true)
        // Simulación del envío: en tu web, aquí va la llamada a tu API o una Server Action.
        setTimeout(() => {
          setSending(false)
          form.reset()
          toast.success('Hemos recibido tu mensaje', {
            description: 'Te responderemos en 24 horas laborables.',
          })
        }, 1000)
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
      <Field label="¿Qué necesitas?" name="servicio" required>
        <Select
          placeholder="Selecciona un servicio"
          options={[
            ...services.map((service) => ({ value: service.slug, label: service.title })),
            { value: 'otro', label: 'Otra cosa / no lo sé' },
          ]}
        />
      </Field>
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
        <Textarea rows={5} minLength={20} maxLength={1000} showCount />
      </Field>
      <Checkbox
        name="privacidad"
        required
        label={
          <>
            He leído y acepto la <a href="/aviso-legal#privacidad">política de privacidad</a>
          </>
        }
      />
      <div>
        <Button type="submit" loading={sending} loadingLabel="Enviando…" iconEnd={<SendIcon />}>
          Enviar mensaje
        </Button>
      </div>
    </Form>
  )
}

/** Plantilla 4 · Contacto. */
export function ContactPage() {
  usePageTitle('Contacto')
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Contacto' }]}
        eyebrow="Contacto"
        title="Hablemos de tu empresa"
        description="Cuéntanos qué necesitas. Te respondemos en 24 horas laborables, sin compromiso."
        spacing="sm"
      />
      <ContactSection
        title="Escríbenos o llámanos"
        details={contactDetails}
        aside={
          <ConsentGate
            category="marketing"
            ratio={4 / 3}
            title="Mapa de la oficina"
            message="El mapa lo sirve un proveedor externo que usa cookies. Permítelas para verlo, o consulta la dirección arriba."
          >
            <iframe
              title="Mapa: Paseo de la Castellana 100, Madrid"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-3.6949%2C40.4418%2C-3.6849%2C40.4478&layer=mapnik"
              style={{
                inlineSize: '100%',
                aspectRatio: '4 / 3',
                border: 0,
                borderRadius: 'var(--bl-radius-lg)',
              }}
              loading="lazy"
            />
          </ConsentGate>
        }
      >
        <ContactForm />
      </ContactSection>
      <FAQ tone="subtle" variant="columns" title="Antes de escribirnos" items={faqs} />
    </>
  )
}

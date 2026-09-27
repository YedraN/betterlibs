import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../components/Button/Button'
import { Field } from '../components/Field/Field'
import { Form } from '../components/Form/Form'
import { Input } from '../components/Input/Input'
import { Textarea } from '../components/Textarea/Textarea'
import { contactDetails, faqs, plans } from '../test/sample-data'
import { ContactSection } from './ContactSection/ContactSection'
import { ConsentGate } from './CookieConsent/ConsentGate'
import { CookieConsent } from './CookieConsent/CookieConsent'
import { cookieConsent } from './CookieConsent/store'
import { FAQ } from './FAQ/FAQ'
import { Newsletter } from './Newsletter/Newsletter'
import { Pricing } from './Pricing/Pricing'

const meta = {
  title: 'Bloques/Conversión',
  component: Pricing,
  args: {
    eyebrow: 'Precios',
    title: 'Planes claros, sin letra pequeña',
    description: 'Sin permanencia. Cambia de plan cuando lo necesites.',
    plans,
    billingPeriods: [
      { value: 'mensual', label: 'Mensual' },
      { value: 'anual', label: 'Anual (-20 %)' },
    ],
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Pricing>
export default meta
type Story = StoryObj<typeof meta>

export const Precios: Story = { name: 'Pricing' }

export const PreguntasFrecuentes: StoryObj<typeof FAQ> = {
  name: 'FAQ',
  render: () => (
    <>
      <FAQ title="Preguntas frecuentes" items={faqs} openFirst align="center" />
      <FAQ
        variant="split"
        tone="subtle"
        title="¿Tienes dudas?"
        description="Si no encuentras tu respuesta, escríbenos."
        actions={<Button variant="outline">Contactar</Button>}
        items={faqs}
      />
      <FAQ variant="columns" title="Sobre los planes" items={faqs} />
    </>
  ),
}

export const Contacto: StoryObj<typeof ContactSection> = {
  name: 'ContactSection',
  render: () => (
    <ContactSection
      eyebrow="Contacto"
      title="Hablemos"
      description="Cuéntanos qué necesitas y te respondemos en 24 horas laborables."
      details={contactDetails}
    >
      <Form onSubmit={(event) => event.preventDefault()}>
        <Field label="Nombre" name="nombre" required>
          <Input autoComplete="name" />
        </Field>
        <Field label="Email" name="email" required>
          <Input type="email" autoComplete="email" />
        </Field>
        <Field label="Mensaje" name="mensaje" required>
          <Textarea rows={4} />
        </Field>
        <div>
          <Button type="submit">Enviar mensaje</Button>
        </div>
      </Form>
    </ContactSection>
  ),
}

const subscribe = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

export const Boletin: StoryObj<typeof Newsletter> = {
  name: 'Newsletter',
  render: () => (
    <>
      <Newsletter
        title="Recibe el boletín mensual"
        description="Novedades fiscales y consejos de gestión. Un email al mes."
        onSubscribe={subscribe}
        consentLabel={
          <>
            Acepto la <a href="#privacidad">política de privacidad</a>
          </>
        }
      />
      <Newsletter
        variant="split"
        tone="subtle"
        title="No te pierdas nada"
        description="Te avisamos de los cambios que afectan a tu empresa."
        onSubscribe={() => Promise.reject(new Error('fallo'))}
        privacyNote="Responsable: Norte Consultores S.L. Finalidad: enviarte el boletín. Puedes darte de baja en cualquier momento."
      />
    </>
  ),
}

export const Cookies: StoryObj<typeof CookieConsent> = {
  name: 'CookieConsent',
  render: () => (
    <div style={{ padding: 'var(--bl-space-8)', display: 'grid', gap: 'var(--bl-space-6)' }}>
      <CookieConsent policyHref="#cookies" storageKey="bl-story-cookies" />
      <div style={{ display: 'flex', gap: 'var(--bl-space-3)' }}>
        <Button variant="outline" onClick={cookieConsent.open}>
          Configurar cookies
        </Button>
        <Button variant="ghost" onClick={cookieConsent.reset}>
          Volver a mostrar el aviso
        </Button>
      </div>
      <ConsentGate category="marketing" ratio={16 / 9} style={{ maxWidth: '36rem' }}>
        <div
          style={{
            aspectRatio: '16 / 9',
            maxWidth: '36rem',
            display: 'grid',
            placeItems: 'center',
            background: 'var(--bl-color-bg-muted)',
            borderRadius: 'var(--bl-radius-lg)',
          }}
        >
          Aquí iría el vídeo de YouTube
        </div>
      </ConsentGate>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '«Aceptar» y «Rechazar» con el mismo peso visual, configuración por categorías sin casillas premarcadas y decisión reversible con `cookieConsent.open()`. `ConsentGate` bloquea contenidos de terceros hasta tener permiso.',
      },
    },
  },
}

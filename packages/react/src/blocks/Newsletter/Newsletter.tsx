'use client'

import { type ReactNode, useState } from 'react'
import { Alert } from '../../components/Alert/Alert'
import { Button } from '../../components/Button/Button'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { Field } from '../../components/Field/Field'
import { Form } from '../../components/Form/Form'
import { Input } from '../../components/Input/Input'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './Newsletter.module.css'

export type NewsletterProps = BlockBaseProps & {
  /** Da de alta el email. Si lanza un error, se muestra `errorMessage`. */
  onSubscribe: (email: string) => void | Promise<void>
  /**
   * - `section`: bloque con cabecera y formulario debajo.
   * - `split`: cabecera a un lado y formulario al otro.
   * - `inline`: solo el formulario (para el pie o una barra lateral).
   * @default 'section'
   */
  variant?: 'section' | 'split' | 'inline'
  /** @default 'Email' */
  emailLabel?: string
  /** @default 'nombre@empresa.com' */
  placeholder?: string
  /** @default 'Suscribirme' */
  submitLabel?: string
  /**
   * Casilla de consentimiento obligatoria (RGPD), p. ej. «Acepto la política de privacidad».
   * Sin ella, incluye la información básica en `privacyNote`.
   */
  consentLabel?: ReactNode
  /** Información sobre protección de datos bajo el formulario. */
  privacyNote?: ReactNode
  /** @default '¡Gracias por suscribirte!' */
  successTitle?: ReactNode
  /** @default 'Revisa tu bandeja de entrada para confirmar la suscripción.' */
  successMessage?: ReactNode
  /** @default 'No hemos podido completar la suscripción. Inténtalo de nuevo en unos minutos.' */
  errorMessage?: ReactNode
}

/**
 * Suscripción al boletín con validación, estados de envío, confirmación y error. La confirmación
 * y el error se anuncian a los lectores de pantalla.
 */
export function Newsletter({
  onSubscribe,
  variant = 'section',
  emailLabel = 'Email',
  placeholder = 'nombre@empresa.com',
  submitLabel = 'Suscribirme',
  consentLabel,
  privacyNote,
  successTitle = '¡Gracias por suscribirte!',
  successMessage = 'Revisa tu bandeja de entrada para confirmar la suscripción.',
  errorMessage = 'No hemos podido completar la suscripción. Inténtalo de nuevo en unos minutos.',
  ...block
}: NewsletterProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const form =
    status === 'done' ? (
      <Alert tone="success" title={successTitle} role="status">
        {successMessage}
      </Alert>
    ) : (
      <Form
        className={styles.form}
        errorSummary={false}
        focusOnError="field"
        requiredHint={false}
        onSubmit={async (event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          setStatus('sending')
          try {
            await onSubscribe(String(data.get('email') ?? ''))
            setStatus('done')
          } catch {
            setStatus('error')
          }
        }}
      >
        {status === 'error' && (
          <Alert tone="danger" role="alert">
            {errorMessage}
          </Alert>
        )}
        <div className={styles.row}>
          <Field label={emailLabel} name="email" required indicator="none" className={styles.field}>
            <Input type="email" autoComplete="email" placeholder={placeholder} />
          </Field>
          <Button type="submit" loading={status === 'sending'} className={styles.submit}>
            {submitLabel}
          </Button>
        </div>
        {consentLabel && <Checkbox name="consent" required label={consentLabel} indicator="none" />}
        {privacyNote && <div className={styles.note}>{privacyNote}</div>}
      </Form>
    )

  if (variant === 'inline') return <div className={styles.inline}>{form}</div>

  return (
    <BlockSection
      {...block}
      gap="md"
      blockClassName={styles.section}
      data={{ 'data-variant': variant }}
    >
      <div className={styles.layout} data-variant={variant}>
        {form}
      </div>
    </BlockSection>
  )
}

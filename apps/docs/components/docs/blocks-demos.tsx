'use client'

import {
  Button,
  ButtonGroup,
  ConsentGate,
  CookieConsent,
  cookieConsent,
  Newsletter,
  useCookieConsent,
} from '@betterlibs/react'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Boletín con alta simulada. */
export function NewsletterDemo({ fail = false }: { fail?: boolean }) {
  return (
    <Newsletter
      variant="inline"
      onSubscribe={async () => {
        await wait(800)
        if (fail) throw new Error('Simulado')
      }}
      consentLabel={
        <>
          Acepto la <a href="#privacidad">política de privacidad</a>
        </>
      }
    />
  )
}

function ConsentStatus() {
  const { ready, decided, consent } = useCookieConsent()
  if (!ready) return null
  return (
    <p
      style={{ margin: 0, color: 'var(--bl-color-text-muted)', fontSize: 'var(--bl-font-size-sm)' }}
    >
      {decided
        ? `Decisión guardada: ${Object.entries(consent ?? {})
            .map(([id, value]) => `${id} ${value ? '✓' : '✗'}`)
            .join(' · ')}`
        : 'Aún no has decidido: el aviso está abajo.'}
    </p>
  )
}

/** Aviso de cookies real (con una clave propia de la documentación). */
export function CookieConsentDemo() {
  return (
    <div style={{ display: 'grid', gap: 'var(--bl-space-5)' }}>
      <CookieConsent policyHref="#politica" storageKey="bl-docs-cookie-demo" />
      <ButtonGroup>
        <Button variant="outline" onClick={cookieConsent.open}>
          Configurar cookies
        </Button>
        <Button variant="ghost" onClick={cookieConsent.reset}>
          Volver a mostrar el aviso
        </Button>
      </ButtonGroup>
      <ConsentStatus />
      <ConsentGate category="marketing" ratio={16 / 9} style={{ maxWidth: '32rem' }}>
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            maxWidth: '32rem',
            aspectRatio: '16 / 9',
            borderRadius: 'var(--bl-radius-lg)',
            background: 'var(--bl-color-bg-muted)',
          }}
        >
          Aquí se cargaría el vídeo de YouTube
        </div>
      </ConsentGate>
    </div>
  )
}

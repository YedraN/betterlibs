import { Button, Container, cookieConsent, Heading, Prose, Stack, Text } from '@betterlibs/react'
import { company } from '../site/data'
import { PageHeader } from '../site/PageHeader'
import { usePageTitle } from '../site/SiteLayout'
import styles from './Article.module.css'

const sections = [
  { id: 'identificacion', label: 'Datos identificativos' },
  { id: 'condiciones', label: 'Condiciones de uso' },
  { id: 'privacidad', label: 'Política de privacidad' },
  { id: 'cookies', label: 'Política de cookies' },
  { id: 'accesibilidad', label: 'Accesibilidad' },
]

/** Plantilla 6 · Página legal (aviso legal, privacidad y cookies). */
export function LegalPage() {
  usePageTitle('Aviso legal, privacidad y cookies')
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Aviso legal' }]}
        title="Aviso legal, privacidad y cookies"
        description="Quiénes somos, cómo tratamos tus datos y qué cookies usamos, explicado con claridad."
        spacing="sm"
      />
      <Container size="lg" style={{ paddingBlockEnd: 'var(--bl-section-md)' }}>
        <Text size="sm" tone="muted" style={{ marginBlockEnd: 'var(--bl-space-8)' }}>
          Última actualización: <time dateTime="2026-09-01">1 de septiembre de 2026</time>
        </Text>
        <div className={styles.layout}>
          <nav className={styles.toc} aria-labelledby="legal-toc">
            <p id="legal-toc" className={styles.tocTitle}>
              Contenido
            </p>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <Prose>
            <h2 id="identificacion">Datos identificativos</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
              Información (LSSI), estos son los datos del titular de esta web:
            </p>
            <dl>
              <dt>Titular</dt>
              <dd>{company.legalName}</dd>
              <dt>CIF</dt>
              <dd>{company.cif}</dd>
              <dt>Domicilio</dt>
              <dd>{company.address}</dd>
              <dt>Contacto</dt>
              <dd>
                <a href={`mailto:${company.email}`}>{company.email}</a> ·{' '}
                <a href={company.phoneHref}>{company.phone}</a>
              </dd>
            </dl>

            <h2 id="condiciones">Condiciones de uso</h2>
            <p>
              El acceso a esta web es gratuito e implica la aceptación de estas condiciones. Los
              contenidos tienen carácter informativo y no sustituyen el asesoramiento profesional.
            </p>

            <h2 id="privacidad">Política de privacidad</h2>
            <p>Resumen de cómo tratamos tus datos personales:</p>
            <table>
              <caption className={styles.tocTitle}>
                Información básica sobre protección de datos
              </caption>
              <tbody>
                <tr>
                  <th scope="row">Responsable</th>
                  <td>{company.legalName}</td>
                </tr>
                <tr>
                  <th scope="row">Finalidad</th>
                  <td>Responder a tus consultas y, si lo aceptas, enviarte el boletín.</td>
                </tr>
                <tr>
                  <th scope="row">Legitimación</th>
                  <td>Tu consentimiento.</td>
                </tr>
                <tr>
                  <th scope="row">Destinatarios</th>
                  <td>No cedemos datos a terceros salvo obligación legal.</td>
                </tr>
                <tr>
                  <th scope="row">Derechos</th>
                  <td>
                    Acceder, rectificar y suprimir tus datos, entre otros, escribiendo a{' '}
                    <a href={`mailto:${company.email}`}>{company.email}</a>.
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 id="cookies">Política de cookies</h2>
            <p>
              Usamos cookies propias necesarias para que la web funcione y, con tu permiso, cookies
              de análisis y de terceros (mapas y vídeos). Puedes cambiar tu elección en cualquier
              momento.
            </p>
            <table>
              <thead>
                <tr>
                  <th scope="col">Cookie</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Finalidad</th>
                  <th scope="col">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>bl-cookie-consent</code>
                  </td>
                  <td>Necesaria</td>
                  <td>Guardar tu elección sobre cookies</td>
                  <td>12 meses</td>
                </tr>
                <tr>
                  <td>
                    <code>_analytics</code>
                  </td>
                  <td>Analítica</td>
                  <td>Estadísticas de uso anónimas</td>
                  <td>13 meses</td>
                </tr>
              </tbody>
            </table>
          </Prose>
        </div>
        <Stack gap="3" style={{ marginBlockStart: 'var(--bl-space-8)', maxWidth: '48rem' }}>
          <div>
            <Button variant="outline" onClick={cookieConsent.open}>
              Configurar cookies
            </Button>
          </div>
          <Heading
            id="accesibilidad"
            level={2}
            size="2xl"
            style={{ marginBlockStart: 'var(--bl-space-8)' }}
          >
            Accesibilidad
          </Heading>
          <Text tone="muted">
            Esta web se ha diseñado para cumplir las pautas WCAG 2.2 de nivel AA. Si encuentras
            alguna barrera, escríbenos a <a href={`mailto:${company.email}`}>{company.email}</a> y
            la solucionaremos.
          </Text>
        </Stack>
      </Container>
    </>
  )
}

import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../components/Button/Button'
import { expectNoA11yViolations } from '../test/axe'
import {
  contactDetails,
  faqs,
  features,
  logos,
  plans,
  posts,
  stats,
  steps,
  team,
  testimonials,
} from '../test/sample-data'
import { BlogGrid } from './Blog/BlogGrid'
import { PostCard } from './Blog/PostCard'
import { CaseStudyCard } from './CaseStudyCard/CaseStudyCard'
import { ContactSection } from './ContactSection/ContactSection'
import { ConsentGate } from './CookieConsent/ConsentGate'
import { CookieConsent } from './CookieConsent/CookieConsent'
import { cookieConsent } from './CookieConsent/store'
import { CTA } from './CTA/CTA'
import { FAQ } from './FAQ/FAQ'
import { FeatureGrid } from './FeatureGrid/FeatureGrid'
import { Hero } from './Hero/Hero'
import { LogoCloud } from './LogoCloud/LogoCloud'
import { Newsletter } from './Newsletter/Newsletter'
import { Pricing } from './Pricing/Pricing'
import { Stats } from './Stats/Stats'
import { TeamGrid } from './TeamGrid/TeamGrid'
import { Testimonials } from './Testimonials/Testimonials'
import { Timeline } from './Timeline/Timeline'

describe('Hero y CTA', () => {
  it('Hero usa un h1 que da nombre a la sección', () => {
    render(
      <Hero
        title="Crece con orden"
        description="Consultoría financiera."
        actions={<Button>Solicitar propuesta</Button>}
        media={<img src="/hero.jpg" alt="Equipo" />}
      />,
    )
    const heading = screen.getByRole('heading', { level: 1, name: 'Crece con orden' })
    expect(screen.getByRole('region', { name: 'Crece con orden' })).toBeTruthy()
    expect(heading.id).toBe('bl-crece-con-orden')
    expect(screen.getByRole('img', { name: 'Equipo' })).toBeTruthy()
  })

  it('Hero con fondo fuerza el tema oscuro', () => {
    const { container } = render(
      <Hero
        variant="background"
        title="Titular"
        id="portada"
        media={<img src="/f.jpg" alt="" />}
      />,
    )
    const section = container.querySelector('section')
    expect(section?.getAttribute('data-theme')).toBe('dark')
    expect(screen.getByRole('heading', { level: 1 }).id).toBe('portada-title')
  })

  it('CTA muestra título y acciones', () => {
    render(
      <CTA title="Hablemos" actions={<Button>Solicitar reunión</Button>} note="Sin compromiso" />,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Hablemos' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Solicitar reunión' })).toBeTruthy()
  })
})

describe('Bloques de contenido', () => {
  it('FeatureGrid: tarjetas enlazadas con un solo enlace por tarjeta', () => {
    render(<FeatureGrid title="Servicios" features={features} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(items[0] as HTMLElement).getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Consultoría estratégica' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('Stats lee la etiqueta antes que la cifra', () => {
    render(<Stats stats={stats} />)
    const terms = screen.getAllByRole('term').map((term) => term.textContent)
    expect(terms[0]).toBe('Clientes activos')
    expect(screen.getAllByRole('definition')[0]?.textContent).toBe('500+')
  })

  it('LogoCloud muestra los logos con su nombre', () => {
    render(
      <LogoCloud
        title="Clientes"
        logos={[...logos, { name: 'Acme', src: '/acme.svg', href: 'https://acme.com' }]}
      />,
    )
    expect(screen.getByRole('img', { name: 'Acme' })).toBeTruthy()
    expect(screen.getByText('Norte')).toBeTruthy()
  })

  it('Timeline es una lista ordenada', () => {
    render(<Timeline title="Cómo trabajamos" items={steps} variant="steps" />)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
  })
})

describe('Bloques de confianza', () => {
  it('Testimonials usa figure, blockquote y valoración accesible', () => {
    const { container } = render(<Testimonials title="Opiniones" testimonials={testimonials} />)
    expect(container.querySelectorAll('figure blockquote')).toHaveLength(3)
    expect(screen.getAllByText('Valoración: 5 de 5')).toHaveLength(2)
    expect(screen.getByText('Ana Pérez').closest('figcaption')).toBeTruthy()
  })

  it('Testimonials en carrusel', () => {
    render(<Testimonials testimonials={testimonials} variant="carousel" />)
    expect(screen.getByRole('region', { name: 'Testimonios' })).toBeTruthy()
  })

  it('TeamGrid nombra cada perfil social con la persona', () => {
    render(<TeamGrid title="Equipo" members={team} />)
    expect(screen.getByRole('link', { name: 'Ana Pérez en LinkedIn' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4)
  })

  it('PostCard: título enlazado y fecha en español', () => {
    render(<PostCard {...(posts[0] as (typeof posts)[number])} />)
    const article = screen.getByRole('article')
    expect(within(article).getAllByRole('link')).toHaveLength(1)
    const time = article.querySelector('time')
    expect(time?.getAttribute('datetime')).toBe('2026-09-12')
    expect(time?.textContent).toBe('12 de septiembre de 2026')
  })

  it('BlogGrid destacado muestra todos los artículos', () => {
    render(<BlogGrid title="Blog" posts={posts} variant="featured" />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('CaseStudyCard muestra resultados como lista de definiciones', () => {
    render(
      <CaseStudyCard
        title="Caso"
        href="/caso"
        metrics={[{ value: '-50 %', label: 'tiempo de cierre' }]}
      />,
    )
    expect(screen.getByRole('term').textContent).toBe('tiempo de cierre')
    expect(screen.getByRole('link', { name: 'Caso' }).getAttribute('href')).toBe('/caso')
  })
})

describe('Bloques de conversión', () => {
  it('Pricing cambia el precio con el periodo de facturación', async () => {
    render(
      <Pricing
        title="Precios"
        plans={plans}
        billingPeriods={[
          { value: 'mensual', label: 'Mensual' },
          { value: 'anual', label: 'Anual' },
        ]}
      />,
    )
    const plan = screen.getByRole('article', { name: 'Profesional' })
    expect(within(plan).getByText('129 €')).toBeTruthy()
    await userEvent.click(screen.getByRole('radio', { name: 'Anual' }))
    expect(within(plan).getByText('103 €')).toBeTruthy()
    expect(within(plan).getByText('Más elegido')).toBeTruthy()
    const basic = screen.getByRole('article', { name: 'Básico' })
    expect(within(basic).getAllByText(/No incluido:/)).toHaveLength(2)
  })

  it('FAQ en acordeón con datos estructurados', async () => {
    const { container } = render(<FAQ title="Preguntas" items={faqs} structuredData />)
    const button = screen.getByRole('button', { name: faqs[0]?.question })
    await userEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    )
    expect(data['@type']).toBe('FAQPage')
    expect(data.mainEntity).toHaveLength(3)
  })

  it('FAQ en columnas muestra todas las respuestas', () => {
    render(<FAQ title="Preguntas" items={faqs} variant="columns" />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(screen.getByText(faqs[2]?.answer as string)).toBeTruthy()
  })

  it('ContactSection agrupa los datos en address con enlaces', () => {
    const { container } = render(
      <ContactSection title="Contacto" details={contactDetails}>
        <p>Formulario</p>
      </ContactSection>,
    )
    expect(container.querySelector('address')).toBeTruthy()
    expect(screen.getByRole('link', { name: '910 000 000' }).getAttribute('href')).toBe(
      'tel:+34910000000',
    )
  })

  it('Newsletter valida, envía y confirma', async () => {
    const onSubscribe = vi.fn()
    render(<Newsletter title="Boletín" onSubscribe={onSubscribe} />)
    await userEvent.click(screen.getByRole('button', { name: 'Suscribirme' }))
    expect(onSubscribe).not.toHaveBeenCalled()
    expect(screen.getByText('Introduce tu email')).toBeTruthy()
    await userEvent.type(screen.getByLabelText('Email'), 'ana@empresa.com')
    await userEvent.click(screen.getByRole('button', { name: 'Suscribirme' }))
    expect(onSubscribe).toHaveBeenCalledWith('ana@empresa.com')
    expect(await screen.findByRole('status')).toBeTruthy()
  })

  it('Newsletter muestra el error si falla el alta', async () => {
    render(<Newsletter onSubscribe={() => Promise.reject(new Error('x'))} variant="inline" />)
    await userEvent.type(screen.getByLabelText('Email'), 'ana@empresa.com')
    await userEvent.click(screen.getByRole('button', { name: 'Suscribirme' }))
    expect((await screen.findByRole('alert')).textContent).toContain('No hemos podido')
  })
})

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear()
    act(() => cookieConsent.reset())
  })

  it('rechazar y aceptar tienen el mismo peso y la decisión se guarda', async () => {
    const onChange = vi.fn()
    render(<CookieConsent policyHref="/cookies" onChange={onChange} />)
    const banner = await screen.findByRole('region', { name: 'Aviso de cookies' })
    const reject = within(banner).getByRole('button', { name: 'Rechazar todas' })
    const accept = within(banner).getByRole('button', { name: 'Aceptar todas' })
    expect(reject.getAttribute('data-variant')).toBe(accept.getAttribute('data-variant'))
    expect(within(banner).getByRole('link', { name: 'Política de cookies' })).toBeTruthy()
    await userEvent.click(reject)
    expect(onChange).toHaveBeenCalledWith({
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    })
    expect(screen.queryByRole('region', { name: 'Aviso de cookies' })).toBeNull()
    const stored = JSON.parse(window.localStorage.getItem('bl-cookie-consent') ?? '{}')
    expect(stored.categories.analytics).toBe(false)
  })

  it('la configuración permite elegir por categorías y reabrirse', async () => {
    const onChange = vi.fn()
    render(<CookieConsent policyHref="/cookies" onChange={onChange} />)
    await userEvent.click(await screen.findByRole('button', { name: 'Configurar' }))
    const dialog = screen.getByRole('dialog', { name: 'Configurar cookies' })
    const necessary = within(dialog).getByRole('switch', { name: /Necesarias/ })
    expect((necessary as HTMLInputElement).checked).toBe(true)
    expect(necessary.hasAttribute('disabled')).toBe(true)
    const analytics = within(dialog).getByRole('switch', { name: /Analíticas/ })
    expect((analytics as HTMLInputElement).checked).toBe(false)
    await userEvent.click(analytics)
    await userEvent.click(within(dialog).getByRole('button', { name: 'Guardar mi selección' }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ analytics: true, marketing: false }),
    )
    act(() => cookieConsent.open())
    expect(screen.getByRole('dialog', { name: 'Configurar cookies' })).toBeTruthy()
  })

  it('ConsentGate bloquea el contenido hasta tener permiso', async () => {
    render(
      <ConsentGate category="marketing">
        <p>Vídeo de YouTube</p>
      </ConsentGate>,
    )
    expect(screen.queryByText('Vídeo de YouTube')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Permitir y mostrar' }))
    expect(screen.getByText('Vídeo de YouTube')).toBeTruthy()
  })
})

describe('Accesibilidad de los bloques', () => {
  it('una página de ejemplo pasa axe', async () => {
    const { container } = render(
      <main>
        <Hero title="Crece con orden" actions={<Button>Empezar</Button>} />
        <FeatureGrid title="Servicios" features={features} variant="plain" />
        <Stats title="Cifras" stats={stats} variant="cards" />
        <Testimonials title="Opiniones" testimonials={testimonials} />
        <Pricing title="Precios" plans={plans} />
        <TeamGrid title="Equipo" members={team} variant="compact" />
        <FAQ title="Preguntas" items={faqs} />
        <BlogGrid title="Blog" posts={posts} />
        <ContactSection title="Contacto" details={contactDetails} />
        <CTA title="Hablemos" actions={<Button>Contactar</Button>} />
      </main>,
    )
    await expectNoA11yViolations(container)
  })
})

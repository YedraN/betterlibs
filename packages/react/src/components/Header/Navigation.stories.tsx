import {
  AwardIcon,
  BarChartIcon,
  BriefcaseIcon,
  CalendarIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
} from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnnouncementBar } from '../AnnouncementBar/AnnouncementBar'
import { Button } from '../Button/Button'
import { Container } from '../Container/Container'
import { Footer } from '../Footer/Footer'
import { Heading } from '../Heading/Heading'
import { Link } from '../Link/Link'
import { MobileNav } from '../NavigationMenu/MobileNav'
import type { NavItem } from '../NavigationMenu/types'
import { Section } from '../Section/Section'
import { SocialLinks } from '../SocialLinks/SocialLinks'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Header } from './Header'

const logo = (
  <a href="#inicio" aria-label="Norte Consultores, ir a la portada">
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--bl-color-accent)" />
      <path d="M9 23V9l14 14V9" stroke="var(--bl-color-on-accent)" strokeWidth="3" fill="none" />
    </svg>
    <span>Norte Consultores</span>
  </a>
)

const navigation: NavItem[] = [
  {
    label: 'Servicios',
    groups: [
      {
        label: 'Empresas',
        links: [
          {
            label: 'Consultoría estratégica',
            href: '#consultoria',
            description: 'Plan de crecimiento a 3 años.',
            icon: <BriefcaseIcon />,
          },
          {
            label: 'Auditoría',
            href: '#auditoria',
            description: 'Cuentas, procesos y cumplimiento.',
            icon: <ShieldCheckIcon />,
          },
        ],
      },
      {
        label: 'Personas',
        links: [
          {
            label: 'Asesoría fiscal',
            href: '#fiscal',
            description: 'Renta, patrimonio y herencias.',
            icon: <FileTextIcon />,
          },
          {
            label: 'Formación',
            href: '#formacion',
            description: 'Cursos para equipos financieros.',
            icon: <UsersIcon />,
          },
        ],
      },
    ],
    featured: (
      <Stack gap="2">
        <Text variant="eyebrow">Caso de éxito</Text>
        <Text weight="semibold">Norte Industrial redujo un 50 % su cierre mensual</Text>
        <Link href="#caso" variant="standalone" arrow>
          Leer el caso
        </Link>
      </Stack>
    ),
    overview: { label: 'Ver todos los servicios', href: '#servicios' },
  },
  {
    label: 'Sectores',
    links: [
      { label: 'Industria', href: '#industria', icon: <ZapIcon /> },
      { label: 'Salud', href: '#salud', icon: <AwardIcon /> },
      { label: 'Retail', href: '#retail', icon: <BarChartIcon /> },
    ],
  },
  { label: 'Casos de éxito', href: '#casos' },
  { label: 'Sobre nosotros', href: '#nosotros' },
  { label: 'Blog', href: '#blog' },
]

const social = [
  { network: 'linkedin', href: 'https://www.linkedin.com' },
  { network: 'x', href: 'https://x.com' },
  { network: 'instagram', href: 'https://www.instagram.com' },
  { network: 'youtube', href: 'https://www.youtube.com' },
] as const

const meta = {
  title: 'Componentes/Navegación/Header',
  component: Header,
  args: {
    logo,
    navigation,
    currentHref: '#auditoria',
    actions: <Button size="sm">Contacto</Button>,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cabecera con enlace para saltar al contenido, navegación principal (desplegables y mega menús con Radix NavigationMenu), acciones y menú móvil en un panel lateral. Cambia a menú móvil por debajo de `collapseBelow` (lg por defecto).',
      },
    },
  },
} satisfies Meta<typeof Header>
export default meta
type Story = StoryObj<typeof meta>

function Page({ lines = 3 }: { lines?: number }) {
  return (
    <main id="main">
      <Section>
        <Container>
          <Stack gap="4">
            <Heading level={1}>Auditoría</Heading>
            {Array.from({ length: lines }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: texto de relleno
              <Text key={i} tone="muted">
                Revisamos cuentas, procesos y cumplimiento normativo para que tomes decisiones con
                datos fiables. Informes claros, sin jerga, y un plan de acción priorizado.
              </Text>
            ))}
          </Stack>
        </Container>
      </Section>
    </main>
  )
}

export const Playground: Story = {
  render: (args) => (
    <>
      <Header {...args} />
      <Page />
    </>
  ),
}

export const OcultarAlBajar: Story = {
  name: 'Ocultar al hacer scroll',
  args: { hideOnScroll: true },
  render: (args) => (
    <>
      <Header {...args} />
      <Page lines={40} />
    </>
  ),
}

export const ConAnuncio: Story = {
  name: 'Con AnnouncementBar',
  render: (args) => (
    <>
      <AnnouncementBar
        dismissible
        icon={<CalendarIcon />}
        action={<a href="#evento">Reserva tu plaza</a>}
      >
        Jornada «Cierre fiscal 2026»: 12 de noviembre en Madrid.
      </AnnouncementBar>
      <Header {...args} />
      <Page />
    </>
  ),
}

export const Anuncios: StoryObj<typeof AnnouncementBar> = {
  name: 'AnnouncementBar',
  render: () => (
    <Stack gap="4">
      <AnnouncementBar action={<a href="#informe">Descárgalo gratis</a>}>
        Nuevo informe de tendencias 2026.
      </AnnouncementBar>
      <AnnouncementBar tone="neutral" dismissible>
        Del 1 al 31 de agosto atendemos de 8 a 15 h.
      </AnnouncementBar>
      <AnnouncementBar tone="warning" dismissible>
        El área de clientes no estará disponible el sábado de 2 a 4 h.
      </AnnouncementBar>
      <AnnouncementBar tone="dark">Ahora también en Lisboa.</AnnouncementBar>
    </Stack>
  ),
}

export const MenuMovil: StoryObj<typeof MobileNav> = {
  name: 'MobileNav',
  render: () => (
    <div style={{ maxWidth: '22rem', padding: 'var(--bl-space-6)' }}>
      <MobileNav items={navigation} currentHref="#auditoria" />
    </div>
  ),
}

export const Pie: StoryObj<typeof Footer> = {
  name: 'Footer',
  render: () => (
    <Footer
      logo={logo}
      description="Consultoría financiera para empresas que quieren crecer con orden desde 2004."
      social={[...social]}
      columns={[
        {
          title: 'Servicios',
          links: [
            { label: 'Consultoría', href: '#' },
            { label: 'Auditoría', href: '#' },
            { label: 'Asesoría fiscal', href: '#' },
          ],
        },
        {
          title: 'Empresa',
          links: [
            { label: 'Sobre nosotros', href: '#' },
            { label: 'Equipo', href: '#' },
            { label: 'Empleo', href: '#' },
          ],
        },
        {
          title: 'Recursos',
          links: [
            { label: 'Blog', href: '#' },
            { label: 'Casos de éxito', href: '#' },
            { label: 'Preguntas frecuentes', href: '#' },
          ],
        },
      ]}
      legal={[
        { label: 'Aviso legal', href: '#' },
        { label: 'Privacidad', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'Accesibilidad', href: '#' },
      ]}
      copyright="© 2026 Norte Consultores S.L."
    >
      <Stack gap="2" as="address" style={{ fontStyle: 'normal' }}>
        <Text size="sm" tone="muted">
          <MapPinIcon aria-hidden="true" /> Paseo de la Castellana 100, 28046 Madrid
        </Text>
        <Text size="sm" tone="muted">
          <PhoneIcon aria-hidden="true" /> <a href="tel:+34910000000">910 000 000</a>
        </Text>
        <Text size="sm" tone="muted">
          <MailIcon aria-hidden="true" /> <a href="mailto:hola@norte.es">hola@norte.es</a>
        </Text>
      </Stack>
    </Footer>
  ),
}

export const PieOscuro: StoryObj<typeof Footer> = {
  name: 'Footer oscuro',
  render: () => (
    <Footer
      tone="dark"
      logo={logo}
      social={[...social]}
      legal={[
        { label: 'Aviso legal', href: '#' },
        { label: 'Privacidad', href: '#' },
      ]}
      copyright="© 2026 Norte Consultores S.L."
    />
  ),
}

export const Redes: StoryObj<typeof SocialLinks> = {
  name: 'SocialLinks',
  render: () => <SocialLinks links={[...social, { network: 'github', href: '#' }]} newTab />,
}

import {
  AwardIcon,
  BarChartIcon,
  BriefcaseIcon,
  ClockIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersIcon,
  ZapIcon,
} from '@betterlibs/icons'
import type {
  ContactDetail,
  FaqItem,
  FooterColumn,
  NavItem,
  Post,
  PricingPlan,
  SocialLink,
  StatItem,
  TeamMember,
  Testimonial,
  TimelineItem,
} from '@betterlibs/react'
import type { ReactNode } from 'react'

export const company = {
  name: 'Norte Consultores',
  legalName: 'Norte Consultores S.L.',
  cif: 'B00000000',
  address: 'Paseo de la Castellana 100, 28046 Madrid',
  phone: '910 000 000',
  phoneHref: 'tel:+34910000000',
  email: 'hola@norte.example',
  hours: 'Lunes a viernes, de 9 a 18 h',
}

export const photo = (seed: string, width = 1200, height = 800) =>
  `https://picsum.photos/seed/norte-${seed}/${width}/${height}`

export type Service = {
  slug: string
  icon: ReactNode
  title: string
  summary: string
  points: string[]
}

export const services: Service[] = [
  {
    slug: 'consultoria',
    icon: <BriefcaseIcon />,
    title: 'Consultoría estratégica',
    summary: 'Objetivos realistas y un plan de crecimiento a tres años, revisado cada trimestre.',
    points: ['Diagnóstico de la situación', 'Plan estratégico a 3 años', 'Seguimiento trimestral'],
  },
  {
    slug: 'auditoria',
    icon: <ShieldCheckIcon />,
    title: 'Auditoría y cumplimiento',
    summary: 'Revisamos cuentas y procesos para que decidas con datos fiables.',
    points: ['Auditoría de cuentas', 'Control interno', 'Cumplimiento normativo'],
  },
  {
    slug: 'fiscal',
    icon: <FileTextIcon />,
    title: 'Asesoría fiscal',
    summary: 'Impuestos al día y sin sorpresas, con una planificación pensada para tu empresa.',
    points: ['Impuestos trimestrales y anuales', 'Planificación fiscal', 'Inspecciones'],
  },
  {
    slug: 'analitica',
    icon: <BarChartIcon />,
    title: 'Cuadros de mando',
    summary: 'Los indicadores que importan, actualizados y fáciles de leer para toda la dirección.',
    points: ['Definición de indicadores', 'Conexión con tu ERP', 'Informe mensual'],
  },
]

export const navigation: NavItem[] = [
  {
    label: 'Servicios',
    groups: [
      {
        label: 'Empresas',
        links: services.slice(0, 2).map((service) => ({
          label: service.title,
          href: `/servicios#${service.slug}`,
          description: service.summary,
          icon: service.icon,
        })),
      },
      {
        label: 'Gestión',
        links: services.slice(2).map((service) => ({
          label: service.title,
          href: `/servicios#${service.slug}`,
          description: service.summary,
          icon: service.icon,
        })),
      },
    ],
    overview: { label: 'Ver todos los servicios', href: '/servicios' },
  },
  { label: 'Sobre nosotros', href: '/sobre-nosotros' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
]

export const footerColumns: FooterColumn[] = [
  {
    title: 'Servicios',
    links: services.map((service) => ({
      label: service.title,
      href: `/servicios#${service.slug}`,
    })),
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nosotros', href: '/sobre-nosotros' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
]

export const legalLinks = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Privacidad', href: '/aviso-legal#privacidad' },
  { label: 'Cookies', href: '/aviso-legal#cookies' },
]

export const social: SocialLink[] = [
  { network: 'linkedin', href: 'https://www.linkedin.com' },
  { network: 'x', href: 'https://x.com' },
  { network: 'youtube', href: 'https://www.youtube.com' },
]

export const stats: StatItem[] = [
  { value: '500+', label: 'Clientes activos', description: 'En 12 sectores' },
  { value: '20 años', label: 'De experiencia', description: 'Desde 2006' },
  { value: '98 %', label: 'Renuevan cada año' },
  { value: '24 h', label: 'Tiempo de respuesta' },
]

export const clients = ['Norte Industrial', 'Vela', 'Sanare', 'Delta', 'Kobalt', 'Ramos'].map(
  (name) => ({
    name,
    logo: <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{name}</span>,
  }),
)

export const testimonials: Testimonial[] = [
  {
    quote: 'Redujimos a la mitad el tiempo de cierre mensual en solo tres meses.',
    name: 'Ana Pérez',
    role: 'Directora financiera, Norte Industrial',
    rating: 5,
  },
  {
    quote: 'Un equipo que entiende el negocio, no solo los números. Se nota en cada reunión.',
    name: 'Luis Martín',
    role: 'CEO, Clínicas Sanare',
    rating: 5,
  },
  {
    quote: 'Por fin tenemos un cuadro de mando que la dirección consulta de verdad.',
    name: 'Sara Gil',
    role: 'Directora general, Vela',
    rating: 5,
  },
]

export const team: TeamMember[] = [
  {
    name: 'Marta León',
    role: 'Socia directora',
    photo: photo('marta', 600, 750),
    bio: 'Veinte años ayudando a pymes industriales a crecer con orden.',
    links: [{ network: 'linkedin', href: 'https://www.linkedin.com' }],
  },
  {
    name: 'Jorge Ramos',
    role: 'Director de auditoría',
    photo: photo('jorge', 600, 750),
    bio: 'Auditor de cuentas inscrito en el ROAC.',
    links: [{ network: 'linkedin', href: 'https://www.linkedin.com' }],
  },
  {
    name: 'Elena Soto',
    role: 'Responsable fiscal',
    photo: photo('elena', 600, 750),
    bio: 'Especialista en fiscalidad de grupos empresariales.',
  },
  {
    name: 'David Cruz',
    role: 'Analítica y datos',
    photo: photo('david', 600, 750),
    bio: 'Convierte datos contables en decisiones.',
  },
]

export const history: TimelineItem[] = [
  {
    label: '2006',
    title: 'Fundación en Madrid',
    description: 'Tres socios y un objetivo: asesoría cercana.',
  },
  { label: '2014', title: 'Oficina en Barcelona', description: 'Primer equipo fuera de Madrid.' },
  {
    label: '2020',
    title: 'Área de analítica',
    description: 'Cuadros de mando para todos los clientes.',
  },
  { label: '2026', title: '500 clientes', description: 'En 12 sectores y dos países.' },
]

export const process: TimelineItem[] = [
  {
    icon: <UsersIcon />,
    title: 'Nos conocemos',
    description: 'Una reunión para entender tu empresa y tus objetivos.',
  },
  {
    icon: <TargetIcon />,
    title: 'Propuesta cerrada',
    description: 'Alcance, plazos y precio, por escrito y sin sorpresas.',
  },
  {
    icon: <ZapIcon />,
    title: 'Puesta en marcha',
    description: 'Un equipo dedicado empieza en menos de dos semanas.',
  },
  {
    icon: <AwardIcon />,
    title: 'Resultados',
    description: 'Informes mensuales con avances medibles.',
  },
]

export const plans: PricingPlan[] = [
  {
    name: 'Esencial',
    description: 'Para autónomos y pequeñas empresas.',
    price: { mensual: '49 €', anual: '39 €' },
    period: '/mes',
    note: 'IVA no incluido',
    features: [
      'Contabilidad y fiscalidad',
      'Un gestor asignado',
      { label: 'Cuadro de mando mensual', included: false },
      { label: 'Reunión trimestral', included: false },
    ],
    action: null,
  },
  {
    name: 'Crecimiento',
    description: 'Para pymes que quieren crecer con datos.',
    price: { mensual: '129 €', anual: '103 €' },
    period: '/mes',
    note: 'IVA no incluido',
    features: ['Todo lo de Esencial', 'Cuadro de mando mensual', 'Reunión trimestral'],
    action: null,
    highlighted: true,
    badge: 'Más elegido',
  },
  {
    name: 'Grupo',
    description: 'Para grupos y empresas con varias sedes.',
    price: 'A medida',
    features: ['Todo lo de Crecimiento', 'Consolidación de grupos', 'Soporte prioritario'],
    action: null,
  },
]

export const faqs: FaqItem[] = [
  {
    question: '¿Cuánto tarda en arrancar un proyecto?',
    answer: 'Entre una y dos semanas desde la firma de la propuesta.',
  },
  {
    question: '¿Trabajáis con empresas fuera de España?',
    answer: 'Sí, con filiales en Portugal y en varios países de Latinoamérica.',
  },
  {
    question: '¿Hay permanencia?',
    answer: 'No. Los planes son mensuales y puedes cancelarlos cuando quieras.',
  },
  {
    question: '¿Puedo cambiar de plan?',
    answer: 'Sí, en cualquier momento. El cambio se aplica en la siguiente factura.',
  },
]

export const contactDetails: ContactDetail[] = [
  { icon: <PhoneIcon />, label: 'Teléfono', value: company.phone, href: company.phoneHref },
  { icon: <MailIcon />, label: 'Email', value: company.email, href: `mailto:${company.email}` },
  { icon: <MapPinIcon />, label: 'Oficina', value: company.address },
  { icon: <ClockIcon />, label: 'Horario', value: company.hours },
]

export type Article = Post & {
  slug: string
  body: ReactNode
  /** Apartados del artículo para el índice (ids de sus h2). */
  toc?: { id: string; label: string }[]
}

export const articles: Article[] = [
  {
    slug: 'iva-autonomos-2026',
    title: 'Novedades del IVA para autónomos en 2026',
    href: '/blog/iva-autonomos-2026',
    excerpt:
      'Qué cambia en las declaraciones trimestrales y cómo prepararse para no llevarse sustos.',
    image: { src: photo('iva') },
    date: '2026-09-12',
    category: 'Fiscalidad',
    author: { name: 'Elena Soto', avatar: photo('elena', 96, 96) },
    readingTime: '6 min de lectura',
    toc: [
      { id: 'que-cambia', label: 'Qué cambia' },
      { id: 'como-prepararse', label: 'Cómo prepararse' },
      { id: 'calendario', label: 'Calendario' },
    ],
    body: (
      <>
        <p>
          El nuevo año trae cambios en la forma de declarar el IVA trimestral. Te resumimos lo más
          importante y qué deberías revisar antes del próximo plazo.
        </p>
        <h2 id="que-cambia">Qué cambia</h2>
        <p>
          La principal novedad es la ampliación del régimen de franquicia y un calendario de pagos
          algo distinto. Lo esencial:
        </p>
        <ul>
          <li>Nuevo umbral de facturación para el régimen de franquicia.</li>
          <li>Plazos de presentación unificados para todos los trimestres.</li>
          <li>Más controles sobre las facturas simplificadas.</li>
        </ul>
        <h2 id="como-prepararse">Cómo prepararse</h2>
        <p>
          Revisa tu facturación del último año y comprueba si te afecta el nuevo umbral. Si tienes
          dudas, <a href="/contacto">escríbenos</a> y lo vemos contigo.
        </p>
        <blockquote>
          <p>Un calendario fiscal claro evita la mayoría de recargos.</p>
        </blockquote>
        <h2 id="calendario">Calendario</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Trimestre</th>
              <th scope="col">Plazo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Primero</td>
              <td>1 al 20 de abril</td>
            </tr>
            <tr>
              <td>Segundo</td>
              <td>1 al 20 de julio</td>
            </tr>
            <tr>
              <td>Tercero</td>
              <td>1 al 20 de octubre</td>
            </tr>
            <tr>
              <td>Cuarto</td>
              <td>1 al 30 de enero</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    slug: 'indicadores-pyme',
    title: 'Cinco indicadores que toda pyme debería vigilar',
    href: '/blog/indicadores-pyme',
    excerpt: 'Del margen bruto a la rotación de cobro: qué mirar cada mes y por qué.',
    image: { src: photo('kpi') },
    date: '2026-08-28',
    category: 'Gestión',
    author: { name: 'David Cruz', avatar: photo('david', 96, 96) },
    readingTime: '4 min de lectura',
    body: <p>Contenido de ejemplo del artículo.</p>,
  },
  {
    slug: 'auditoria-sin-sustos',
    title: 'Cómo preparar una auditoría sin sustos',
    href: '/blog/auditoria-sin-sustos',
    excerpt: 'La documentación que conviene tener lista antes de que llegue el equipo auditor.',
    image: { src: photo('audit') },
    date: '2026-07-15',
    category: 'Auditoría',
    author: { name: 'Jorge Ramos', avatar: photo('jorge', 96, 96) },
    readingTime: '5 min de lectura',
    body: <p>Contenido de ejemplo del artículo.</p>,
  },
  {
    slug: 'cierre-mensual',
    title: 'Cierre mensual en cinco días: nuestro método',
    href: '/blog/cierre-mensual',
    excerpt: 'Un calendario sencillo que cualquier equipo financiero puede aplicar.',
    image: { src: photo('close') },
    date: '2026-06-30',
    category: 'Gestión',
    author: { name: 'Marta León', avatar: photo('marta', 96, 96) },
    readingTime: '7 min de lectura',
    body: <p>Contenido de ejemplo del artículo.</p>,
  },
  {
    slug: 'herencias-empresa-familiar',
    title: 'Herencias y empresa familiar: lo que conviene planificar',
    href: '/blog/herencias-empresa-familiar',
    excerpt: 'Cómo evitar que el relevo generacional se convierta en un problema fiscal.',
    image: { src: photo('family') },
    date: '2026-06-02',
    category: 'Fiscalidad',
    author: { name: 'Elena Soto', avatar: photo('elena', 96, 96) },
    readingTime: '8 min de lectura',
    body: <p>Contenido de ejemplo del artículo.</p>,
  },
]

/* Datos de ejemplo para stories y tests (no se incluyen en el paquete publicado). */
import {
  AwardIcon,
  BarChartIcon,
  BriefcaseIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersIcon,
} from '@betterlibs/icons'
import type { Post } from '../blocks/Blog/PostCard'
import type { ContactDetail } from '../blocks/ContactSection/ContactSection'
import type { FaqItem } from '../blocks/FAQ/FAQ'
import type { Feature } from '../blocks/FeatureGrid/FeatureGrid'
import type { LogoItem } from '../blocks/LogoCloud/LogoCloud'
import type { PricingPlan } from '../blocks/Pricing/Pricing'
import type { StatItem } from '../blocks/Stats/Stats'
import type { TeamMember } from '../blocks/TeamGrid/TeamGrid'
import type { Testimonial } from '../blocks/Testimonials/Testimonials'
import type { TimelineItem } from '../blocks/Timeline/Timeline'
import { Button } from '../components/Button/Button'

export const photo = (seed: string, width = 1200, height = 800) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`

export const features: Feature[] = [
  {
    icon: <BriefcaseIcon />,
    title: 'Consultoría estratégica',
    description: 'Definimos contigo objetivos realistas y un plan de crecimiento a tres años.',
    href: '#consultoria',
  },
  {
    icon: <ShieldCheckIcon />,
    title: 'Auditoría y cumplimiento',
    description: 'Revisamos cuentas y procesos para que decidas con datos fiables.',
    href: '#auditoria',
  },
  {
    icon: <BarChartIcon />,
    title: 'Cuadros de mando',
    description: 'Los indicadores que importan, actualizados y fáciles de leer.',
    href: '#analitica',
  },
]

const wordmark = (name: string) => (
  <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{name}</span>
)

export const logos: LogoItem[] = ['Norte', 'Vela', 'Sanare', 'Delta', 'Ramos', 'Kobalt'].map(
  (name) => ({ name, logo: wordmark(name) }),
)

export const stats: StatItem[] = [
  { value: '500+', label: 'Clientes activos', description: 'En 12 sectores' },
  { value: '20 años', label: 'De experiencia', description: 'Desde 2006' },
  { value: '98 %', label: 'Renuevan cada año' },
  { value: '24 h', label: 'Tiempo de respuesta' },
]

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
    quote: 'Las solicitudes de contacto crecieron un 40 % con la nueva estrategia.',
    name: 'Sara Gil',
    role: 'Marketing, Vela',
    rating: 4,
  },
]

export const plans: PricingPlan[] = [
  {
    name: 'Básico',
    description: 'Para autónomos y pequeñas empresas.',
    price: { mensual: '49 €', anual: '39 €' },
    period: '/mes',
    note: { mensual: 'IVA no incluido', anual: 'Facturación anual de 468 €' },
    features: [
      'Contabilidad y fiscalidad',
      'Un gestor asignado',
      { label: 'Cuadro de mando mensual', included: false },
      { label: 'Soporte prioritario', included: false },
    ],
    action: (
      <Button asChild variant="outline">
        <a href="#basico">Empezar con Básico</a>
      </Button>
    ),
  },
  {
    name: 'Profesional',
    description: 'Para pymes en crecimiento.',
    price: { mensual: '129 €', anual: '103 €' },
    period: '/mes',
    note: { mensual: 'IVA no incluido', anual: 'Facturación anual de 1.236 €' },
    features: [
      'Todo lo de Básico',
      'Cuadro de mando mensual',
      'Reunión trimestral de seguimiento',
      { label: 'Soporte prioritario', included: false },
    ],
    action: (
      <Button asChild>
        <a href="#profesional">Empezar con Profesional</a>
      </Button>
    ),
    highlighted: true,
    badge: 'Más elegido',
  },
  {
    name: 'Empresa',
    description: 'Para grupos y empresas con varias sedes.',
    price: 'A medida',
    features: ['Todo lo de Profesional', 'Consolidación de grupos', 'Soporte prioritario'],
    action: (
      <Button asChild variant="outline">
        <a href="#empresa">Hablar con ventas</a>
      </Button>
    ),
  },
]

export const team: TeamMember[] = [
  {
    name: 'Ana Pérez',
    role: 'Socia directora',
    photo: photo('ana', 600, 750),
    bio: 'Veinte años ayudando a pymes industriales a crecer con orden.',
    links: [{ network: 'linkedin', href: '#' }],
  },
  {
    name: 'Luis Martín',
    role: 'Director de auditoría',
    photo: photo('luis', 600, 750),
    links: [{ network: 'linkedin', href: '#' }],
  },
  { name: 'Sara Gil', role: 'Responsable fiscal', photo: photo('sara', 600, 750) },
  { name: 'Jorge Ramos', role: 'Consultor senior' },
]

export const milestones: TimelineItem[] = [
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

export const steps: TimelineItem[] = [
  {
    icon: <UsersIcon />,
    title: 'Nos conocemos',
    description: 'Una reunión para entender tu empresa.',
  },
  { icon: <TargetIcon />, title: 'Propuesta', description: 'Objetivos, plazos y precio cerrado.' },
  {
    icon: <AwardIcon />,
    title: 'Ejecución',
    description: 'Un equipo dedicado y avances mensuales.',
  },
]

export const faqs: FaqItem[] = [
  {
    question: '¿Cuánto tarda en arrancar un proyecto?',
    answer: 'Entre una y dos semanas desde la firma de la propuesta.',
  },
  {
    question: '¿Trabajáis con empresas fuera de España?',
    answer: 'Sí, con filiales en Portugal y Latinoamérica.',
  },
  {
    question: '¿Hay permanencia?',
    answer: 'No. Los planes son mensuales y puedes cancelarlos cuando quieras.',
  },
]

export const contactDetails: ContactDetail[] = [
  { icon: <PhoneIcon />, label: 'Teléfono', value: '910 000 000', href: 'tel:+34910000000' },
  { icon: <MailIcon />, label: 'Email', value: 'hola@norte.es', href: 'mailto:hola@norte.es' },
  { icon: <MapPinIcon />, label: 'Oficina', value: 'Paseo de la Castellana 100, Madrid' },
  { icon: <ClockIcon />, label: 'Horario', value: 'L-V de 9 a 18 h' },
]

export const posts: Post[] = [
  {
    title: 'Novedades del IVA para autónomos en 2026',
    href: '#post-1',
    excerpt: 'Qué cambia en las declaraciones trimestrales y cómo prepararse.',
    image: { src: photo('iva') },
    date: '2026-09-12',
    category: 'Fiscalidad',
    author: { name: 'Sara Gil' },
    readingTime: '6 min de lectura',
  },
  {
    title: 'Cinco indicadores que toda pyme debería vigilar',
    href: '#post-2',
    excerpt: 'Del margen bruto a la rotación de cobro: qué mirar cada mes.',
    image: { src: photo('kpi') },
    date: '2026-08-28',
    category: 'Gestión',
    author: { name: 'Ana Pérez' },
    readingTime: '4 min de lectura',
  },
  {
    title: 'Cómo preparar una auditoría sin sustos',
    href: '#post-3',
    excerpt: 'La documentación que conviene tener lista antes de empezar.',
    image: { src: photo('audit') },
    date: '2026-07-15',
    category: 'Auditoría',
    author: { name: 'Luis Martín' },
    readingTime: '5 min de lectura',
  },
]

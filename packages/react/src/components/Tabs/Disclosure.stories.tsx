import { BarChartIcon, BriefcaseIcon, ShieldCheckIcon } from '@betterlibs/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from '../Accordion/Accordion'
import { Heading } from '../Heading/Heading'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta = {
  title: 'Componentes/Contenido interactivo/Tabs',
  component: Tabs,
  args: { variant: 'line', defaultValue: 'consultoria' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'pill'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Servicios">
        <TabsTrigger value="consultoria" icon={<BriefcaseIcon />}>
          Consultoría
        </TabsTrigger>
        <TabsTrigger value="auditoria" icon={<ShieldCheckIcon />}>
          Auditoría
        </TabsTrigger>
        <TabsTrigger value="analitica" icon={<BarChartIcon />}>
          Analítica
        </TabsTrigger>
      </TabsList>
      <TabsContent value="consultoria">
        <Stack gap="2">
          <Heading level={3} size="md">
            Consultoría estratégica
          </Heading>
          <Text tone="muted">
            Te ayudamos a definir objetivos y un plan realista para cumplirlos.
          </Text>
        </Stack>
      </TabsContent>
      <TabsContent value="auditoria">
        <Text tone="muted">Revisamos procesos y cumplimiento normativo.</Text>
      </TabsContent>
      <TabsContent value="analitica">
        <Text tone="muted">Cuadros de mando con los indicadores que importan.</Text>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        component:
          'Pestañas sobre Radix: flechas para moverse entre pestañas, Tab para entrar en el panel. No escondas en pestañas contenido que se deba leer entero o comparar.',
      },
    },
  },
} satisfies Meta<typeof Tabs>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Pastillas: Story = { args: { variant: 'pill' } }

export const Vertical: Story = { args: { orientation: 'vertical' } }

const faqs = [
  {
    value: 'plazos',
    title: '¿Cuánto tarda un proyecto web?',
    body: 'Entre 4 y 8 semanas, según el número de páginas y funcionalidades.',
  },
  {
    value: 'precio',
    title: '¿Cómo se calcula el presupuesto?',
    body: 'Por fases cerradas: sabrás el coste total antes de empezar.',
  },
  {
    value: 'mantenimiento',
    title: '¿Incluye mantenimiento?',
    body: 'El primer año sí: actualizaciones, copias de seguridad y soporte por email.',
  },
]

export const Acordeon: StoryObj<typeof Accordion> = {
  name: 'Accordion',
  render: () => (
    <Stack gap="12" style={{ maxWidth: '44rem' }}>
      <Accordion defaultValue="plazos">
        {faqs.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value} title={faq.title}>
            <p>{faq.body}</p>
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion type="multiple" variant="bordered">
        {faqs.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value} title={faq.title}>
            <p>{faq.body}</p>
          </AccordionItem>
        ))}
      </Accordion>
      <Accordion variant="separated">
        {faqs.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value} title={faq.title}>
            <p>{faq.body}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Por defecto, una sola sección abierta y se puede cerrar. `headingLevel` ajusta el nivel del encabezado a la jerarquía de la página.',
      },
    },
  },
}

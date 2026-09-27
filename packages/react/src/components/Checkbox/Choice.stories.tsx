import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Radio, RadioGroup } from '../Radio/RadioGroup'
import { Stack } from '../Stack/Stack'
import { Switch } from '../Switch/Switch'
import { Checkbox, CheckboxGroup } from './Checkbox'

const meta = {
  title: 'Componentes/Formularios/Checkbox',
  component: Checkbox,
  args: {
    label: 'Quiero recibir el boletín mensual',
    description: 'Un email al mes con novedades del sector. Puedes darte de baja cuando quieras.',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Casillas, radios e interruptores nativos con estilos propios: funcionan con el teclado, con formularios normales y con lectores de pantalla sin trabajo extra. Toda la etiqueta es clicable.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

function SelectAllDemo() {
  const options = ['Diseño web', 'Posicionamiento SEO', 'Campañas de pago']
  const [selected, setSelected] = useState<string[]>(['Diseño web'])
  const all = selected.length === options.length
  return (
    <Stack gap="3">
      <Checkbox
        label="Todos los servicios"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? options : [])}
      />
      <Stack gap="3" style={{ paddingInlineStart: 'var(--bl-space-8)' }}>
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) =>
              setSelected((current) =>
                checked ? [...current, option] : current.filter((item) => item !== option),
              )
            }
          />
        ))}
      </Stack>
    </Stack>
  )
}

export const Estados: Story = {
  render: () => (
    <Stack gap="5">
      <Checkbox label="Sin marcar" />
      <Checkbox label="Marcada" defaultChecked />
      <Checkbox
        label={
          <>
            He leído y acepto la <a href="#privacidad">política de privacidad</a>
          </>
        }
        required
        error="Acepta la política de privacidad para continuar"
      />
      <Checkbox label="Deshabilitada" disabled />
      <Checkbox label="Deshabilitada y marcada" disabled defaultChecked />
      <SelectAllDemo />
    </Stack>
  ),
}

export const Grupo: StoryObj<typeof CheckboxGroup> = {
  name: 'CheckboxGroup',
  render: () => (
    <Stack gap="10" style={{ maxWidth: '40rem' }}>
      <CheckboxGroup
        label="¿Qué servicios te interesan?"
        description="Marca todos los que quieras."
        name="servicios"
        required
      >
        <Checkbox value="web" label="Diseño web" />
        <Checkbox value="seo" label="Posicionamiento SEO" />
        <Checkbox value="ads" label="Campañas de pago" />
      </CheckboxGroup>
      <CheckboxGroup
        label="Sectores"
        name="sectores"
        orientation="horizontal"
        error="Selecciona al menos un sector"
      >
        <Checkbox value="industria" label="Industria" />
        <Checkbox value="salud" label="Salud" />
        <Checkbox value="retail" label="Retail" />
      </CheckboxGroup>
      <CheckboxGroup label="Módulos adicionales" name="modulos" variant="card">
        <Checkbox
          value="soporte"
          label="Soporte prioritario"
          description="Respuesta en menos de 4 horas laborables."
        />
        <Checkbox
          value="formacion"
          label="Formación del equipo"
          description="Dos sesiones en remoto para tu equipo."
          defaultChecked
        />
      </CheckboxGroup>
    </Stack>
  ),
}

function ControlledRadio() {
  const [plan, setPlan] = useState('profesional')
  return (
    <RadioGroup
      label="Elige un plan"
      name="plan"
      value={plan}
      onValueChange={setPlan}
      variant="card"
      orientation="horizontal"
      description={`Plan seleccionado: ${plan}`}
    >
      <Radio value="basico" label="Básico" description="Web de hasta 5 páginas." />
      <Radio value="profesional" label="Profesional" description="Web + blog + SEO local." />
      <Radio value="empresa" label="Empresa" description="Multidioma e integraciones." />
    </RadioGroup>
  )
}

export const Radios: StoryObj<typeof RadioGroup> = {
  name: 'RadioGroup',
  render: () => (
    <Stack gap="10" style={{ maxWidth: '48rem' }}>
      <RadioGroup
        label="¿Cómo prefieres que te contactemos?"
        name="canal"
        defaultValue="email"
        required
      >
        <Radio value="email" label="Por email" />
        <Radio
          value="telefono"
          label="Por teléfono"
          description="De lunes a viernes, de 9 a 18 h."
        />
        <Radio value="videollamada" label="Por videollamada" />
      </RadioGroup>
      <RadioGroup
        label="¿Tienes ya una web?"
        name="web"
        orientation="horizontal"
        error="Indica si ya tienes una web"
      >
        <Radio value="si" label="Sí" />
        <Radio value="no" label="No" />
      </RadioGroup>
      <ControlledRadio />
    </Stack>
  ),
}

export const Interruptores: StoryObj<typeof Switch> = {
  name: 'Switch',
  render: () => (
    <Stack gap="5" style={{ maxWidth: '32rem' }}>
      <Switch
        label="Cookies analíticas"
        description="Nos ayudan a entender qué contenidos son más útiles."
        labelPosition="start"
      />
      <Switch label="Cookies necesarias" labelPosition="start" defaultChecked disabled />
      <Switch label="Notificaciones por email" defaultChecked />
      <Switch label="Modo compacto" size="sm" />
    </Stack>
  ),
}

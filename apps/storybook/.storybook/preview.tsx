import '@betterlibs/tokens/index.css'
import { createTheme } from '@betterlibs/tokens'
import type { Decorator, Preview } from '@storybook/react-vite'

export const brands: Record<string, string | undefined> = {
  default: undefined,
  rojo: '#e11d48',
  verde: '#0f766e',
  violeta: '#7c3aed',
  amarillo: '#facc15',
}

const withTheme: Decorator = (Story, context) => {
  const { theme = 'light', brand = 'default' } = context.globals
  const root = document.documentElement
  if (theme === 'auto') delete root.dataset.theme
  else root.dataset.theme = theme

  let style = document.getElementById('bl-brand-theme')
  if (!style) {
    style = document.createElement('style')
    style.id = 'bl-brand-theme'
    document.head.append(style)
  }
  const color = brands[brand]
  style.textContent = color ? createTheme({ brand: color }).css : ''

  return (
    <div key={`${theme}-${brand}`}>
      <Story />
    </div>
  )
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Modo de color',
      toolbar: {
        title: 'Tema',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Claro', icon: 'sun' },
          { value: 'dark', title: 'Oscuro', icon: 'moon' },
          { value: 'auto', title: 'Sistema', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Tema de marca generado con createTheme()',
      toolbar: {
        title: 'Marca',
        icon: 'paintbrush',
        items: Object.entries(brands).map(([value, hex]) => ({
          value,
          title: hex ? `${value[0]?.toUpperCase()}${value.slice(1)} ${hex}` : 'Por defecto',
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', brand: 'default' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, matchers: { color: /(background|color|brand)$/i } },
    a11y: { test: 'todo' },
    backgrounds: { disable: true },
    options: {
      storySort: { order: ['Introducción', 'Fundamentos', 'Theming', 'Componentes', 'Bloques'] },
    },
  },
}

export default preview

import type { Meta, StoryObj } from '@storybook/react-vite'
import { CookieConsentDemo } from '../../../docs/components/docs/blocks-demos'
import {
  ReadingDemo,
  RemainingSectionsDemo,
  SectionPatternsDemo,
} from '../../../docs/components/docs/sections-demo'

const meta: Meta = { title: 'Páginas/Secciones editoriales', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj<typeof meta>
export const Conversion: Story = { render: () => <SectionPatternsDemo /> }
export const Lectura: Story = { parameters: { layout: 'padded' }, render: () => <ReadingDemo /> }

import '@betterlibs/react/styles.css'

export const Contenido: Story = {
  globals: { preset: 'editorial' },
  render: () => <RemainingSectionsDemo />,
}
export const Consentimiento: Story = {
  globals: { preset: 'editorial' },
  parameters: { layout: 'padded' },
  render: () => <CookieConsentDemo />,
}

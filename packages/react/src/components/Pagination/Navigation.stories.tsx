import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Breadcrumb } from '../Breadcrumb/Breadcrumb'
import { Stack } from '../Stack/Stack'
import { Pagination } from './Pagination'

const meta = {
  title: 'Componentes/Navegación/Pagination',
  component: Pagination,
  args: { page: 5, totalPages: 12, getHref: (page: number) => `?pagina=${page}` },
  parameters: {
    docs: {
      description: {
        component:
          'Con `getHref` genera enlaces normales (indexables y compartibles); con `onPageChange`, botones. La página actual lleva `aria-current="page"`. En móvil se resume en «Página N de M».',
      },
    },
  },
} satisfies Meta<typeof Pagination>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

function ButtonsDemo() {
  const [page, setPage] = useState(1)
  return <Pagination page={page} totalPages={8} onPageChange={setPage} />
}

export const ConBotones: Story = {
  name: 'Con botones',
  render: () => <ButtonsDemo />,
}

export const Migas: StoryObj<typeof Breadcrumb> = {
  name: 'Breadcrumb',
  render: () => (
    <Stack gap="6">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Servicios', href: '/servicios' },
          { label: 'Consultoría fiscal' },
        ]}
        schemaBaseUrl="https://empresa.com"
      />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Fiscalidad', href: '/blog/fiscalidad' },
          { label: 'Novedades del IVA para autónomos en 2026' },
        ]}
      />
    </Stack>
  ),
}

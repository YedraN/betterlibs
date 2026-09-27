import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { Accordion, AccordionItem } from './Accordion/Accordion'
import { Breadcrumb } from './Breadcrumb/Breadcrumb'
import { Button } from './Button/Button'
import { Carousel } from './Carousel/Carousel'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog/Dialog'
import { Drawer, DrawerContent, DrawerTrigger } from './Drawer/Drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu/DropdownMenu'
import { Pagination, paginationRange } from './Pagination/Pagination'
import { Popover, PopoverContent, PopoverTrigger } from './Popover/Popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs/Tabs'
import { toast } from './Toast/store'
import { Toaster } from './Toast/Toaster'
import { Tooltip } from './Tooltip/Tooltip'

describe('Dialog y Drawer', () => {
  it('abre con nombre y descripción, atrapa el foco y lo devuelve al cerrar', async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Solicitar demo</Button>
        </DialogTrigger>
        <DialogContent
          title="Solicitar demo"
          description="Te llamamos en 24 horas."
          footer={
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          }
        >
          <input aria-label="Nombre" />
        </DialogContent>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', { name: 'Solicitar demo' })
    await userEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Solicitar demo' })
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
    // El foco inicial cae en el contenido, no en «Cerrar».
    expect(document.activeElement).toBe(screen.getByLabelText('Nombre'))
    expect(within(dialog).getByRole('button', { name: 'Cerrar' })).toBeTruthy()
    await expectNoA11yViolations(dialog)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('Drawer aparece desde el lado indicado', async () => {
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Filtros</Button>
        </DrawerTrigger>
        <DrawerContent title="Filtros" side="left">
          Contenido
        </DrawerContent>
      </Drawer>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(screen.getByRole('dialog', { name: 'Filtros' }).getAttribute('data-side')).toBe('left')
  })
})

describe('Popover, Tooltip y DropdownMenu', () => {
  it('Popover se nombra con su título y se cierra con Escape', async () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Horario</Button>
        </PopoverTrigger>
        <PopoverContent title="Horario de atención">L-V de 9 a 18 h.</PopoverContent>
      </Popover>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Horario' }))
    expect(screen.getByRole('dialog', { name: 'Horario de atención' })).toBeTruthy()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('Tooltip aparece al enfocar y describe al elemento', async () => {
    render(
      <Tooltip content="Descargar en PDF">
        <Button>Descargar</Button>
      </Tooltip>,
    )
    await userEvent.tab()
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip.textContent).toBe('Descargar en PDF')
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe(tooltip.id)
  })

  it('DropdownMenu se abre con el teclado y ejecuta la opción', async () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Compartir</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Copiar enlace</DropdownMenuItem>
          <DropdownMenuItem>Enviar por email</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    const menu = screen.getByRole('menu')
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(2)
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledOnce()
  })
})

describe('Tabs y Accordion', () => {
  it('Tabs cambia de panel con las flechas', async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Servicios">
          <TabsTrigger value="a">Consultoría</TabsTrigger>
          <TabsTrigger value="b">Auditoría</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>,
    )
    expect(screen.getByRole('tablist', { name: 'Servicios' })).toBeTruthy()
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Auditoría' }).getAttribute('aria-selected')).toBe(
      'true',
    )
    expect(screen.getByRole('tabpanel').textContent).toBe('Panel B')
  })

  it('Accordion usa encabezados con botón y se puede cerrar', async () => {
    render(
      <Accordion headingLevel={2}>
        <AccordionItem value="plazos" title="¿Cuánto tarda?">
          Entre 4 y 8 semanas.
        </AccordionItem>
        <AccordionItem value="precio" title="¿Cuánto cuesta?">
          Depende del alcance.
        </AccordionItem>
      </Accordion>,
    )
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
    const button = screen.getByRole('button', { name: '¿Cuánto tarda?' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    await userEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Entre 4 y 8 semanas.')).toBeTruthy()
    await userEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('Toast', () => {
  it('muestra notificaciones en una región con nombre y las cierra', async () => {
    render(<Toaster />)
    act(() => {
      toast.success('Cambios guardados', { description: 'Todo en orden.' })
    })
    expect(screen.getByRole('region', { name: 'Notificaciones (F8)' })).toBeTruthy()
    expect(screen.getAllByText('Cambios guardados').length).toBeGreaterThan(0)
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar notificación' }))
    act(() => toast.dismiss())
  })
})

describe('Carousel', () => {
  const slides = ['Uno', 'Dos', 'Tres'].map((text) => <p key={text}>{text}</p>)

  it('expone el patrón de carrusel y anuncia los cambios', async () => {
    render(<Carousel label="Testimonios">{slides}</Carousel>)
    const carousel = screen.getByRole('region', { name: 'Testimonios' })
    expect(carousel.getAttribute('aria-roledescription')).toBe('carrusel')
    const groups = screen.getAllByRole('group')
    expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual([
      '1 de 3',
      '2 de 3',
      '3 de 3',
    ])
    const previous = screen.getByRole('button', { name: 'Anterior' })
    expect(previous.getAttribute('aria-disabled')).toBe('true')
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(screen.getByText('2 de 3', { selector: '[aria-live]' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Ir a la diapositiva 2' }).getAttribute('aria-current'),
    ).toBe('true')
    await expectNoA11yViolations(carousel)
  })

  it('con autoplay ofrece pausa, y sin él no se mueve solo', async () => {
    const { rerender } = render(<Carousel label="Logos">{slides}</Carousel>)
    expect(screen.queryByRole('button', { name: /Pausar/ })).toBeNull()
    rerender(
      <Carousel label="Logos" autoplay={4000}>
        {slides}
      </Carousel>,
    )
    const pause = screen.getByRole('button', { name: 'Pausar el carrusel' })
    await userEvent.click(pause)
    expect(screen.getByRole('button', { name: 'Reanudar el carrusel' })).toBeTruthy()
  })
})

describe('Pagination y Breadcrumb', () => {
  it('calcula los números visibles', () => {
    expect(paginationRange(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'end-ellipsis', 20])
    expect(paginationRange(10, 20)).toEqual([1, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 20])
    expect(paginationRange(20, 20)).toEqual([1, 'start-ellipsis', 16, 17, 18, 19, 20])
  })

  it('genera enlaces con la página actual marcada', () => {
    render(<Pagination page={1} totalPages={3} getHref={(page) => `/blog?pagina=${page}`} />)
    const nav = screen.getByRole('navigation', { name: 'Paginación' })
    const current = within(nav).getByRole('link', { name: 'Página 1' })
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(within(nav).queryByRole('link', { name: /Anterior/ })).toBeNull()
    expect(
      within(nav)
        .getByRole('link', { name: /Siguiente/ })
        .getAttribute('href'),
    ).toBe('/blog?pagina=2')
  })

  it('Breadcrumb marca la página actual y añade datos estructurados', () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Servicios', href: '/servicios' },
          { label: 'Consultoría' },
        ]}
        schemaBaseUrl="https://empresa.com"
      />,
    )
    expect(screen.getByRole('navigation', { name: 'Ruta de navegación' })).toBeTruthy()
    expect(screen.getByText('Consultoría').getAttribute('aria-current')).toBe('page')
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '{}')
    expect(data.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Servicios',
      item: 'https://empresa.com/servicios',
    })
  })

  it('los componentes de navegación y contenido pasan axe', async () => {
    const { container } = render(
      <>
        <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Blog' }]} />
        <Tabs defaultValue="a">
          <TabsList aria-label="Planes">
            <TabsTrigger value="a">Mensual</TabsTrigger>
            <TabsTrigger value="b">Anual</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Mensual</TabsContent>
          <TabsContent value="b">Anual</TabsContent>
        </Tabs>
        <Accordion defaultValue="a">
          <AccordionItem value="a" title="Pregunta">
            Respuesta
          </AccordionItem>
        </Accordion>
        <Pagination page={4} totalPages={10} onPageChange={() => {}} />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})

import { ArrowRightIcon, MailIcon } from '@betterlibs/icons'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../test/axe'
import { Avatar, AvatarGroup } from './Avatar/Avatar'
import { Badge } from './Badge/Badge'
import { Button } from './Button/Button'
import { ButtonGroup } from './ButtonGroup/ButtonGroup'
import { Heading } from './Heading/Heading'
import { Icon } from './Icon/Icon'
import { IconButton } from './IconButton/IconButton'
import { Image } from './Image/Image'
import { Link } from './Link/Link'
import { Skeleton } from './Skeleton/Skeleton'
import { SkipLink } from './SkipLink/SkipLink'
import { Spinner } from './Spinner/Spinner'
import { Tag } from './Tag/Tag'
import { Text } from './Text/Text'

describe('Heading y Text', () => {
  it('separa nivel semántico y tamaño visual', () => {
    render(
      <Heading level={1} size="3xl">
        Título
      </Heading>,
    )
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.getAttribute('data-size')).toBe('3xl')
  })

  it('Text renderiza un párrafo y admite `as` y `lines`', () => {
    const { container } = render(
      <Text as="span" variant="eyebrow" lines={2}>
        Servicios
      </Text>,
    )
    const el = container.querySelector('span')
    expect(el?.getAttribute('data-variant')).toBe('eyebrow')
    expect(el?.style.getPropertyValue('--_lines')).toBe('2')
  })
})

describe('Button', () => {
  it('es type="button" por defecto y ejecuta onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Enviar</Button>)
    const button = screen.getByRole('button', { name: 'Enviar' })
    expect(button.getAttribute('type')).toBe('button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('en loading anuncia la carga, mantiene el foco y bloquea la acción', () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button.getAttribute('aria-busy')).toBe('true')
    expect(button.getAttribute('aria-disabled')).toBe('true')
    expect(button.hasAttribute('disabled')).toBe(false)
    expect(button.textContent).toContain('Cargando…')
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('con asChild renderiza el enlace hijo con los estilos del botón', () => {
    render(
      <Button asChild variant="outline" iconEnd={<ArrowRightIcon />}>
        <a href="/contacto">Contactar</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Contactar' })
    expect(link.getAttribute('data-variant')).toBe('outline')
    expect(link.getAttribute('href')).toBe('/contacto')
  })

  it('IconButton usa label como nombre accesible', () => {
    render(
      <IconButton label="Enviar por correo">
        <MailIcon />
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: 'Enviar por correo' })).toBeTruthy()
  })

  it('ButtonGroup es un grupo solo si tiene etiqueta', () => {
    const { rerender } = render(<ButtonGroup data-testid="g" />)
    expect(screen.getByTestId('g').getAttribute('role')).toBeNull()
    rerender(<ButtonGroup data-testid="g" aria-label="Acciones" />)
    expect(screen.getByRole('group', { name: 'Acciones' })).toBeTruthy()
  })
})

describe('Link', () => {
  it('los enlaces externos avisan y añaden rel seguro', () => {
    render(
      <Link href="https://example.com" target="_blank">
        Informe anual
      </Link>,
    )
    const link = screen.getByRole('link')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.textContent).toContain('(se abre en una pestaña nueva)')
  })
})

describe('Tag', () => {
  it('el botón de quitar tiene nombre accesible', async () => {
    const onRemove = vi.fn()
    render(<Tag onRemove={onRemove}>Madrid</Tag>)
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Madrid' }))
    expect(onRemove).toHaveBeenCalledOnce()
  })
})

describe('Avatar', () => {
  it('muestra iniciales si no hay foto o falla la carga', () => {
    const { rerender } = render(<Avatar name="Laura Gómez Ruiz" />)
    expect(screen.getByRole('img', { name: 'Laura Gómez Ruiz' }).textContent).toBe('LR')
    rerender(<Avatar name="Laura Gómez Ruiz" src="/roto.jpg" />)
    const img = screen.getByRole('img', { name: 'Laura Gómez Ruiz' })
    fireEvent.error(img)
    expect(screen.getByRole('img', { name: 'Laura Gómez Ruiz' }).textContent).toBe('LR')
  })

  it('AvatarGroup resume el resto con +N', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ana" />
        <Avatar name="Luis" />
        <Avatar name="Marta" />
        <Avatar name="Pablo" />
      </AvatarGroup>,
    )
    expect(screen.getByRole('img', { name: 'y 2 más' }).textContent).toBe('+2')
  })
})

describe('Feedback', () => {
  it('Spinner anuncia su estado y Skeleton se oculta', () => {
    const { container } = render(
      <>
        <Spinner label="Cargando casos" />
        <Skeleton lines={3} />
      </>,
    )
    expect(screen.getByRole('status').textContent).toBe('Cargando casos')
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })
})

describe('Accesibilidad de componentes base', () => {
  it('un conjunto representativo no tiene violaciones', async () => {
    const { container } = render(
      <div>
        <SkipLink />
        <main id="main">
          <Text variant="eyebrow">Consultoría</Text>
          <Heading level={1}>Hacemos crecer tu empresa</Heading>
          <Text variant="lead">Estrategia, tecnología y personas.</Text>
          <ButtonGroup aria-label="Acciones principales">
            <Button>Solicitar propuesta</Button>
            <Button variant="outline" disabled>
              No disponible
            </Button>
            <IconButton label="Compartir">
              <ArrowRightIcon />
            </IconButton>
          </ButtonGroup>
          <Link href="/casos" variant="standalone" arrow>
            Ver casos de éxito
          </Link>
          <Badge tone="success" dot>
            Disponible
          </Badge>
          <Tag asChild>
            <a href="/blog/fiscalidad">Fiscalidad</a>
          </Tag>
          <Icon label="Correo">
            <MailIcon />
          </Icon>
          <Image src="data:," alt="Equipo en la oficina" ratio={4 / 3} caption="Nuestro equipo" />
          <AvatarGroup>
            <Avatar name="Ana Pérez" />
            <Avatar name="Luis Martín" />
          </AvatarGroup>
          <Spinner />
        </main>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})

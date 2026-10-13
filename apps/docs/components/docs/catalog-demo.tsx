'use client'

import {
  type MotionMode,
  MotionProvider,
  useLayoutTransition,
  useSpringTabsIndicator,
} from '@betterlibs/motion'
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Carousel,
  Checkbox,
  CheckboxGroup,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Field,
  Fieldset,
  FileInput,
  Form,
  Grid,
  Input,
  Pagination,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Textarea,
  Toaster,
  Tooltip,
  toast,
} from '@betterlibs/react'
import { useRef, useState } from 'react'

export function CatalogFormsDemo() {
  const [saved, setSaved] = useState(false)
  return (
    <Form
      aria-label="Nueva colección"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
      }}
    >
      <Fieldset legend="Datos de la colección" legendSize="lg">
        <Field label="Nombre de la colección" name="collection" required>
          <Input autoComplete="off" />
        </Field>
        <Grid columns={{ base: 1, md: 2 }} gap="4">
          <Field label="Visibilidad" name="visibility">
            <Select defaultValue="team">
              <option value="team">Solo el equipo</option>
              <option value="public">Pública</option>
            </Select>
          </Field>
          <Field label="Código" name="code" description="Se asigna automáticamente.">
            <Input value="BL-024" readOnly />
          </Field>
        </Grid>
        <Field label="Descripción" name="description" required>
          <Textarea rows={3} maxLength={120} showCount />
        </Field>
        <Field
          label="Archivo de referencia"
          name="reference"
          description="Selecciona un archivo de tu equipo."
        >
          <FileInput />
        </Field>
      </Fieldset>
      <RadioGroup
        label="Formato"
        name="format"
        defaultValue="article"
        variant="card"
        orientation="horizontal"
      >
        <Radio value="article" label="Artículo" description="Una lectura continua." />
        <Radio value="gallery" label="Galería" description="Varias piezas en una retícula." />
        <Radio value="video" label="Vídeo" disabled description="Disponible próximamente." />
      </RadioGroup>
      <CheckboxGroup label="Contenido incluido" name="content" orientation="horizontal">
        <Checkbox value="text" label="Texto" defaultChecked />
        <Checkbox value="images" label="Imágenes" />
      </CheckboxGroup>
      <Switch
        label="Recibir avisos"
        name="notifications"
        defaultChecked
        description="Puedes cambiarlo más tarde."
      />
      <Fieldset legend="Opciones pendientes" disabled>
        <Switch label="Publicación programada" />
        <Checkbox label="Traducción automática" defaultChecked />
      </Fieldset>
      <div>
        <Button type="submit">Guardar colección</Button>
      </div>
      {saved && (
        <Alert tone="success" title="Colección guardada" role="status">
          Puedes seguir editando el contenido.
        </Alert>
      )}
    </Form>
  )
}

export function CatalogOverlaysDemo() {
  const [grid, setGrid] = useState(true)
  const [sort, setSort] = useState('recent')
  const [name, setName] = useState('Atlas')
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
  const [status, setStatus] = useState('Sin cambios')
  return (
    <Stack gap="5">
      <Field label="Lado del panel">
        <Select value={side} onChange={(event) => setSide(event.target.value as typeof side)}>
          <option value="right">Derecha</option>
          <option value="left">Izquierda</option>
          <option value="top">Arriba</option>
          <option value="bottom">Abajo</option>
        </Select>
      </Field>
      <Stack direction="row" wrap gap="3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Opciones de colección</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Vista</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
              Mostrar retícula
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="recent">Más recientes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">Por nombre</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Compartir</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setStatus('Enlace preparado')}>
                  Preparar enlace
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Publicar (próximamente)</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              tone="danger"
              onSelect={() => setStatus('Archivo de ejemplo vaciado')}
            >
              Vaciar ejemplo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Editar nombre</Button>
          </PopoverTrigger>
          <PopoverContent title="Nombre visible" closeButton>
            <Stack gap="3">
              <Field label="Nombre corto">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <PopoverClose asChild>
                <Button>Aplicar nombre</Button>
              </PopoverClose>
            </Stack>
          </PopoverContent>
        </Popover>
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Abrir panel</Button>
          </DrawerTrigger>
          <DrawerContent
            title="Editar colección"
            description="El borrador se conserva al cerrar el panel."
            side={side}
            footer={
              <DrawerClose asChild>
                <Button>Guardar y cerrar panel</Button>
              </DrawerClose>
            }
          >
            <Stack gap="4">
              <Field label="Título del borrador">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Ayuda del borrador</Button>
                </PopoverTrigger>
                <PopoverContent title="Ayuda" closeButton>
                  El título aparece en el índice de tu colección.
                </PopoverContent>
              </Popover>
            </Stack>
          </DrawerContent>
        </Drawer>
        <Tooltip content="Conserva el historial de cambios">
          <Button variant="ghost">Acerca del historial</Button>
        </Tooltip>
      </Stack>
      <p role="status">
        {name} · {grid ? 'Retícula visible' : 'Retícula oculta'} ·{' '}
        {sort === 'recent' ? 'Más recientes' : 'Por nombre'} · {status}
      </p>
      <Stack direction="row" wrap gap="3">
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Colección guardada', {
              id: 'catalog-save',
              description: 'Los cambios están disponibles para tu equipo.',
              action: { label: 'Deshacer', onClick: () => setStatus('Cambios deshechos') },
            })
          }
        >
          Mostrar notificación
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss('catalog-save')}>
          Cerrar notificación
        </Button>
        <Button
          variant="ghost"
          onClick={() => toast.success('Colección actualizada', { id: 'catalog-save' })}
        >
          Actualizar notificación
        </Button>
      </Stack>
      <Toaster />
    </Stack>
  )
}

export function CatalogContentDemo() {
  const [selected, setSelected] = useState(true)
  const [page, setPage] = useState(2)
  return (
    <Stack gap="6">
      <Alert title="Contenido disponible" tone="info">
        El estado también se explica con texto.
      </Alert>
      <Stack direction="row" wrap gap="3">
        <Badge tone="accent">En revisión</Badge>
        <Badge tone="success">Publicado</Badge>
        <Badge tone="danger">Requiere cambios</Badge>
        <Badge dot pulse>
          Conectado
        </Badge>
      </Stack>
      <Tag asChild selected={selected}>
        <button type="button" aria-pressed={selected} onClick={() => setSelected(!selected)}>
          Diseño editorial
        </button>
      </Tag>
      <AvatarGroup max={3}>
        <Avatar name="Ana López" />
        <Avatar name="Bruno Gil" />
        <Avatar name="Carla Ruiz" />
        <Avatar name="Diego Pérez" />
      </AvatarGroup>
      <section aria-label="Vista previa pendiente" aria-busy="true">
        <Skeleton lines={3} />
      </section>
      <Pagination page={page} totalPages={12} onPageChange={setPage} />
      <Carousel label="Piezas destacadas" autoplay={4000}>
        <p>Lectura continua</p>
        <p>Composición editorial</p>
        <p>Controles accesibles</p>
      </Carousel>
    </Stack>
  )
}

export function PositionDemo({
  vertical = false,
  direction = 'ltr',
}: {
  vertical?: boolean
  direction?: 'ltr' | 'rtl'
} = {}) {
  const [mode, setMode] = useState<MotionMode>('system')
  return (
    <MotionProvider mode={mode}>
      <div data-motion={mode} dir={direction}>
        <Field label="Movimiento">
          <Select value={mode} onChange={(event) => setMode(event.target.value as MotionMode)}>
            <option value="system">Sistema</option>
            <option value="reduced">Reducido</option>
            <option value="off">Desactivado</option>
          </Select>
        </Field>
        <PositionSample vertical={vertical} direction={direction} />
      </div>
    </MotionProvider>
  )
}

export function PositionSample({
  vertical = false,
  direction = 'ltr',
}: {
  vertical?: boolean
  direction?: 'ltr' | 'rtl'
} = {}) {
  const [items, setItems] = useState(['Lectura', 'Diseño', 'Código'])
  const [compact, setCompact] = useState(false)
  const [tab, setTab] = useState('read')
  const list = useRef<HTMLUListElement>(null)
  const tabs = useRef<HTMLDivElement>(null)
  useLayoutTransition(list, `${items.join(',')}/${compact}`)
  useSpringTabsIndicator(tabs)
  return (
    <Stack gap="5" style={{ paddingBlock: '1.5rem' }}>
      <Tabs
        value={tab}
        onValueChange={setTab}
        variant={vertical ? 'line' : 'pill'}
        orientation={vertical ? 'vertical' : 'horizontal'}
        dir={direction}
        activationMode="manual"
      >
        <TabsList ref={tabs} aria-label="Capacidades opcionales">
          <TabsTrigger value="read">Lectura</TabsTrigger>
          <TabsTrigger value="design">Diseño</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
          <TabsTrigger value="soon" disabled>
            Próximamente
          </TabsTrigger>
        </TabsList>
        <TabsContent value="read">
          La selección accesible y el contenido cambian inmediatamente.
        </TabsContent>
        <TabsContent value="design">
          El indicador mantiene continuidad al cambiar de dirección.
        </TabsContent>
        <TabsContent value="code">
          <Field label="Nota de código">
            <Input />
          </Field>
        </TabsContent>
      </Tabs>
      <Stack direction="row" wrap gap="3">
        <Button onClick={() => setItems((value) => [...value].reverse())}>Invertir orden</Button>
        <Button variant="outline" onClick={() => setCompact(!compact)}>
          Cambiar retícula
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setItems((value) =>
              value.includes('Archivo')
                ? value.filter((item) => item !== 'Archivo')
                : [...value, 'Archivo'],
            )
          }
        >
          Alternar pieza
        </Button>
      </Stack>
      <ul
        ref={list}
        aria-label="Piezas de la colección"
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {items.map((item) => (
          <li
            data-bl-layout
            key={item}
            style={{
              minWidth: 0,
              padding: '1rem',
              border: '1px solid var(--bl-color-border-input)',
              borderRadius: 'var(--bl-radius-md)',
              background: 'var(--bl-color-surface)',
            }}
          >
            <Field label={`Nota de ${item}`}>
              <Input defaultValue={item} />
            </Field>
          </li>
        ))}
      </ul>
    </Stack>
  )
}

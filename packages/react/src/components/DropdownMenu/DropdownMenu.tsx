'use client'

import { CheckIcon, ChevronRightIcon } from '@betterlibs/icons'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import floating from '../Popover/Floating.module.css'
import { usePortalContainer } from '../Portal/Portal'
import styles from './DropdownMenu.module.css'

export type DropdownMenuProps = MenuPrimitive.DropdownMenuProps

/**
 * Menú de acciones que se abre desde un botón («Más opciones», idioma, compartir). Se maneja con
 * flechas, Inicio/Fin, escribiendo la inicial y Escape.
 *
 * Es para **acciones**. Para la navegación principal de la web usa `NavigationMenu`.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild><Button variant="outline">Compartir</Button></DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem onSelect={copiar}>Copiar enlace</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */
export function DropdownMenu(props: DropdownMenuProps) {
  return <MenuPrimitive.Root {...props} />
}

/** Botón que abre el menú. Usa `asChild` con un `Button` o `IconButton`. */
export const DropdownMenuTrigger = MenuPrimitive.Trigger

/** Agrupa elementos relacionados. */
export const DropdownMenuGroup = MenuPrimitive.Group

/** Submenú: contiene un `DropdownMenuSubTrigger` y un `DropdownMenuSubContent`. */
export const DropdownMenuSub = MenuPrimitive.Sub

export type DropdownMenuContentProps = MenuPrimitive.DropdownMenuContentProps

/** Lista del menú. Por defecto aparece debajo, alineada al inicio del botón. */
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = 'start',
  collisionPadding = 16,
  ...props
}: DropdownMenuContentProps) {
  const container = usePortalContainer()
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Content
        className={cx(floating.content, styles.content, className)}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

type ItemExtras = {
  /** Icono decorativo antes del texto. */
  icon?: ReactNode
  /** Texto secundario a la derecha (atajo de teclado, idioma…). */
  hint?: ReactNode
}

function ItemInner({ icon, hint, children }: ItemExtras & { children: ReactNode }) {
  return (
    <>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </>
  )
}

export type DropdownMenuItemProps = MenuPrimitive.DropdownMenuItemProps &
  ItemExtras & {
    /** `danger` para acciones destructivas («Eliminar»). */
    tone?: 'default' | 'danger'
  }

/**
 * Opción del menú. `onSelect` se ejecuta con clic, Enter o Espacio. Para navegar, usa `asChild`
 * con un enlace: `<DropdownMenuItem asChild><a href="/en">English</a></DropdownMenuItem>`.
 */
export function DropdownMenuItem({
  icon,
  hint,
  tone = 'default',
  asChild,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cx(styles.item, className)}
      data-tone={tone}
      asChild={asChild}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <ItemInner icon={icon} hint={hint}>
          {children}
        </ItemInner>
      )}
    </MenuPrimitive.Item>
  )
}

export type DropdownMenuCheckboxItemProps = MenuPrimitive.DropdownMenuCheckboxItemProps &
  Pick<ItemExtras, 'hint'>

/** Opción que se marca y desmarca (p. ej. columnas visibles). */
export function DropdownMenuCheckboxItem({
  hint,
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem className={cx(styles.item, styles.indented, className)} {...props}>
      <MenuPrimitive.ItemIndicator className={styles.indicator}>
        <CheckIcon aria-hidden="true" />
      </MenuPrimitive.ItemIndicator>
      <ItemInner hint={hint}>{children}</ItemInner>
    </MenuPrimitive.CheckboxItem>
  )
}

/** Grupo de opciones excluyentes: `value` + `onValueChange`. */
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

export type DropdownMenuRadioItemProps = MenuPrimitive.DropdownMenuRadioItemProps &
  Pick<ItemExtras, 'hint'>

/** Opción de un `DropdownMenuRadioGroup` (p. ej. idioma u orden). */
export function DropdownMenuRadioItem({
  hint,
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem className={cx(styles.item, styles.indented, className)} {...props}>
      <MenuPrimitive.ItemIndicator className={styles.indicator}>
        <span className={styles.dot} />
      </MenuPrimitive.ItemIndicator>
      <ItemInner hint={hint}>{children}</ItemInner>
    </MenuPrimitive.RadioItem>
  )
}

/** Título de una sección del menú (no seleccionable). */
export function DropdownMenuLabel({ className, ...props }: MenuPrimitive.DropdownMenuLabelProps) {
  return <MenuPrimitive.Label className={cx(styles.groupLabel, className)} {...props} />
}

/** Separador entre grupos. */
export function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.DropdownMenuSeparatorProps) {
  return <MenuPrimitive.Separator className={cx(styles.separator, className)} {...props} />
}

export type DropdownMenuSubTriggerProps = MenuPrimitive.DropdownMenuSubTriggerProps &
  Pick<ItemExtras, 'icon'>

/** Opción que abre un submenú (flecha derecha o Enter). */
export function DropdownMenuSubTrigger({
  icon,
  className,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubTrigger className={cx(styles.item, className)} {...props}>
      <ItemInner icon={icon} hint={<ChevronRightIcon aria-hidden="true" />}>
        {children}
      </ItemInner>
    </MenuPrimitive.SubTrigger>
  )
}

/** Contenido de un submenú. */
export function DropdownMenuSubContent({
  className,
  sideOffset = 4,
  collisionPadding = 16,
  ...props
}: MenuPrimitive.DropdownMenuSubContentProps) {
  const container = usePortalContainer()
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.SubContent
        className={cx(floating.content, styles.content, className)}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

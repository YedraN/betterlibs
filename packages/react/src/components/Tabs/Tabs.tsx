'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { type ComponentPropsWithRef, type ReactNode, useEffect, useRef } from 'react'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/merge-refs'
import styles from './Tabs.module.css'

export type TabsProps = TabsPrimitive.TabsProps & {
  /** `line`: subrayado bajo la pestaña activa. `pill`: botones sobre un fondo. @default 'line' */
  variant?: 'line' | 'pill'
  /** Las pestañas ocupan todo el ancho a partes iguales. */
  fullWidth?: boolean
}

/**
 * Pestañas para alternar entre vistas relacionadas sin salir de la página (servicios, planes,
 * sedes). Flechas para moverse entre pestañas, Tab para entrar en el contenido.
 *
 * No las uses para contenido que se deba leer entero o comparar: todo lo que está en pestañas
 * ocultas pasa desapercibido. En móvil, la lista hace scroll horizontal si no cabe.
 *
 * @example
 * <Tabs defaultValue="consultoria">
 *   <TabsList aria-label="Servicios">
 *     <TabsTrigger value="consultoria">Consultoría</TabsTrigger>
 *     <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="consultoria">…</TabsContent>
 *   <TabsContent value="auditoria">…</TabsContent>
 * </Tabs>
 */
export function Tabs({ variant = 'line', fullWidth = false, className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cx(styles.root, className)}
      data-variant={variant}
      data-full-width={fullWidth || undefined}
      {...props}
    />
  )
}

/**
 * Lista de pestañas. Dale un `aria-label` que describa el conjunto.
 *
 * Un indicador se desliza hasta la pestaña activa (subrayado en `line`, superficie elevada en
 * `pill`). Sin JavaScript, cada pestaña muestra su propio indicador fijo.
 */
export function TabsList({
  className,
  children,
  ref,
  ...props
}: ComponentPropsWithRef<typeof TabsPrimitive.List>) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const update = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      if (!active) {
        delete list.dataset.indicator
        return
      }
      list.style.setProperty('--_ind-x', `${active.offsetLeft}px`)
      list.style.setProperty('--_ind-y', `${active.offsetTop}px`)
      list.style.setProperty('--_ind-w', `${active.offsetWidth}px`)
      list.style.setProperty('--_ind-h', `${active.offsetHeight}px`)
      list.dataset.indicator = ''
    }
    update()
    const mutations = new MutationObserver(update)
    mutations.observe(list, { attributes: true, attributeFilter: ['data-state'], subtree: true })
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : undefined
    resize?.observe(list)
    return () => {
      mutations.disconnect()
      resize?.disconnect()
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={mergeRefs(listRef, ref)}
      className={cx(styles.list, className)}
      {...props}
    >
      {children}
      <span className={styles.indicator} aria-hidden="true" />
    </TabsPrimitive.List>
  )
}

export type TabsTriggerProps = TabsPrimitive.TabsTriggerProps & {
  /** Icono decorativo antes del texto. */
  icon?: ReactNode
}

/** Pestaña. Su `value` la enlaza con un `TabsContent`. */
export function TabsTrigger({ icon, className, children, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger className={cx(styles.trigger, className)} {...props}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </TabsPrimitive.Trigger>
  )
}

/** Panel de una pestaña. */
export function TabsContent({ className, ...props }: TabsPrimitive.TabsContentProps) {
  return <TabsPrimitive.Content className={cx(styles.content, className)} {...props} />
}

'use client'

import { ChevronDownIcon } from '@betterlibs/icons'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { createContext, type ReactNode, useContext, useState } from 'react'
import { cx } from '../../utils/cx'
import styles from './Accordion.module.css'

type HeadingLevel = 2 | 3 | 4 | 5 | 6

const HeadingLevelContext = createContext<HeadingLevel>(3)
const OpenItemsContext = createContext<string | string[]>('')

type AccordionOwnProps = {
  /**
   * `default`: separadores entre elementos. `bordered`: todo dentro de un marco.
   * `separated`: cada elemento en su propia tarjeta.
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'separated'
  /**
   * Nivel del encabezado de cada pregunta. Ajústalo a la jerarquía de la página: si el acordeón
   * va bajo un `h2`, usa 3.
   * @default 3
   */
  headingLevel?: HeadingLevel
}

export type AccordionProps = AccordionOwnProps &
  (
    | ({ type?: 'single' } & Omit<AccordionPrimitive.AccordionSingleProps, 'type'>)
    | AccordionPrimitive.AccordionMultipleProps
  )

/**
 * Secciones que se despliegan: preguntas frecuentes, detalles de un servicio, condiciones.
 * Enter/Espacio abren y cierran; las flechas pasan de una pregunta a otra.
 *
 * Por defecto solo hay una abierta a la vez y se puede cerrar (`type="single"` + `collapsible`).
 * Usa `type="multiple"` para permitir varias.
 *
 * @example
 * <Accordion>
 *   <AccordionItem value="plazos" title="¿Cuánto tarda un proyecto?">Entre 4 y 8 semanas.</AccordionItem>
 * </Accordion>
 */
export function Accordion({
  variant = 'default',
  headingLevel = 3,
  className,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    props.defaultValue ?? (props.type === 'multiple' ? [] : ''),
  )
  const value = props.value ?? internalValue
  const shared = { className: cx(styles.root, className), 'data-variant': variant }
  return (
    <HeadingLevelContext.Provider value={headingLevel}>
      <OpenItemsContext value={value}>
        {props.type === 'multiple' ? (
          <AccordionPrimitive.Root
            {...shared}
            {...props}
            onValueChange={(next: string[]) => {
              setInternalValue(next)
              props.onValueChange?.(next)
            }}
          />
        ) : (
          <AccordionPrimitive.Root
            {...shared}
            collapsible
            {...(props as Omit<AccordionPrimitive.AccordionSingleProps, 'type'>)}
            type="single"
            onValueChange={(next: string) => {
              setInternalValue(next)
              props.onValueChange?.(next)
            }}
          />
        )}
      </OpenItemsContext>
    </HeadingLevelContext.Provider>
  )
}

export type AccordionItemProps = Omit<AccordionPrimitive.AccordionItemProps, 'title'> & {
  /** Texto del botón (la pregunta). */
  title: ReactNode
  /** Icono decorativo antes del título. */
  icon?: ReactNode
}

/** Elemento del acordeón: encabezado con botón y panel desplegable. */
export function AccordionItem({ title, icon, className, children, ...props }: AccordionItemProps) {
  const level = useContext(HeadingLevelContext)
  const value = useContext(OpenItemsContext)
  const open = typeof value === 'string' ? value === props.value : value.includes(props.value)
  const Heading = `h${level}` as const
  return (
    <AccordionPrimitive.Item className={cx(styles.item, className)} {...props}>
      <AccordionPrimitive.Header asChild>
        <Heading className={styles.heading}>
          <AccordionPrimitive.Trigger className={styles.trigger}>
            {icon && (
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            )}
            <span className={styles.title}>{title}</span>
            <ChevronDownIcon className={styles.chevron} aria-hidden="true" />
          </AccordionPrimitive.Trigger>
        </Heading>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={styles.content}
        inert={!open || undefined}
        aria-hidden={!open || undefined}
      >
        <div className={styles.body}>{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

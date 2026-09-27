'use client'

import { AlertCircleIcon } from '@betterlibs/icons'
import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './ErrorSummary.module.css'

export type ErrorSummaryItem = {
  /** `id` del control con el error: el enlace lleva el foco hasta él. */
  id?: string
  /** Nombre del campo («Email»). */
  label?: ReactNode
  message: ReactNode
}

export type ErrorSummaryProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  errors: ErrorSummaryItem[]
  /** @default 'Revisa los siguientes campos' */
  title?: ReactNode
  /** Texto opcional bajo el título. */
  description?: ReactNode
  /** Nivel del título. @default 2 */
  headingLevel?: 2 | 3 | 4
}

/** Lleva el foco al control y centra en pantalla el campo completo (etiqueta incluida). */
export function focusControl(id: string) {
  const element = document.getElementById(id)
  if (!element) return false
  element.focus({ preventScroll: true })
  const container = element.closest('[data-bl-field], fieldset') ?? element
  container.scrollIntoView?.({ block: 'center' })
  return true
}

/**
 * Resumen de errores al principio del formulario (patrón GOV.UK): lista cada problema con un
 * enlace que lleva al campo. El `Form` lo muestra y enfoca solo; úsalo suelto para errores que
 * vienen del servidor en páginas sin JavaScript.
 */
export function ErrorSummary({
  errors,
  title = 'Revisa los siguientes campos',
  description,
  headingLevel = 2,
  className,
  ...props
}: ErrorSummaryProps) {
  if (errors.length === 0) return null
  const Heading = `h${headingLevel}` as const

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (focusControl(id)) event.preventDefault()
  }

  return (
    // Sin rol ni nombre: al recibir el foco, los lectores de pantalla leen todo su contenido.
    <div className={cx(styles.root, className)} tabIndex={-1} data-bl-error-summary="" {...props}>
      <AlertCircleIcon className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        <Heading className={styles.title}>{title}</Heading>
        {description && <div className={styles.description}>{description}</div>}
        <ul className={styles.list}>
          {errors.map((error, index) => {
            const text = (
              <>
                {error.label && <span className={styles.label}>{error.label}: </span>}
                {error.message}
              </>
            )
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: la lista se regenera entera en cada envío
              <li key={error.id ?? index}>
                {error.id ? (
                  <a
                    href={`#${error.id}`}
                    className={styles.link}
                    onClick={(event) => handleClick(event, error.id as string)}
                  >
                    {text}
                  </a>
                ) : (
                  text
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

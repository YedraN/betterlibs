import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import type { Breakpoint } from '../../utils/types'
import styles from './ButtonGroup.module.css'

export type ButtonGroupProps = ComponentPropsWithRef<'div'> & {
  /** Une los botones visualmente (barra segmentada). */
  attached?: boolean
  /** @default 'start' */
  align?: 'start' | 'center' | 'end'
  /** Apila los botones a ancho completo por debajo de este breakpoint. */
  stackBelow?: Breakpoint
}

/**
 * Agrupa acciones relacionadas, como el CTA principal y el secundario de un hero.
 * Si los botones forman un conjunto con significado, añade `aria-label`.
 */
export function ButtonGroup({
  attached = false,
  align = 'start',
  stackBelow,
  className,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role={props['aria-label'] || props['aria-labelledby'] ? 'group' : undefined}
      className={cx(styles.root, className)}
      data-attached={attached || undefined}
      data-align={align}
      data-stack-below={stackBelow}
      {...props}
    />
  )
}

import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Button, type ButtonProps } from '../Button/Button'
import buttonStyles from '../Button/Button.module.css'

export type IconButtonProps = Omit<
  ButtonProps,
  'iconStart' | 'iconEnd' | 'fullWidth' | 'children' | 'aria-label'
> & {
  /**
   * Nombre accesible del botón (obligatorio): describe la acción, no el icono.
   * «Cerrar menú», no «X».
   */
  label: string
  /** El icono a mostrar. */
  children: ReactNode
  /** @default 'square' */
  shape?: 'square' | 'circle'
}

/** Botón compuesto solo por un icono. Requiere `label` para que sea accesible. */
export function IconButton({
  label,
  shape = 'square',
  variant = 'ghost',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      aria-label={label}
      title={label}
      className={cx(buttonStyles.iconOnly, shape === 'circle' && buttonStyles.circle, className)}
      {...props}
    >
      <span className={buttonStyles.icon} aria-hidden="true">
        {children}
      </span>
    </Button>
  )
}

'use client'

import { EyeIcon, EyeOffIcon } from '@betterlibs/icons'
import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/merge-refs'
import controlStyles from '../Field/Control.module.css'
import { useFieldControl } from '../Field/use-field-control'
import styles from './Input.module.css'

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'> & {
  /** `md` mide 44px de alto, el mínimo recomendado para pantallas táctiles. @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Marca el campo con error. Dentro de un `Field` se deduce de su `error`. */
  invalid?: boolean
  /**
   * Texto fijo antes del valor («https://», «+34»). Es decorativo: incluye la unidad también
   * en la etiqueta («Presupuesto, en euros») para que los lectores de pantalla la anuncien.
   */
  prefix?: ReactNode
  /** Texto fijo después del valor («€», «kg»). Decorativo, como `prefix`. */
  suffix?: ReactNode
  /** Icono decorativo al inicio (p. ej. una lupa en un buscador). */
  iconStart?: ReactNode
  /** Icono decorativo al final. */
  iconEnd?: ReactNode
  /** En `type="password"`, muestra un botón para ver la contraseña. @default true */
  passwordToggle?: boolean
  /** Nombre accesible del botón de ver contraseña. @default 'Mostrar contraseña' */
  showPasswordLabel?: string
  /** Atributo `size` nativo (ancho en caracteres). */
  htmlSize?: number
}

/**
 * Campo de texto de una línea. Úsalo dentro de un `Field` para tener etiqueta, ayuda y errores
 * enlazados. `className` y `style` se aplican al marco; el resto de props y `ref`, al `<input>`.
 *
 * Elige el `type` y el `autoComplete` correctos (`email`, `tel`, `url`…): muestran el teclado
 * adecuado en móvil y permiten autocompletar.
 */
export function Input({
  size = 'md',
  invalid: invalidProp,
  prefix,
  suffix,
  iconStart,
  iconEnd,
  passwordToggle = true,
  showPasswordLabel = 'Mostrar contraseña',
  htmlSize,
  type = 'text',
  className,
  style,
  ref,
  id,
  name,
  required,
  disabled,
  readOnly,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const { invalid, success, controlProps } = useFieldControl({
    id,
    name,
    required,
    disabled,
    readOnly,
    invalid: invalidProp,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  })
  const isPassword = type === 'password'
  const showToggle = isPassword && passwordToggle

  // Un clic en el marco (prefijo, icono, relleno) enfoca el campo, como si fuera parte de él.
  const focusInput = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target === inputRef.current || target.closest('button')) return
    event.preventDefault()
    inputRef.current?.focus()
  }

  return (
    <div
      className={cx(controlStyles.box, className)}
      style={style}
      data-size={size}
      data-invalid={invalid || undefined}
      data-success={success || undefined}
      data-disabled={controlProps.disabled || undefined}
      data-readonly={controlProps.readOnly || undefined}
      onMouseDown={focusInput}
    >
      {prefix && (
        <span className={controlStyles.affix} aria-hidden="true">
          {prefix}
        </span>
      )}
      {iconStart && (
        <span className={controlStyles.icon} aria-hidden="true">
          {iconStart}
        </span>
      )}
      <input
        ref={mergeRefs(inputRef, ref)}
        type={showToggle && passwordVisible ? 'text' : type}
        size={htmlSize}
        className={controlStyles.field}
        {...controlProps}
        {...props}
      />
      {iconEnd && (
        <span className={controlStyles.icon} aria-hidden="true">
          {iconEnd}
        </span>
      )}
      {showToggle && (
        <button
          type="button"
          className={styles.toggle}
          aria-label={showPasswordLabel}
          aria-pressed={passwordVisible}
          aria-controls={controlProps.id}
          disabled={controlProps.disabled}
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          {passwordVisible ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
        </button>
      )}
      {suffix && (
        <span className={controlStyles.affix} aria-hidden="true">
          {suffix}
        </span>
      )}
    </div>
  )
}

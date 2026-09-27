'use client'

import { type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { cx } from '../../utils/cx'
import type { FieldIndicator } from '../Field/context'
import {
  FieldDescription,
  FieldMessage,
  hasContent,
  joinIds,
  LabelText,
  useIndicator,
} from '../Field/parts'
import vhStyles from '../VisuallyHidden/VisuallyHidden.module.css'
import styles from './Fieldset.module.css'

export type FieldsetProps = Omit<ComponentPropsWithRef<'fieldset'>, 'children'> & {
  /** Título del grupo. En preguntas («¿Cómo prefieres que te contactemos?») es la pregunta. */
  legend: ReactNode
  /** Ayuda bajo la leyenda. */
  description?: ReactNode
  /** Error del grupo completo. */
  error?: ReactNode
  /** Muestra la marca de obligatorio en la leyenda. */
  required?: boolean
  indicator?: FieldIndicator
  optionalLabel?: string
  /**
   * `md`: leyenda con el tamaño de una etiqueta (grupos de opciones).
   * `lg`: leyenda como título de sección («Datos de la empresa»).
   * @default 'md'
   */
  legendSize?: 'md' | 'lg'
  /** Oculta la leyenda a la vista pero la mantiene para lectores de pantalla. */
  hideLegend?: boolean
  /** `disabled` nativo: deshabilita todos los controles del grupo. */
  disabled?: boolean
  children: ReactNode
}

/** Agrupa campos relacionados bajo una leyenda (`<fieldset>` + `<legend>`). */
export function Fieldset({
  legend,
  description,
  error,
  required,
  indicator: indicatorProp,
  optionalLabel: optionalLabelProp,
  legendSize = 'md',
  hideLegend = false,
  className,
  children,
  'aria-describedby': ariaDescribedBy,
  role,
  ...props
}: FieldsetProps) {
  const id = useId()
  const { indicator, optionalLabel } = useIndicator(indicatorProp, optionalLabelProp)
  const invalid = hasContent(error)
  const descriptionId = hasContent(description) ? `${id}-description` : undefined
  const errorId = invalid ? `${id}-error` : undefined
  return (
    <fieldset
      className={cx(styles.root, className)}
      data-invalid={invalid || undefined}
      role={role}
      // Con un rol explícito (p. ej. `radiogroup`) el nombre se enlaza a la leyenda de forma explícita.
      aria-labelledby={role ? `${id}-legend` : undefined}
      aria-describedby={joinIds(descriptionId, errorId, ariaDescribedBy)}
      {...props}
    >
      <legend
        id={`${id}-legend`}
        className={cx(styles.legend, hideLegend && vhStyles.root)}
        data-size={legendSize}
      >
        <LabelText required={required} indicator={indicator} optionalLabel={optionalLabel}>
          {legend}
        </LabelText>
      </legend>
      {(descriptionId || errorId) && (
        <div className={styles.messages}>
          {descriptionId && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
          {errorId && (
            <FieldMessage id={errorId} tone="error">
              {error}
            </FieldMessage>
          )}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </fieldset>
  )
}

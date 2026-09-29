import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../utils/cx'
import styles from './Heading.module.css'

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

export type HeadingProps = ComponentPropsWithRef<'h2'> & {
  /**
   * Nivel semántico (h1–h6). Define la estructura del documento: no te saltes niveles
   * y usa un solo `h1` por página.
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * Tamaño visual, independiente del nivel. Así la jerarquía semántica y la visual
   * pueden diferir sin romper la accesibilidad.
   */
  size?: HeadingSize
  /**
   * `gradient` pinta el texto con el degradado de la marca (del color de texto al de acento,
   * ambos con contraste suficiente). Úsalo en uno o dos titulares por página.
   * @default 'default'
   */
  tone?: 'default' | 'muted' | 'accent' | 'gradient'
  align?: 'start' | 'center' | 'end'
  /** @default 'semibold' */
  weight?: 'medium' | 'semibold' | 'bold'
}

const defaultSize: Record<number, HeadingSize> = {
  1: '5xl',
  2: '4xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
}

/** Titular con tamaño fluido. Separa el nivel semántico (`level`) del tamaño visual (`size`). */
export function Heading({
  level = 2,
  size,
  tone = 'default',
  align,
  weight = 'semibold',
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag
      className={cx(styles.root, className)}
      data-size={size ?? defaultSize[level]}
      data-tone={tone}
      data-align={align}
      data-weight={weight}
      {...props}
    />
  )
}

export type GradientTextProps = ComponentPropsWithRef<'span'>

/**
 * Resalta unas palabras de un titular con el degradado de la marca:
 * `<Heading>Finanzas para <GradientText>crecer</GradientText></Heading>`.
 */
export function GradientText({ className, ...props }: GradientTextProps) {
  return <span className={cx(styles.gradient, className)} {...props} />
}

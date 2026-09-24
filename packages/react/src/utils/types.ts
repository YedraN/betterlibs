import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react'

/**
 * Props de un componente polimórfico: sus props propias + `as` + las props nativas
 * del elemento elegido (sin colisiones).
 */
export type PolymorphicProps<E extends ElementType, P = object> = P & {
  /** Elemento HTML o componente que se renderiza. */
  as?: E
} & Omit<ComponentPropsWithRef<E>, keyof P | 'as'>

/** Pasos de la escala de espaciado (`--bl-space-*`). */
export type Space =
  | '0'
  | '0-5'
  | '1'
  | '1-5'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20'
  | '24'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl'

/** Valor que puede cambiar por breakpoint: `{ base: 1, md: 2, lg: 3 }`. */
export type Responsive<T> = T | ({ base: T } & Partial<Record<Breakpoint, T>>)

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

export type CSSVars = CSSProperties & Record<`--${string}`, string | number | undefined>

export const spaceVar = (value: Space | undefined) =>
  value === undefined ? undefined : `var(--bl-space-${value})`

/** Convierte un valor responsive en variables CSS `--{name}-{bp}` + atributos `data-{bp}`. */
export function responsiveVars<T>(
  name: string,
  value: Responsive<T> | undefined,
  format: (v: T) => string | number,
): { style: CSSVars; data: Record<string, ''> } {
  const style: CSSVars = {}
  const data: Record<string, ''> = {}
  if (value === undefined) return { style, data }
  if (typeof value === 'object' && value !== null && 'base' in value) {
    for (const [bp, v] of Object.entries(value) as [string, T][]) {
      if (v === undefined) continue
      style[`--${name}-${bp}`] = format(v)
      if (bp !== 'base') data[`data-${bp}`] = ''
    }
  } else {
    style[`--${name}-base`] = format(value as T)
  }
  return { style, data }
}

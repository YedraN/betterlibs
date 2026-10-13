'use client'

import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs/Tabs'
import { type BlockBaseProps, BlockSection } from '../shared'
import styles from './FeatureShowcase.module.css'

export type FeatureShowcaseItem = {
  /** Identificador único y estable. */
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}
export type FeatureShowcaseProps = Omit<BlockBaseProps, 'headingLevel'> & {
  /** Nivel del título de sección; el contenido de cada vista conserva su propia jerarquía. @default 2 */
  headingLevel?: 2 | 3
  items: FeatureShowcaseItem[]
  /** Nombre accesible del selector. */
  selectorLabel: string
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  /** @default 'line' */
  variant?: 'line' | 'pill'
  /** @default 'automatic' */
  activationMode?: 'automatic' | 'manual'
  /** Controles o ayuda antes del selector. */
  children?: ReactNode
}

/** Cambia el panel inmediatamente; solo anima su entrada CSS. No requiere Motion. */
export function FeatureShowcase({
  items,
  selectorLabel,
  defaultValue,
  value,
  onValueChange,
  variant = 'line',
  activationMode = 'automatic',
  children,
  ...props
}: FeatureShowcaseProps) {
  return (
    <BlockSection {...props}>
      {children}
      <Tabs
        variant={variant}
        defaultValue={defaultValue ?? items.find((item) => !item.disabled)?.value}
        value={value}
        onValueChange={onValueChange}
        activationMode={activationMode}
      >
        <TabsList aria-label={selectorLabel}>
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value} className={styles.panel}>
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    </BlockSection>
  )
}

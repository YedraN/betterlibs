'use client'

import { Button, Drawer, DrawerContent, DrawerTrigger } from '@betterlibs/react'
import type { ReactNode } from 'react'
import styles from './Sidebar.module.css'
import { useValue } from './shared'

export type SidebarItem = {
  id: string
  label: string
  href: string
  icon?: ReactNode
  group?: string
  badge?: string
}
export type SidebarProps = {
  label: string
  items: SidebarItem[]
  activeId?: string
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  header?: ReactNode
  footer?: ReactNode
}

export function Sidebar({
  label,
  items,
  activeId,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  header,
  footer,
}: SidebarProps) {
  const [small, setSmall] = useValue(collapsed, defaultCollapsed, onCollapsedChange)
  const [open, setOpen] = useValue<boolean>(undefined, false)
  const links = (compact = false) => (
    <nav aria-label={label} className={styles.links}>
      {items.map((item, index) => (
        <div key={item.id}>
          {!compact && item.group && item.group !== items[index - 1]?.group && (
            <p className={styles.group}>{item.group}</p>
          )}
          <a
            href={item.href}
            aria-current={item.id === activeId ? 'page' : undefined}
            aria-label={compact ? item.label : undefined}
            title={compact ? item.label : undefined}
            className={styles.link}
            onClick={() => setOpen(false)}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            <span className={compact ? styles.hidden : undefined}>{item.label}</span>
            {!compact && item.badge && <span className={styles.badge}>{item.badge}</span>}
            {compact && !item.icon && <span aria-hidden="true">{item.label.slice(0, 1)}</span>}
          </a>
        </div>
      ))}
    </nav>
  )
  return (
    <>
      <aside className={styles.desktop} data-collapsed={small || undefined}>
        {header}
        <Button size="sm" variant="ghost" aria-expanded={!small} onClick={() => setSmall(!small)}>
          {small ? 'Ampliar menú' : 'Plegar menú'}
        </Button>
        {links(small)}
        {footer}
      </aside>
      <div className={styles.mobile}>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">Abrir {label.toLowerCase()}</Button>
          </DrawerTrigger>
          <DrawerContent title={label} side="left">
            {header}
            {links()}
            {footer}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )
}

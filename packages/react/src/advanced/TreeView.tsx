'use client'

import { ChevronDownIcon, ChevronRightIcon } from '@betterlibs/icons'
import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { normalizeSearch, useValue } from './shared'
import styles from './TreeView.module.css'

export type TreeNode = { id: string; label: string; disabled?: boolean; children?: TreeNode[] }
export type TreeViewProps = {
  label: string
  nodes: TreeNode[]
  value?: string
  onValueChange?: (id: string) => void
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onExpandedChange?: (ids: string[]) => void
}

export function TreeView({
  label,
  nodes,
  value,
  onValueChange,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
}: TreeViewProps) {
  const [selected, setSelected] = useValue(value, '', onValueChange)
  const [expanded, setExpanded] = useValue(expandedIds, defaultExpandedIds, onExpandedChange)
  const [focused, setFocused] = useState<string | undefined>(undefined)
  const root = useRef<HTMLUListElement>(null)
  const shouldFocus = useRef(false)
  const id = useId()
  const search = useRef(''),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const visible: { node: TreeNode; parent?: string }[] = []
  const walk = (items: TreeNode[], parent?: string) =>
    items.forEach((node) => {
      visible.push({ node, parent })
      if (expanded.includes(node.id)) walk(node.children ?? [], node.id)
    })
  walk(nodes)
  const enabled = visible.filter(({ node }) => !node.disabled)
  const currentId = enabled.some(({ node }) => node.id === focused)
    ? focused
    : (enabled.find(({ node }) => node.id === selected)?.node.id ?? enabled[0]?.node.id)
  useLayoutEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    const items = [...(root.current?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [])]
    items.find((item) => item.dataset.node === currentId)?.focus()
  }, [currentId])
  const focus = (key?: string) => {
    if (!key) return
    shouldFocus.current = true
    setFocused(key)
  }
  const toggle = (key: string) =>
    setExpanded(
      expanded.includes(key) ? expanded.filter((item) => item !== key) : [...expanded, key],
    )
  const keyboard = (event: KeyboardEvent<HTMLUListElement>) => {
    const key = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')?.dataset
      .node
    const index = enabled.findIndex(({ node }) => node.id === key)
    const item = enabled[index]
    if (!item) return
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    if (event.key === 'ArrowDown') focus(enabled[Math.min(index + 1, enabled.length - 1)]?.node.id)
    else if (event.key === 'ArrowUp') focus(enabled[Math.max(index - 1, 0)]?.node.id)
    else if (event.key === 'Home') focus(enabled[0]?.node.id)
    else if (event.key === 'End') focus(enabled.at(-1)?.node.id)
    else if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) {
      if (item.node.children?.length) {
        if (!expanded.includes(item.node.id)) toggle(item.node.id)
        else focus(item.node.children.find((child) => !child.disabled)?.id)
      }
    } else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) {
      if (expanded.includes(item.node.id)) toggle(item.node.id)
      else focus(item.parent)
    } else if (event.key === 'Enter' || event.key === ' ') setSelected(item.node.id)
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      search.current += normalizeSearch(event.key)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        search.current = ''
      }, 700)
      focus(
        [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)].find(({ node }) =>
          normalizeSearch(node.label).startsWith(search.current),
        )?.node.id,
      )
    } else return
    event.preventDefault()
  }
  const renderNodes = (items: TreeNode[], level = 1) =>
    items.map((node) => {
      const hasChildren = Boolean(node.children?.length),
        open = expanded.includes(node.id)
      const labelId = `${id}-${encodeURIComponent(node.id)}`
      return (
        <li
          key={node.id}
          role="treeitem"
          aria-labelledby={labelId}
          aria-expanded={hasChildren ? open : undefined}
          aria-selected={selected === node.id}
          aria-disabled={node.disabled || undefined}
          tabIndex={currentId === node.id ? 0 : -1}
          data-node={node.id}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setFocused(node.id)
          }}
          onClick={(event) => {
            event.stopPropagation()
            if (!node.disabled) setSelected(node.id)
          }}
        >
          <div
            className={styles.row}
            style={{ paddingInlineStart: `calc(${level - 1} * var(--bl-space-4))` }}
          >
            {hasChildren ? (
              <button
                type="button"
                tabIndex={-1}
                aria-label={`${open ? 'Plegar' : 'Expandir'} ${node.label}`}
                onClick={(event) => {
                  event.stopPropagation()
                  toggle(node.id)
                  focus(node.id)
                }}
              >
                {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </button>
            ) : (
              <span className={styles.spacer} />
            )}
            <span id={labelId}>{node.label}</span>
          </div>
          {open && hasChildren && (
            <ul role="group">{renderNodes(node.children ?? [], level + 1)}</ul>
          )}
        </li>
      )
    })
  return (
    <ul ref={root} role="tree" aria-label={label} className={styles.root} onKeyDown={keyboard}>
      {renderNodes(nodes)}
    </ul>
  )
}

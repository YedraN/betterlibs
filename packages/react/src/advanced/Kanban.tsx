'use client'

import { Button, Select } from '@betterlibs/react'
import { useRef, useState } from 'react'
import common from './Advanced.module.css'
import styles from './Kanban.module.css'
import { useValue } from './shared'

export type KanbanCard = { id: string; title: string; description?: string; columnId: string }
export type KanbanColumn = { id: string; title: string; description?: string }
export type KanbanProps = {
  label: string
  columns: KanbanColumn[]
  value?: KanbanCard[]
  defaultValue?: KanbanCard[]
  onValueChange?: (cards: KanbanCard[]) => void
  disabled?: boolean
}

/** Arrastre HTML nativo y controles equivalentes de mover/reordenar para teclado y móvil. */
export function Kanban({
  label,
  columns,
  value,
  defaultValue = [],
  onValueChange,
  disabled,
}: KanbanProps) {
  const [cards, setCards] = useValue(value, defaultValue, onValueChange)
  const [message, setMessage] = useState('')
  const [dragged, setDragged] = useState<string | null>(null)
  const root = useRef<HTMLElement>(null)
  const move = (id: string, columnId: string, beforeId?: string) => {
    if (disabled || beforeId === id || !columns.some((column) => column.id === columnId)) return
    const card = cards.find((item) => item.id === id)
    if (!card) return
    const remaining = cards.filter((item) => item.id !== id)
    const index = beforeId
      ? remaining.findIndex((item) => item.id === beforeId && item.columnId === columnId)
      : -1
    remaining.splice(index >= 0 ? index : remaining.length, 0, { ...card, columnId })
    setCards(remaining)
    setMessage(`${card.title} movida a ${columns.find((column) => column.id === columnId)?.title}.`)
    requestAnimationFrame(() =>
      [...(root.current?.querySelectorAll<HTMLElement>('[data-card]') ?? [])]
        .find((element) => element.dataset.card === id)
        ?.querySelector<HTMLSelectElement>('select')
        ?.focus(),
    )
  }
  return (
    <section ref={root} aria-label={label} className={common.column}>
      <div className={styles.board}>
        {columns.map((column) => {
          const items = cards.filter((card) => card.columnId === column.id)
          return (
            <section
              key={column.id}
              aria-label={column.title}
              className={styles.column}
              onDragOver={(event) => {
                if (dragged && !disabled) event.preventDefault()
              }}
              onDrop={(event) => {
                if (dragged) {
                  event.preventDefault()
                  move(dragged, column.id)
                  setDragged(null)
                }
              }}
            >
              <div className={common.row}>
                <h3>{column.title}</h3>
                <span className={common.muted}>{items.length}</span>
              </div>
              {column.description && <p className={common.muted}>{column.description}</p>}
              {items.length === 0 && (
                <p className={styles.empty}>Mueve aquí una tarjeta para empezar.</p>
              )}
              {items.map((card, index) => (
                <article
                  key={card.id}
                  data-card={card.id}
                  className={styles.card}
                  draggable={!disabled}
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', card.id)
                    event.dataTransfer.effectAllowed = 'move'
                    setDragged(card.id)
                  }}
                  onDragEnd={() => setDragged(null)}
                  onDragOver={(event) => {
                    if (dragged && !disabled) event.preventDefault()
                  }}
                  onDrop={(event) => {
                    if (dragged) {
                      event.preventDefault()
                      event.stopPropagation()
                      move(dragged, column.id, card.id)
                      setDragged(null)
                    }
                  }}
                >
                  <strong>{card.title}</strong>
                  {card.description && <p className={common.muted}>{card.description}</p>}
                  <Select
                    standalone
                    size="sm"
                    aria-label={`Mover ${card.title}`}
                    value={card.columnId}
                    disabled={disabled}
                    onChange={(event) => move(card.id, event.target.value)}
                  >
                    {columns.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </Select>
                  <div className={common.row}>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Subir ${card.title}`}
                      disabled={disabled || index === 0}
                      onClick={() => move(card.id, column.id, items[index - 1]?.id)}
                    >
                      Subir
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Bajar ${card.title}`}
                      disabled={disabled || index === items.length - 1}
                      onClick={() => move(card.id, column.id, items[index + 2]?.id)}
                    >
                      Bajar
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          )
        })}
      </div>
      <p role="status" className={common.muted}>
        {message}
      </p>
    </section>
  )
}

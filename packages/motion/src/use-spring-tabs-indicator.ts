'use client'

import { type RefObject, useLayoutEffect } from 'react'
import { loadPositionEngine } from './position-loader'
import { useMotionPreferences } from './preferences'
import type { LayoutTransitionOptions } from './use-layout-transition'

/** Optional adapter for the existing @betterlibs/react TabsList. No wrappers or Radix changes. */
export function useSpringTabsIndicator<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { spring = 'snappy' }: LayoutTransitionOptions = {},
) {
  const { enabled } = useMotionPreferences()
  useLayoutEffect(() => {
    const list = ref.current
    const indicator = list?.querySelector<HTMLElement>('.bl-tabs-indicator')
    if (!list || !indicator) return
    const original = {
      transform: indicator.style.transform,
      transition: indicator.style.transition,
    }
    indicator.style.transition = 'none'
    let cancel = () => {}
    let disposed = false
    let target = ''
    const update = (animate: boolean) => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
      if (!active) {
        cancel()
        return
      }
      const root = list.closest('[data-variant]')
      const line = root?.getAttribute('data-variant') === 'line'
      const vertical = root?.getAttribute('data-orientation') === 'vertical'
      const x = active.offsetLeft + (line && vertical ? active.offsetWidth - 2 : 0)
      const y = active.offsetTop + (line && !vertical ? active.offsetHeight - 2 : 0)
      const next = `translate(${x}px, ${y}px)`
      if (next === target) return
      const from = target ? getComputedStyle(indicator).transform : next
      cancel()
      target = next
      indicator.style.transform = next
      if (!animate || !enabled || !indicator.animate || from === next) return
      let settled = false
      let stop = () => {}
      indicator.style.transform = from
      cancel = () => {
        if (settled) return
        settled = true
        stop()
        indicator.style.transform = target
      }
      const finish = cancel
      void loadPositionEngine()
        .then(({ animatePosition }) => {
          if (settled || disposed || !indicator.isConnected) return
          indicator.style.transform = next
          const controls = animatePosition(indicator, from, spring, next)
          stop = () => controls.cancel()
          void controls.then(finish, finish)
        })
        .catch(finish)
    }
    update(false)
    const resize =
      typeof ResizeObserver === 'function' ? new ResizeObserver(() => update(false)) : undefined
    const mutations = new MutationObserver(() => {
      for (const tab of list.querySelectorAll('[role="tab"]')) resize?.observe(tab)
      update(true)
    })
    mutations.observe(list, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-state'],
    })
    const root = list.closest('[data-variant]')
    if (root)
      mutations.observe(root, {
        attributes: true,
        attributeFilter: ['data-orientation', 'data-variant'],
      })
    resize?.observe(list)
    for (const tab of list.querySelectorAll('[role="tab"]')) resize?.observe(tab)
    return () => {
      disposed = true
      cancel()
      mutations.disconnect()
      resize?.disconnect()
      Object.assign(indicator.style, original)
    }
  }, [ref, enabled, spring])
}

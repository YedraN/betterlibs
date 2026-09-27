import type { Ref, RefCallback } from 'react'

/** Combina varias refs (la del usuario y una interna) en una sola ref callback. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    const cleanups: (() => void)[] = []
    for (const ref of refs) {
      if (typeof ref === 'function') {
        const cleanup = ref(node)
        cleanups.push(typeof cleanup === 'function' ? cleanup : () => ref(null))
      } else if (ref) {
        ref.current = node
        cleanups.push(() => {
          ref.current = null
        })
      }
    }
    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }
}

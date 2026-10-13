import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { getSnapshot, toast } from './store'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  toast.dismiss()
  vi.runAllTimers()
  vi.useRealTimers()
})

it('conserva una notificación actualizada con el mismo id durante la salida', () => {
  toast({ id: 'upload', title: 'Subiendo' })
  toast.dismiss('upload')
  toast({ id: 'upload', title: 'Completado' })
  vi.advanceTimersByTime(400)
  expect(getSnapshot().find((record) => record.id === 'upload')?.title).toBe('Completado')
})

it('una salida anterior no acorta el cierre de la notificación reemplazada', () => {
  toast({ id: 'upload', title: 'Primera' })
  toast.dismiss('upload')
  vi.advanceTimersByTime(200)
  toast({ id: 'upload', title: 'Segunda' })
  toast.dismiss('upload')
  vi.advanceTimersByTime(200)
  expect(getSnapshot().some((record) => record.id === 'upload')).toBe(true)
  vi.advanceTimersByTime(200)
  expect(getSnapshot().some((record) => record.id === 'upload')).toBe(false)
})

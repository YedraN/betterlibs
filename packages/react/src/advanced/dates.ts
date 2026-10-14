export type DateSelection = { start: string; end?: string }
export const dateKey = (date: Date) =>
  `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
export function parseDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = new Date(`${value}T12:00:00`)
  return !Number.isNaN(date.getTime()) && dateKey(date) === value ? date : undefined
}
export function shiftDate(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}
export function shiftMonth(date: Date, months: number) {
  const next = new Date(date.getFullYear(), date.getMonth() + months, 1, 12)
  next.setDate(
    Math.min(date.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()),
  )
  return next
}

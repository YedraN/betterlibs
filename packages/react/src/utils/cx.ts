type ClassValue = string | false | null | undefined

/** Une clases ignorando valores vacíos. */
export function cx(...classes: ClassValue[]): string | undefined {
  const result = classes.filter(Boolean).join(' ')
  return result || undefined
}

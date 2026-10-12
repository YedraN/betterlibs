'use client'

import type { ComponentPropsWithRef } from 'react'

/** Mantiene el foco y bloquea también la acción nativa de un submit mientras carga. */
export function ButtonControl({
  loading,
  onClick,
  ...props
}: ComponentPropsWithRef<'button'> & { loading?: boolean }) {
  return <button {...props} onClick={loading ? (event) => event.preventDefault() : onClick} />
}

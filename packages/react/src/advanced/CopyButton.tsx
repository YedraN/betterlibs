'use client'

import { CopyIcon } from '@betterlibs/icons'
import { Button } from '@betterlibs/react'
import { useEffect, useRef, useState } from 'react'
import common from './Advanced.module.css'

export type CopyButtonProps = {
  text: string
  label?: string
  onCopy?: () => void
  disabled?: boolean
}

export function CopyButton({ text, label = 'Copiar', onCopy, disabled }: CopyButtonProps) {
  const [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  const copy = async () => {
    if (busy) return
    setBusy(true)
    try {
      await navigator.clipboard.writeText(text)
      if (mounted.current) {
        setStatus('Copiado.')
        onCopy?.()
      }
    } catch {
      if (mounted.current) setStatus('No se pudo copiar. Selecciona el texto y cópialo.')
    } finally {
      if (mounted.current) setBusy(false)
    }
  }
  return (
    <span className={common.column}>
      <Button
        size="sm"
        type="button"
        variant="outline"
        iconStart={<CopyIcon />}
        disabled={disabled}
        loading={busy}
        onClick={copy}
      >
        {label}
      </Button>
      <span role="status" className={common.muted}>
        {status}
      </span>
    </span>
  )
}

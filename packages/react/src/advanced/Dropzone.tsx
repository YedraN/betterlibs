'use client'

import { CloseIcon, UploadIcon } from '@betterlibs/icons'
import { Button, formatFileSize, IconButton } from '@betterlibs/react'
import { useEffect, useRef, useState } from 'react'
import common from './Advanced.module.css'
import styles from './Dropzone.module.css'
import { useValue } from './shared'

export const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`
export type DropzoneProps = {
  label: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxBytes?: number
  disabled?: boolean
  value?: File[]
  onFilesChange?: (files: File[]) => void
  /** La aplicación realiza la subida y debe respetar la señal de cancelación. */
  onUpload?: (files: File[], signal: AbortSignal) => Promise<void>
  /** Progreso 0–100 por fileKey; no se simula tráfico ni progreso en la librería. */
  progress?: Record<string, number>
}

export function Dropzone({
  label,
  accept,
  multiple = true,
  maxFiles = 10,
  maxBytes = 10 * 1024 * 1024,
  disabled,
  value,
  onFilesChange,
  onUpload,
  progress,
}: DropzoneProps) {
  const [files, setFiles] = useValue(value, [], onFilesChange)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const input = useRef<HTMLInputElement>(null)
  const upload = useRef<AbortController | null>(null)
  useEffect(() => () => upload.current?.abort(), [])
  useEffect(() => {
    const next: Record<string, string> = {}
    for (const file of files)
      if (file.type.startsWith('image/') && URL.createObjectURL)
        next[fileKey(file)] = URL.createObjectURL(file)
    setPreviews(next)
    return () => {
      for (const url of Object.values(next)) URL.revokeObjectURL(url)
    }
  }, [files])
  const add = (incoming: File[]) => {
    if (disabled || busy) return
    const types =
      accept
        ?.split(',')
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean) ?? []
    const rejected: string[] = []
    const accepted = incoming.filter((file) => {
      const matches =
        !types.length ||
        types.some((type) =>
          type.startsWith('.')
            ? file.name.toLowerCase().endsWith(type)
            : type.endsWith('/*')
              ? file.type.startsWith(type.slice(0, -1))
              : file.type === type,
        )
      if (!matches || file.size > maxBytes) {
        rejected.push(
          `${file.name}: ${!matches ? 'formato no admitido' : `supera ${formatFileSize(maxBytes)}`}`,
        )
        return false
      }
      return true
    })
    const next = [
      ...new Map(
        [...(multiple ? files : []), ...accepted].map((file) => [fileKey(file), file]),
      ).values(),
    ]
    const limit = multiple ? maxFiles : 1
    if (next.length > limit) rejected.push(`Se admiten como máximo ${limit} archivos.`)
    setFiles(next.slice(0, limit))
    setError(rejected.join('. '))
    setStatus(`${Math.min(next.length, limit)} archivos preparados.`)
    if (input.current) input.current.value = ''
  }
  const send = async () => {
    if (!onUpload || upload.current || !files.length) return
    const controller = new AbortController()
    upload.current = controller
    setBusy(true)
    setError('')
    try {
      await onUpload(files, controller.signal)
      if (!controller.signal.aborted) setStatus('Subida completada.')
    } catch {
      if (!controller.signal.aborted)
        setError('No se pudieron subir los archivos. Vuelve a intentar.')
    } finally {
      if (upload.current === controller) {
        upload.current = null
        setBusy(false)
      }
    }
  }
  return (
    <section className={common.column} aria-label={label}>
      <div
        className={styles.zone}
        data-dragging={dragging || undefined}
        data-disabled={disabled || busy || undefined}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes('Files')) {
            event.preventDefault()
            if (!disabled && !busy) setDragging(true)
          }
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          add(Array.from(event.dataTransfer.files))
        }}
      >
        <UploadIcon aria-hidden="true" />
        <strong>{label}</strong>
        <span className={common.muted}>
          Arrastra archivos o selecciónalos desde tu dispositivo.
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || busy}
          onClick={() => input.current?.click()}
        >
          Seleccionar archivos
        </Button>
        <input
          ref={input}
          type="file"
          tabIndex={-1}
          aria-label={label}
          className={common.sr}
          accept={accept}
          multiple={multiple}
          disabled={disabled || busy}
          onChange={(event) => add(Array.from(event.target.files ?? []))}
        />
        <span className={common.muted}>
          Máximo {multiple ? maxFiles : 1} archivos de {formatFileSize(maxBytes)} cada uno.
        </span>
      </div>
      {files.length > 0 && (
        <ul className={styles.files}>
          {files.map((file) => (
            <li key={fileKey(file)}>
              {previews[fileKey(file)] && (
                <img
                  src={previews[fileKey(file)]}
                  alt={`Vista previa de ${file.name}`}
                  className={styles.preview}
                />
              )}
              <div className={common.grow}>
                <strong>{file.name}</strong>
                <span className={common.muted}>{formatFileSize(file.size)}</span>
                {progress?.[fileKey(file)] !== undefined && (
                  <progress
                    aria-label={`Subida de ${file.name}`}
                    max={100}
                    value={Math.max(0, Math.min(100, progress[fileKey(file)] ?? 0))}
                  />
                )}
              </div>
              <IconButton
                label={`Quitar ${file.name}`}
                variant="ghost"
                disabled={disabled || busy}
                onClick={() => {
                  setFiles(files.filter((item) => fileKey(item) !== fileKey(file)))
                  setError('')
                }}
              >
                <CloseIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className={common.error}>
          {error}
        </p>
      )}
      <p role="status" className={common.muted}>
        {status}
      </p>
      {onUpload && (
        <div className={common.row}>
          <Button disabled={disabled || !files.length} loading={busy} onClick={send}>
            Subir archivos
          </Button>
          {busy && (
            <Button
              variant="outline"
              onClick={() => {
                upload.current?.abort()
                upload.current = null
                setBusy(false)
                setStatus('Subida cancelada.')
              }}
            >
              Cancelar subida
            </Button>
          )}
        </div>
      )}
    </section>
  )
}

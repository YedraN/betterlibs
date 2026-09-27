'use client'

import { CloseIcon, FileTextIcon, UploadIcon } from '@betterlibs/icons'
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import { cx } from '../../utils/cx'
import { mergeRefs } from '../../utils/merge-refs'
import { useFieldControl } from '../Field/use-field-control'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import styles from './FileInput.module.css'

export type FileInputProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size'> & {
  /** Marca el campo con error. Dentro de un `Field` se deduce de su `error`. */
  invalid?: boolean
  /** Texto principal de la zona. @default 'Selecciona un archivo' (o 'archivos' con `multiple`) */
  buttonLabel?: ReactNode
  /** Texto secundario. @default 'o arrástralo aquí' (o 'arrástralos' con `multiple`) */
  dropLabel?: ReactNode
  /** Callback con la lista de archivos tras elegir o quitar alguno. */
  onFilesChange?: (files: File[]) => void
  /** Nombre accesible del botón para quitar un archivo. @default (name) => `Quitar ${name}` */
  removeLabel?: (fileName: string) => string
  /** Anuncio para lectores de pantalla tras elegir archivos. */
  selectedLabel?: (files: File[]) => string
}

const sizeFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 1 })

/** Tamaño legible: «820 KB», «1,4 MB». */
export function formatFileSize(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${sizeFormat.format(value)} ${units[unit]}`
}

function defaultSelectedLabel(files: File[]) {
  if (files.length === 0) return 'No hay archivos seleccionados.'
  if (files.length === 1) return `Archivo seleccionado: ${files[0]?.name}.`
  return `${files.length} archivos seleccionados.`
}

/**
 * Selector de archivos con zona para arrastrar y lista de archivos elegidos (con tamaño y
 * botón para quitarlos). Es un `<input type="file">` nativo: funciona con formularios normales
 * y con el teclado. Indica en la ayuda del `Field` los formatos y el tamaño máximo.
 */
export function FileInput({
  invalid: invalidProp,
  multiple,
  buttonLabel = multiple ? 'Selecciona archivos' : 'Selecciona un archivo',
  dropLabel = multiple ? 'o arrástralos aquí' : 'o arrástralo aquí',
  onFilesChange,
  removeLabel = (name) => `Quitar ${name}`,
  selectedLabel = defaultSelectedLabel,
  onChange,
  className,
  style,
  ref,
  id,
  name,
  required,
  disabled,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const { invalid, success, controlProps } = useFieldControl({
    id,
    name,
    required,
    disabled,
    invalid: invalidProp,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
  })

  const update = (next: File[]) => {
    setFiles(next)
    setAnnouncement(selectedLabel(next))
    onFilesChange?.(next)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDragging(false)
    onChange?.(event)
    update(Array.from(event.target.files ?? []))
  }

  const remove = (index: number) => {
    const input = inputRef.current
    if (!input) return
    const next = files.filter((_, i) => i !== index)
    // `DataTransfer` permite rehacer la lista del input; sin él, se vacía entera.
    try {
      const transfer = new DataTransfer()
      for (const file of next) transfer.items.add(file)
      input.files = transfer.files
      update(next)
    } catch {
      input.value = ''
      update([])
    }
    input.focus()
  }

  return (
    <div className={cx(styles.root, className)} style={style}>
      <div
        className={styles.zone}
        data-dragging={dragging || undefined}
        data-invalid={invalid || undefined}
        data-success={success || undefined}
        data-disabled={controlProps.disabled || undefined}
      >
        <input
          ref={mergeRefs(inputRef, ref)}
          type="file"
          multiple={multiple}
          className={styles.input}
          onChange={handleChange}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          {...controlProps}
          {...props}
        />
        <UploadIcon className={styles.icon} aria-hidden="true" />
        <span className={styles.text} aria-hidden="true">
          <span className={styles.button}>{buttonLabel}</span> {dropLabel}
        </span>
      </div>
      {files.length > 0 && (
        <ul className={styles.files}>
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.file}>
              <FileTextIcon className={styles.fileIcon} aria-hidden="true" />
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
              <button
                type="button"
                className={styles.remove}
                aria-label={removeLabel(file.name)}
                disabled={controlProps.disabled}
                onClick={() => remove(index)}
              >
                <CloseIcon aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <VisuallyHidden aria-live="polite">{announcement}</VisuallyHidden>
    </div>
  )
}

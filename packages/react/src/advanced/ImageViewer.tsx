'use client'

import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon } from '@betterlibs/icons'
import { Button, Dialog, DialogContent, DialogTrigger, IconButton } from '@betterlibs/react'
import { useRef, useState } from 'react'
import styles from './ImageViewer.module.css'

export type ViewerImage = {
  id: string
  src: string
  alt: string
  caption?: string
  thumbnail?: string
}
export type ImageViewerProps = { label: string; images: ViewerImage[] }

/** Visor modal con zoom, controles de navegación y alternativa completa para cada imagen. */
export function ImageViewer({ label, images }: ImageViewerProps) {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0),
    [zoom, setZoom] = useState(1)
  const [failed, setFailed] = useState<string | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const image = images[Math.min(index, images.length - 1)]
  const move = (direction: number) => {
    setIndex((index + direction + images.length) % images.length)
    setZoom(1)
  }
  if (!image) return <p>No hay imágenes para mostrar.</p>
  return (
    <div className={styles.root}>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          setZoom(1)
        }}
      >
        <div className={styles.thumbnails}>
          {images.map((item, position) => (
            <DialogTrigger key={item.id} asChild>
              <button
                type="button"
                aria-label={`Ampliar ${item.alt}`}
                onClick={(event) => {
                  trigger.current = event.currentTarget
                  setIndex(position)
                }}
              >
                <img src={item.thumbnail ?? item.src} alt={item.alt} loading="lazy" />
              </button>
            </DialogTrigger>
          ))}
        </div>
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            trigger.current?.focus()
          }}
          title={label}
          size="xl"
          onKeyDown={(event) => {
            if ((event.target as HTMLElement).closest('input, textarea, select')) return
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              move(event.key === 'ArrowRight' ? 1 : -1)
            }
          }}
        >
          <div className={styles.toolbar}>
            <IconButton
              label="Imagen anterior"
              variant="outline"
              disabled={images.length < 2}
              onClick={() => move(-1)}
            >
              <ChevronLeftIcon />
            </IconButton>
            <span role="status">
              {index + 1} de {images.length}
            </span>
            <IconButton
              label="Imagen siguiente"
              variant="outline"
              disabled={images.length < 2}
              onClick={() => move(1)}
            >
              <ChevronRightIcon />
            </IconButton>
            <IconButton
              label="Alejar imagen"
              variant="ghost"
              disabled={zoom <= 1}
              onClick={() => setZoom(Math.max(1, zoom - 0.5))}
            >
              <MinusIcon />
            </IconButton>
            <IconButton
              label="Ampliar imagen"
              variant="ghost"
              disabled={zoom >= 3}
              onClick={() => setZoom(Math.min(3, zoom + 0.5))}
            >
              <PlusIcon />
            </IconButton>
            <Button size="sm" variant="ghost" onClick={() => setZoom(1)}>
              Restablecer zoom
            </Button>
          </div>
          <div
            className={styles.viewport}
            tabIndex={0}
            aria-label="Imagen ampliada, desplazable con teclado"
          >
            {failed === image.id ? (
              <p role="alert">No se pudo cargar la imagen. {image.alt}</p>
            ) : (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                style={{ inlineSize: `${zoom * 100}%` }}
                onError={() => setFailed(image.id)}
              />
            )}
          </div>
          {image.caption && <p className={styles.caption}>{image.caption}</p>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { PauseIcon, PlayIcon } from '@betterlibs/icons'
import { useEffect, useRef, useState } from 'react'
import { IconButton } from '../../components/IconButton/IconButton'
import { usePrefersReducedMotion } from '../../utils/use-reduced-motion'
import styles from './Hero.module.css'

export type HeroVideoProps = {
  src: string
  /** Imagen que se muestra mientras carga o si no se reproduce. */
  poster?: string
  /** @default 'video/mp4' */
  type?: string
  /** @default 'Pausar el vídeo de fondo' */
  pauseLabel?: string
  /** @default 'Reproducir el vídeo de fondo' */
  playLabel?: string
}

/**
 * Vídeo decorativo de fondo: silenciado, en bucle y con botón de pausa (WCAG 2.2.2). No se
 * reproduce solo si el usuario ha pedido reducir el movimiento.
 */
export function HeroVideo({
  src,
  poster,
  type = 'video/mp4',
  pauseLabel = 'Pausar el vídeo de fondo',
  playLabel = 'Reproducir el vídeo de fondo',
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reducedMotion) {
      video.pause()
      setPlaying(false)
      return
    }
    video
      .play?.()
      ?.then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [reducedMotion])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (playing) {
      video.pause()
      setPlaying(false)
    } else {
      video
        .play?.()
        ?.then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={src} type={type} />
      </video>
      <IconButton
        label={playing ? pauseLabel : playLabel}
        shape="circle"
        size="sm"
        variant="secondary"
        className={styles.videoToggle}
        onClick={toggle}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
    </>
  )
}

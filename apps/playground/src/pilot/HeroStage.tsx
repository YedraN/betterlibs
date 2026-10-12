import { ArrowUpRightIcon, CheckIcon, PlayIcon, PlusIcon } from '@betterlibs/icons'
import { type MotionPreset, Presence } from '@betterlibs/motion'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@betterlibs/react'
import { useRef, useState } from 'react'
import styles from './Pilot.module.css'

export function HeroStage({
  enabled,
  play,
}: {
  enabled: boolean
  play: (elements: HTMLElement[], preset?: MotionPreset) => void
}) {
  const [preset, setPreset] = useState<MotionPreset>('rise')
  const [saved, setSaved] = useState(false)
  const preview = useRef<HTMLDivElement>(null)

  const replay = (nextPreset = preset) => {
    const card = preview.current?.querySelector<HTMLElement>('[data-preview-card]')
    if (!card) return
    const elements =
      nextPreset === 'sequence'
        ? [...card.querySelectorAll<HTMLElement>('[data-demo-part]')]
        : [card]
    play(elements, nextPreset)
  }

  return (
    <div className={styles.stage}>
      <div className={styles.stageBar}>
        <span className={styles.stageLabel}>
          <span className={styles.statusDot} /> PLAYGROUND
        </span>
        <span className={styles.mono}>01 — INTERACCIÓN</span>
      </div>
      <Tabs
        value={preset}
        onValueChange={(value) => {
          const next = value as MotionPreset
          setPreset(next)
          // La vista previa permanece montada: las acciones rápidas pueden interrumpir el efecto.
          replay(next)
        }}
        variant="pill"
        className={styles.stageTabs}
      >
        <div className={styles.stageCanvas} ref={preview}>
          <div className={styles.stageCoordinates} aria-hidden="true">
            X: UI
            <br />
            Y: MOTION
          </div>
          <div className={styles.orbitLabel} aria-hidden="true">
            <ArrowUpRightIcon /> tu próxima idea
          </div>
          <div className={styles.previewCard} data-preview-card>
            <div className={styles.previewGraphic} data-demo-part>
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <path
                  d="M80 12 92 48 122 24 116 62 152 60 126 88 154 112 116 112 124 150 92 128 80 164 68 128 36 150 44 112 6 112 34 88 8 60 44 62 38 24 68 48Z"
                  fill="currentColor"
                  transform="translate(0 -8)"
                />
                <circle cx="80" cy="80" r="25" fill="#C7F45A" />
              </svg>
              <span className={styles.graphicLabel}>
                MAKE SOMETHING
                <br />
                FEEL SOMETHING.
              </span>
            </div>
            <div className={styles.previewCopy} data-demo-part>
              <span className={styles.mono}>COLECCIÓN 001</span>
              <h2>
                Tu próxima
                <br />
                gran idea.
              </h2>
            </div>
            <Button
              className={styles.previewButton}
              variant="secondary"
              iconEnd={saved ? <CheckIcon /> : <PlusIcon />}
              aria-pressed={saved}
              data-demo-part
              onClick={() => {
                setSaved((value) => !value)
                if (preview.current) {
                  const card = preview.current.querySelector<HTMLElement>('[data-preview-card]')
                  if (card) play([card], 'press')
                }
              }}
            >
              {saved ? 'Colección guardada' : 'Guardar colección'}
            </Button>
          </div>
          <span className={styles.stageStamp} aria-hidden="true">
            HECHO PARA
            <br />
            EXPLORAR ↗
          </span>
        </div>
        <div className={styles.stageControls}>
          <TabsList aria-label="Tipo de animación" className={styles.presetList}>
            <TabsTrigger value="rise">Entrada</TabsTrigger>
            <TabsTrigger value="sequence">Secuencia</TabsTrigger>
            <TabsTrigger value="press">Respuesta</TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            className={styles.replayButton}
            iconStart={<PlayIcon />}
            onClick={() => replay()}
            disabled={!enabled}
          >
            Reproducir
          </Button>
        </div>
        <div className={styles.stageHint}>
          <TabsContent value="rise">
            Una entrada breve. El contenido llega, la atención se queda.
          </TabsContent>
          <TabsContent value="sequence">
            Una secuencia con ritmo. Cada elemento tiene su momento.
          </TabsContent>
          <TabsContent value="press">
            Una respuesta a tu acción. Prueba a guardar la colección.
          </TabsContent>
          <Presence present={saved}>
            Colección lista. Puedes seguir explorando y cambiar de efecto.
          </Presence>
          {!enabled && <p>Las animaciones están reducidas o desactivadas.</p>}
        </div>
      </Tabs>
    </div>
  )
}

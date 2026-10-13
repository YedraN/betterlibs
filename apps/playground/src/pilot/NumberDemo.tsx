import { AnimatedNumber, useMotionPreferences } from '@betterlibs/motion'
import { Button } from '@betterlibs/react'
import { useState } from 'react'
import styles from './Pilot.module.css'

export function NumberDemo() {
  const [count, setCount] = useState(8)
  const [replay, setReplay] = useState(0)
  const { enabled } = useMotionPreferences()
  return (
    <section className={styles.numberSection} aria-labelledby="number-title">
      <h2 id="number-title">Una colección que crece contigo.</h2>
      <p>Prueba las cifras: añade una pieza, cambia de dirección o repite la entrada.</p>
      <div className={styles.numberRow}>
        <p id="collection-count">
          <AnimatedNumber
            className={styles.numberValue}
            value={count}
            startValue={0}
            replayKey={replay}
            format={{ maximumFractionDigits: 0 }}
          />
          Piezas en tu colección
        </p>
        <p>
          <span className={styles.numberValue}>5</span>Primitivas de movimiento
        </p>
        <p>
          <span className={styles.numberValue}>4</span>Composiciones para tu página
        </p>
      </div>
      <div className={styles.numberActions}>
        <Button variant="outline" onClick={() => setCount((value) => value + 1)}>
          Añadir una pieza
        </Button>
        <Button
          variant="ghost"
          disabled={count === 0}
          onClick={() => setCount((value) => Math.max(0, value - 1))}
        >
          Quitar una pieza
        </Button>
        <Button variant="ghost" disabled={!enabled} onClick={() => setReplay((value) => value + 1)}>
          Repetir cifra
        </Button>
      </div>
    </section>
  )
}

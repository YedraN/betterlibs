import { ArrowRightIcon, CheckIcon, PlusIcon } from '@betterlibs/icons'
import { Button, Card, FeatureShowcase, Field, Input } from '@betterlibs/react'
import { type FormEvent, useState } from 'react'
import styles from './Pilot.module.css'

export function ComponentLab() {
  const [confirmed, setConfirmed] = useState(false)
  const [collected, setCollected] = useState(false)
  const [project, setProject] = useState('Nueva idea')
  const [message, setMessage] = useState('')

  const previewProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(`Tu proyecto «${project.trim()}» está listo para empezar.`)
  }

  return (
    <FeatureShowcase
      className={styles.showcase}
      spacing="none"
      selectorLabel="Componentes de ejemplo"
      defaultValue="buttons"
      items={[
        {
          value: 'buttons',
          label: (
            <>
              Botones <span className={styles.tabNumber}>01</span>
            </>
          ),
          content: (
            <div className={styles.labPanel}>
              <div className={styles.labDescription}>
                <span className={styles.eyebrow}>PEQUEÑOS DETALLES, GRAN DIFERENCIA</span>
                <h3>
                  Un clic.
                  <br />
                  Una respuesta.
                </h3>
                <p>
                  Acciones claras, estados visibles y ese pequeño gesto que hace que todo encaje.
                </p>
                <span className={styles.codeLabel}>Button / primary · outline · ghost</span>
              </div>
              <div className={styles.buttonSample}>
                <div className={styles.sampleHeading}>
                  <span className={styles.mono}>PRUÉBALO</span>
                  <span>↘</span>
                </div>
                <Button
                  size="lg"
                  className={styles.action}
                  iconEnd={confirmed ? <CheckIcon /> : <ArrowRightIcon />}
                  aria-pressed={confirmed}
                  onClick={() => setConfirmed((value) => !value)}
                >
                  {confirmed ? 'Todo listo' : 'Haz que pase'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={styles.action}
                  onClick={() => setConfirmed(false)}
                >
                  Volver a empezar
                </Button>
                <p role="status" className={styles.sampleStatus}>
                  {confirmed
                    ? 'Acción completada. Sigue creando.'
                    : 'Tu próxima acción empieza aquí.'}
                </p>
              </div>
            </div>
          ),
        },
        {
          value: 'cards',
          label: (
            <>
              Tarjetas <span className={styles.tabNumber}>02</span>
            </>
          ),
          content: (
            <div className={styles.labPanel}>
              <div className={styles.labDescription}>
                <span className={styles.eyebrow}>ESPACIO PARA LO QUE IMPORTA</span>
                <h3>
                  Contenido
                  <br />
                  con carácter.
                </h3>
                <p>
                  Una superficie, una buena jerarquía y una acción. Las tarjetas también cuentan
                  historias.
                </p>
                <span className={styles.codeLabel}>Card / outline</span>
              </div>
              <Card as="article" className={styles.sampleCard}>
                <div className={styles.cardArtwork} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.mono}>DISEÑO · COLECCIÓN 002</span>
                <h4>Fuera del molde.</h4>
                <p>Una pequeña selección de grandes ideas.</p>
                <Button
                  variant="outline"
                  className={styles.action}
                  iconEnd={collected ? <CheckIcon /> : <PlusIcon />}
                  aria-pressed={collected}
                  onClick={() => setCollected((value) => !value)}
                >
                  {collected ? 'En tu colección' : 'Añadir a mi colección'}
                </Button>
              </Card>
            </div>
          ),
        },
        {
          value: 'forms',
          label: (
            <>
              Formularios <span className={styles.tabNumber}>03</span>
            </>
          ),
          content: (
            <div className={styles.labPanel}>
              <div className={styles.labDescription}>
                <span className={styles.eyebrow}>MENOS FRICCIÓN, MÁS CLARIDAD</span>
                <h3>
                  Tu idea
                  <br />
                  empieza aquí.
                </h3>
                <p>Etiquetas que ayudan, foco que se ve y respuestas que acompañan cada paso.</p>
                <span className={styles.codeLabel}>Field + Input + Button</span>
              </div>
              <form
                className={styles.formSample}
                aria-label="Probar un formulario"
                onSubmit={previewProject}
              >
                <span className={styles.mono}>DALE UN NOMBRE</span>
                <Field label="Nombre del proyecto" required>
                  <Input
                    value={project}
                    maxLength={60}
                    pattern=".*\S.*"
                    onChange={(event) => {
                      setProject(event.target.value)
                      setMessage('')
                    }}
                  />
                </Field>
                <Button type="submit" className={styles.action} iconEnd={<ArrowRightIcon />}>
                  Previsualizar proyecto
                </Button>
                <p role="status" className={styles.sampleStatus}>
                  {message || 'Prueba el campo y confirma tu idea.'}
                </p>
              </form>
            </div>
          ),
        },
      ]}
    />
  )
}

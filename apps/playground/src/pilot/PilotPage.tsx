import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  MenuIcon,
  SlidersIcon,
} from '@betterlibs/icons'
import {
  type MotionMode,
  MotionProvider,
  Reveal,
  Stagger,
  useMotionAnimation,
  useMotionPreferences,
} from '@betterlibs/motion'
import {
  BentoFeature,
  BentoFeatures,
  Button,
  CTA,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Hero,
  IconButton,
  PortalProvider,
  SkipLink,
} from '@betterlibs/react'
import { useRef, useState } from 'react'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'
import { ComponentLab } from './ComponentLab'
import { HeroStage } from './HeroStage'
import { NumberDemo } from './NumberDemo'
import styles from './Pilot.module.css'

const docsUrl = (import.meta.env.VITE_DOCS_URL || 'http://localhost:3000/docs').replace(/\/$/, '')
const sourceUrl = 'https://github.com/YedraN/betterlibs'

function BrandMark() {
  return (
    <svg className={styles.brandIcon} viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
      <path d="M2 2h10v10H2zM16 2h10v10H16zM2 16h10v10H2zM16 16h10v10H16z" fill="currentColor" />
    </svg>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="m50 0 7 31L79 8l-8 30 29-13-21 25 21 25-29-13 8 30-22-23-7 31-7-31-22 23 8-30L0 75l21-25L0 25l29 13-8-30 22 23Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PilotPage() {
  const [motion, setMotion] = useState<MotionMode>('system')
  return (
    <MotionProvider mode={motion}>
      <PilotContent motion={motion} setMotion={setMotion} />
    </MotionProvider>
  )
}

function PilotContent({
  motion,
  setMotion,
}: {
  motion: MotionMode
  setMotion: (mode: MotionMode) => void
}) {
  usePageTitle('Interfaces que se sienten vivas', 'Betterlibs')
  const pageRef = useRef<HTMLDivElement>(null)
  const pendingAnchor = useRef<string | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system')
  const { enabled, prefersReduced } = useMotionPreferences()
  const { play } = useMotionAnimation()

  return (
    <div
      ref={pageRef}
      className={styles.page}
      data-pilot="editorial"
      data-preset="editorial"
      data-theme={theme === 'system' ? undefined : theme}
      data-motion={motion === 'system' && prefersReduced ? 'reduced' : motion}
    >
      <PortalProvider container={portalContainer}>
        <SkipLink />
        <header className={styles.header}>
          <a href="#" className={styles.brand} aria-label="Betterlibs, ir al inicio">
            <BrandMark />
            <span>
              betterlibs<span className={styles.brandDot}>.</span>
            </span>
          </a>
          <nav className={styles.desktopNav} aria-label="Principal">
            <a href="#componentes">Componentes</a>
            <a href="#movimiento">Movimiento</a>
            <RouterLink href="/plantillas/corporativa">
              Plantillas <ArrowUpRightIcon />
            </RouterLink>
          </nav>
          <div className={styles.headerActions}>
            <a href={sourceUrl} className={styles.sourceLink} aria-label="Betterlibs en GitHub">
              <GitHubIcon />
            </a>
            <Button
              asChild
              className={styles.headerDocs}
              variant="outline"
              iconEnd={<ArrowUpRightIcon />}
            >
              <a href={docsUrl}>Documentación</a>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <IconButton label="Abrir menú" className={styles.menuButton}>
                  <MenuIcon />
                </IconButton>
              </DialogTrigger>
              <DialogContent
                title="Explora Betterlibs"
                description="Componentes, movimiento y páginas para tu próxima idea."
                className={styles.menuPanel}
                onCloseAutoFocus={(event) => {
                  const anchor = pendingAnchor.current
                  pendingAnchor.current = null
                  if (!anchor) return
                  const target = document.querySelector<HTMLElement>(`#${anchor} h2`)
                  if (!target) return
                  event.preventDefault()
                  target.tabIndex = -1
                  target.focus({ preventScroll: true })
                }}
              >
                <nav aria-label="Navegación móvil" className={styles.mobileNav}>
                  <DialogClose asChild>
                    <a
                      href="#componentes"
                      onClick={() => {
                        pendingAnchor.current = 'componentes'
                      }}
                    >
                      Componentes <ArrowRightIcon />
                    </a>
                  </DialogClose>
                  <DialogClose asChild>
                    <a
                      href="#movimiento"
                      onClick={() => {
                        pendingAnchor.current = 'movimiento'
                      }}
                    >
                      Movimiento <ArrowRightIcon />
                    </a>
                  </DialogClose>
                  <DialogClose asChild>
                    <RouterLink href="/plantillas/corporativa">
                      Plantilla corporativa <ArrowUpRightIcon />
                    </RouterLink>
                  </DialogClose>
                  <a href={docsUrl}>
                    Documentación <ArrowUpRightIcon />
                  </a>
                </nav>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <main id="main">
          <Hero
            id="hero"
            variant="editorial"
            className={styles.composedHero}
            title={
              <>
                Interfaces
                <br />
                que se sienten
                <br />
                <span className={styles.highlight}>vivas.</span>
                <Star className={styles.heroStar} />
              </>
            }
            eyebrow={
              <>
                <span className={styles.statusDot} /> UI + MOTION, EN LA MISMA DIRECCIÓN
              </>
            }
            description="Componentes con carácter. Movimiento con intención. Una buena base para hacer que tu próxima web se sienta diferente."
            actions={
              <>
                <Button asChild size="lg" className={styles.action} iconEnd={<ArrowRightIcon />}>
                  <a href="#componentes">Explorar componentes</a>
                </Button>
                <a href="#movimiento" className={styles.textLink}>
                  Verlo en movimiento <ArrowDownIcon />
                </a>
              </>
            }
            media={<HeroStage enabled={enabled} play={play} />}
          >
            <div className={styles.heroFootnote}>
              <span>REACT + TYPESCRIPT</span>
              <span>DISEÑADO PARA PERSONAS</span>
            </div>
          </Hero>
          <div className={styles.manifesto}>
            <span className={styles.mono}>UNA BUENA WEB SE VE. Y SE SIENTE.</span>
            <span>01 / UI</span>
            <span>02 / MOTION</span>
            <span>03 / COMPOSICIÓN</span>
          </div>
          <NumberDemo />
          <BentoFeatures
            id="movimiento"
            className={styles.composedBento}
            title={
              <>
                Más que piezas.
                <br />
                Una forma de crear.
              </>
            }
            description="Del primer botón a la última sección. Un lenguaje que conecta lo que ves con lo que haces."
          >
            <Stagger>
              <Reveal>
                <BentoFeature
                  title="UI con voz propia."
                  tone="brand"
                  description="Tipografía, contraste y espacio. Los detalles que hacen reconocible una interfaz."
                  media={
                    <div className={styles.typeArtwork} aria-hidden="true">
                      <span>Aa</span>
                      <span className={styles.typeTag}>UN POCO DE CARÁCTER.</span>
                    </div>
                  }
                />
              </Reveal>
              <Reveal>
                <BentoFeature
                  title="El ritmo justo."
                  description="Entradas, respuestas y cambios de estado. Cada gesto tiene una razón."
                  media={
                    <div className={styles.motionArtwork} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span className={styles.motionTrack}>→</span>
                    </div>
                  }
                />
              </Reveal>
              <Reveal>
                <BentoFeature
                  title="Se entiende. Se usa."
                  description="Estados claros, foco visible y controles que funcionan también con teclado y tacto."
                  media={
                    <div className={styles.interactionArtwork} aria-hidden="true">
                      <span>Hover ↗</span>
                      <span>
                        Focus <span>↹</span>
                      </span>
                      <span>
                        Pressed <span>✓</span>
                      </span>
                    </div>
                  }
                />
              </Reveal>
              <Reveal>
                <BentoFeature
                  title="De piezas a páginas."
                  description="Secciones que se combinan y composiciones que se adaptan a tu contenido."
                  media={
                    <div className={styles.layoutArtwork} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  }
                />
              </Reveal>
            </Stagger>
          </BentoFeatures>
          <section
            id="componentes"
            className={styles.components}
            aria-labelledby="components-title"
          >
            <Reveal className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>02 — EN TUS MANOS</p>
                <h2 id="components-title">
                  Toca. Cambia.
                  <br />
                  Hazlo tuyo.
                </h2>
              </div>
              <p>
                La mejor forma de entender una interfaz es usarla. Empieza por estos pequeños
                ejemplos.
              </p>
            </Reveal>
            <div
              className={styles.preferences}
              role="group"
              aria-label="Personalizar la vista previa"
            >
              <span className={styles.preferencesTitle}>
                <SlidersIcon aria-hidden="true" /> A TU MANERA
              </span>
              <label htmlFor="pilot-theme">
                Tema
                <select
                  id="pilot-theme"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as typeof theme)}
                >
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
              </label>
              <label htmlFor="pilot-motion">
                Movimiento
                <select
                  id="pilot-motion"
                  value={motion}
                  onChange={(event) => setMotion(event.target.value as MotionMode)}
                >
                  <option value="system">Sistema</option>
                  <option value="reduced">Reducido</option>
                  <option value="off">Desactivado</option>
                </select>
              </label>
              <span className={styles.preferenceNote}>
                {enabled
                  ? 'Un poco de movimiento, con intención.'
                  : 'Misma interfaz. Menos movimiento.'}
              </span>
            </div>
            <ComponentLab />
          </section>
          <section className={styles.templateSection} aria-labelledby="template-title">
            <div className={styles.templatePreview} aria-hidden="true">
              <div className={styles.miniHeader}>
                <span>NORTE.</span>
                <span>ESTRATEGIA ↗</span>
              </div>
              <div className={styles.miniHero}>
                <span>
                  Una buena
                  <br />
                  base cambia
                  <br />
                  <em>todo.</em>
                </span>
                <div>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className={styles.miniFooter}>
                <span>CLARIDAD</span>
                <span>DIRECCIÓN</span>
                <span>RESULTADOS</span>
              </div>
            </div>
            <Reveal className={styles.templateCopy}>
              <p className={styles.eyebrow}>03 — UNA PÁGINA COMPLETA</p>
              <h2 id="template-title">
                Cada proyecto,
                <br />
                su personalidad.
              </h2>
              <p>
                Los mismos componentes pueden contar otra historia. Explora la plantilla corporativa
                y compara su lenguaje con esta página.
              </p>
              <Button
                asChild
                variant="outline"
                className={styles.action}
                iconEnd={<ArrowUpRightIcon />}
              >
                <RouterLink href="/plantillas/corporativa">Explorar plantilla</RouterLink>
              </Button>
              <div className={styles.templateLinks} aria-label="Plantillas editoriales">
                <RouterLink href="/plantillas/producto">Producto ↗</RouterLink>
                <RouterLink href="/plantillas/estudio">Estudio ↗</RouterLink>
                <RouterLink href="/plantillas/articulo">Artículo ↗</RouterLink>
              </div>
            </Reveal>
          </section>
          <CTA
            id="cta"
            className={styles.composedCta}
            panelTone="inverse"
            eyebrow="Tu próxima idea empieza aquí"
            title={
              <>
                Dale forma.
                <br />
                Dale vida.
              </>
            }
            description="Monta tu primera página con componentes, secciones y movimiento opcional."
            actions={
              <Button asChild size="lg" className={styles.action} iconEnd={<ArrowUpRightIcon />}>
                <a href={`${docsUrl}/primeros-pasos/instalacion`}>Ver guía de instalación</a>
              </Button>
            }
          />
        </main>
        <footer className={styles.footer}>
          <a href="#" className={styles.brand} aria-label="Betterlibs, volver al inicio">
            <BrandMark />
            <span>betterlibs.</span>
          </a>
          <span className={styles.footerTagline}>Buenas interfaces. Buenas sensaciones.</span>
          <div>
            <a href={docsUrl}>
              Documentación <ArrowUpRightIcon />
            </a>
            <a href={sourceUrl}>
              GitHub <ArrowUpRightIcon />
            </a>
            <span className={styles.mono}>© 2026 BETTERLIBS</span>
          </div>
        </footer>
        <div ref={setPortalContainer} />
      </PortalProvider>
    </div>
  )
}

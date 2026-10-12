import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  LayoutGridIcon,
  MenuIcon,
  SlidersIcon,
  ZapIcon,
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
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  IconButton,
  PortalProvider,
  SkipLink,
} from '@betterlibs/react'
import { useRef, useState } from 'react'
import { RouterLink } from '../site/router'
import { usePageTitle } from '../site/SiteLayout'
import { ComponentLab } from './ComponentLab'
import { HeroStage } from './HeroStage'
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
          <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.statusDot} /> UI + MOTION, EN LA MISMA DIRECCIÓN
              </p>
              <h1 id="hero-title">
                Interfaces
                <br />
                que se sienten
                <br />
                <span className={styles.highlight}>vivas.</span>
                <Star className={styles.heroStar} />
              </h1>
              <p className={styles.heroDescription}>
                Componentes con carácter. Movimiento con intención. Una buena base para hacer que tu
                próxima web se sienta diferente.
              </p>
              <div className={styles.heroActions}>
                <Button asChild size="lg" className={styles.action} iconEnd={<ArrowRightIcon />}>
                  <a href="#componentes">Explorar componentes</a>
                </Button>
                <a href="#movimiento" className={styles.textLink}>
                  Verlo en movimiento <ArrowDownIcon />
                </a>
              </div>
              <div className={styles.heroFootnote}>
                <span>REACT + TYPESCRIPT</span>
                <span>DISEÑADO PARA PERSONAS</span>
              </div>
            </div>
            <HeroStage enabled={enabled} play={play} />
          </section>
          <div className={styles.manifesto}>
            <span className={styles.mono}>UNA BUENA WEB SE VE. Y SE SIENTE.</span>
            <span>01 / UI</span>
            <span>02 / MOTION</span>
            <span>03 / COMPOSICIÓN</span>
          </div>
          <section
            id="movimiento"
            className={styles.capabilities}
            aria-labelledby="capabilities-title"
          >
            <Reveal className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>01 — EL SISTEMA</p>
                <h2 id="capabilities-title">
                  Más que piezas.
                  <br />
                  Una forma de crear.
                </h2>
              </div>
              <p>
                Del primer botón a la última sección. Un lenguaje que conecta lo que ves con lo que
                haces.
              </p>
            </Reveal>
            <div className={styles.bento}>
              <Stagger>
                <Reveal as="article" className={`${styles.bentoCard} ${styles.typeCard}`}>
                  <div className={styles.bentoTop}>
                    <span className={styles.mono}>01 / IDENTIDAD</span>
                    <ArrowUpRightIcon aria-hidden="true" />
                  </div>
                  <div className={styles.typeArtwork} aria-hidden="true">
                    <span>Aa</span>
                    <span className={styles.typeTag}>UN POCO DE CARÁCTER.</span>
                  </div>
                  <div className={styles.bentoCopy}>
                    <h3>UI con voz propia.</h3>
                    <p>
                      Tipografía, contraste y espacio. Los detalles que hacen reconocible una
                      interfaz.
                    </p>
                  </div>
                </Reveal>
                <Reveal as="article" className={`${styles.bentoCard} ${styles.motionCard}`}>
                  <div className={styles.bentoTop}>
                    <span className={styles.mono}>02 / MOVIMIENTO</span>
                    <ZapIcon aria-hidden="true" />
                  </div>
                  <div className={styles.motionArtwork} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span className={styles.motionTrack}>→</span>
                  </div>
                  <div className={styles.bentoCopy}>
                    <h3>El ritmo justo.</h3>
                    <p>Entradas, respuestas y cambios de estado. Cada gesto tiene una razón.</p>
                  </div>
                </Reveal>
                <Reveal as="article" className={`${styles.bentoCard} ${styles.interactionCard}`}>
                  <div className={styles.bentoTop}>
                    <span className={styles.mono}>03 / INTERACCIÓN</span>
                    <SlidersIcon aria-hidden="true" />
                  </div>
                  <div className={styles.interactionArtwork} aria-hidden="true">
                    <span>Hover ↗</span>
                    <span>
                      Focus <span>↹</span>
                    </span>
                    <span>
                      Pressed <span>✓</span>
                    </span>
                  </div>
                  <div className={styles.bentoCopy}>
                    <h3>Se entiende. Se usa.</h3>
                    <p>
                      Estados claros, foco visible y controles que funcionan también con teclado y
                      tacto.
                    </p>
                  </div>
                </Reveal>
                <Reveal as="article" className={`${styles.bentoCard} ${styles.layoutCard}`}>
                  <div className={styles.bentoTop}>
                    <span className={styles.mono}>04 / COMPOSICIÓN</span>
                    <LayoutGridIcon aria-hidden="true" />
                  </div>
                  <div className={styles.layoutArtwork} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={styles.bentoCopy}>
                    <h3>De piezas a páginas.</h3>
                    <p>Secciones que se combinan y composiciones que se adaptan a tu contenido.</p>
                  </div>
                </Reveal>
              </Stagger>
            </div>
          </section>
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
            </Reveal>
          </section>
          <section className={styles.cta} aria-labelledby="cta-title">
            <div>
              <p className={styles.eyebrow}>TU PRÓXIMA IDEA EMPIEZA AQUÍ</p>
              <h2 id="cta-title">
                Dale forma.
                <br />
                Dale <span>vida.</span>
              </h2>
              <Button asChild size="lg" className={styles.action} iconEnd={<ArrowUpRightIcon />}>
                <a href={`${docsUrl}/primeros-pasos/instalacion`}>Ver guía de instalación</a>
              </Button>
            </div>
            <Star className={styles.ctaStar} />
          </section>
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

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { categories, libraries, type Category, type Library } from "./data";

type IconName =
  | "arrow"
  | "search"
  | "spark"
  | "layers"
  | "github"
  | "close"
  | "external";
const Icon = ({ name, size = 16 }: { name: IconName; size?: number }) => {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    spark: (
      <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    github: (
      <>
        <path d="M15 22v-3.8c0-1 .3-1.7.8-2.2-2.7-.3-5.6-1.3-5.6-6a4.7 4.7 0 0 1 1.2-3.2 4.4 4.4 0 0 1 .1-3.1s1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C23 3.4 24 3.7 24 3.7a4.4 4.4 0 0 1 .1 3.1A4.7 4.7 0 0 1 25.3 10c0 4.7-2.9 5.7-5.6 6 .5.5.9 1.4.9 2.7V22" />
        <path d="M8 17.5c-2.4.7-3.3-1.1-3.3-1.1-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    external: (
      <>
        <path d="M14 5h5v5" />
        <path d="m19 5-9 9" />
        <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
      </>
    ),
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};
function LibraryCard({
  library,
  onSelect,
}: {
  library: Library;
  onSelect: (library: Library) => void;
}) {
  return (
    <article
      className="library-card"
      style={{ "--accent": library.color } as CSSProperties}
    >
      <div className="card-meta">
        <span className="category-dot" />
        {library.category}
        <span className="card-index">
          {String(libraries.indexOf(library) + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="library-symbol">{library.name.slice(0, 1)}</div>
      <h3>{library.name}</h3>
      <p>{library.description}</p>
      <div className="tags">
        {library.tags.slice(0, 2).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <footer>
        <span>
          <b>↓</b>
          {library.downloads}
        </span>
        <span>
          <b>★</b>
          {library.stars}
        </span>
        <button
          onClick={() => onSelect(library)}
          aria-label={"Abrir " + library.name}
        >
          <Icon name="arrow" />
        </button>
      </footer>
    </article>
  );
}
function App() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todas">(
    "Todas",
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"popular" | "az">("popular");
  const [selected, setSelected] = useState<Library | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = libraries.find((item) => item.featured) ?? libraries[0];
  const visibleLibraries = useMemo(
    () =>
      libraries
        .filter(
          (item) =>
            activeCategory === "Todas" || item.category === activeCategory,
        )
        .filter((item) =>
          (
            item.name +
            " " +
            item.description +
            " " +
            item.category +
            " " +
            item.tags.join(" ")
          )
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "popular"
            ? b.weeklyDownloads - a.weeklyDownloads
            : a.name.localeCompare(b.name),
        ),
    [activeCategory, search, sort],
  );
  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && (setSelected(null), setMenuOpen(false));
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <main>
      <header className="site-header">
        <nav className="nav shell">
          <a className="brand" href="#inicio" aria-label="Betterlibs, inicio">
            <span className="brand-mark">
              <Icon name="layers" size={17} />
            </span>
            better<span>libs</span>
          </a>
          <div className={"nav-links " + (menuOpen ? "open" : "")}>
            <a href="#explorar" onClick={() => setMenuOpen(false)}>
              Explorar
            </a>
            <a href="#categorias" onClick={() => setMenuOpen(false)}>
              Categorías
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              Sobre el proyecto
            </a>
          </div>
          <a
            className="nav-cta"
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" /> Añadir librería
          </a>
          <button
            className="menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <Icon name="close" /> : <span>☰</span>}
          </button>
        </nav>
      </header>
      <section className="hero shell" id="inicio">
        <div className="hero-copy">
          <div className="kicker">
            <span /> CURADO PARA CONSTRUIR
          </div>
          <h1>
            El atajo hacia
            <br />
            <em>mejor código.</em>
          </h1>
          <p>
            La selección viva de librerías Node.js que el ecosistema está usando
            para crear productos extraordinarios.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#explorar">
              Explorar el catálogo <Icon name="arrow" />
            </a>
            <a className="button-text" href="#about">
              Nuestro criterio <span>↘</span>
            </a>
          </div>
          <div className="trust-line">
            <span className="avatar-stack">
              <i>R</i>
              <i>T</i>
              <i>D</i>
            </span>
            <span>
              Elegidas por developers
              <br />
              para developers.
            </span>
          </div>
        </div>
        <button
          className="feature-card"
          onClick={() => setSelected(featured)}
          style={{ "--accent": featured.color } as CSSProperties}
        >
          <div className="feature-glow" />
          <div className="feature-top">
            <span>LIBRERÍA DESTACADA</span>
            <span>↗</span>
          </div>
          <div className="feature-symbol">{featured.name.slice(0, 1)}</div>
          <div>
            <h2>{featured.name}</h2>
            <p>{featured.description}</p>
          </div>
          <div className="feature-bottom">
            <span>
              <b>{featured.downloads}</b> descargas/semana
            </span>
            <span className="feature-arrow">
              <Icon name="arrow" />
            </span>
          </div>
        </button>
      </section>
      <section className="ticker">
        <div>
          <span>TypeScript</span>
          <i>✦</i>
          <span>API Design</span>
          <i>✦</i>
          <span>Developer Experience</span>
          <i>✦</i>
          <span>Open Source</span>
          <i>✦</i>
          <span>TypeScript</span>
          <i>✦</i>
          <span>API Design</span>
          <i>✦</i>
        </div>
      </section>
      <section className="catalog shell" id="explorar">
        <aside className="catalog-intro">
          <span className="section-label">01 / DESCUBRE</span>
          <h2>
            Tu stack,
            <br />
            <em>elevado.</em>
          </h2>
          <p>
            Herramientas que recortan la distancia entre la idea y el código que
            llega a producción.
          </p>
          <div className="catalog-count">
            <strong>
              100<span>+</span>
            </strong>
            <span>
              seleccionadas
              <br />a mano
            </span>
          </div>
        </aside>
        <div className="catalog-content">
          <div className="catalog-toolbar">
            <label className="search">
              <Icon name="search" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar librerías"
                aria-label="Buscar librerías"
              />
              <kbd>⌘ K</kbd>
            </label>
            <label className="sort">
              <span>ORDENAR</span>
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as "popular" | "az")
                }
                aria-label="Ordenar librerías"
              >
                <option value="popular">Populares</option>
                <option value="az">A — Z</option>
              </select>
            </label>
          </div>
          <div className="filters" id="categorias">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="result-heading">
            <span>
              {visibleLibraries.length.toString().padStart(2, "0")} RESULTADOS
            </span>
            <span>Actualizado agosto 2026</span>
          </div>
          <div className="library-grid">
            {visibleLibraries.map((library) => (
              <LibraryCard
                key={library.name}
                library={library}
                onSelect={setSelected}
              />
            ))}
          </div>
          {visibleLibraries.length === 0 && (
            <div className="empty">
              <Icon name="search" size={24} />
              <h3>Sin coincidencias</h3>
              <p>Cambia tu búsqueda o explora todas las categorías.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Todas");
                }}
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="principle" id="about">
        <div className="principle-inner shell">
          <span className="section-label">02 / EL FILTRO</span>
          <div>
            <h2>
              Menos ruido.
              <br />
              <em>Más señal.</em>
            </h2>
            <p>
              Las tendencias pasan; una buena abstracción permanece. Betterlibs
              es el mapa para encontrar herramientas mantenidas, queridas y con
              un diseño de API sobresaliente.
            </p>
            <a className="button-outline" href="#explorar">
              Ver las seleccionadas <Icon name="arrow" />
            </a>
          </div>
          <div className="principle-points">
            <p>
              <Icon name="spark" /> Calidad antes que cantidad
            </p>
            <p>
              <Icon name="layers" /> Código que escala contigo
            </p>
            <p>
              <Icon name="github" /> Open source de verdad
            </p>
          </div>
        </div>
      </section>
      <footer className="footer shell">
        <a className="brand" href="#inicio">
          <span className="brand-mark">
            <Icon name="layers" size={17} />
          </span>
          better<span>libs</span>
        </a>
        <p>El catálogo independiente para el ecosistema Node.js.</p>
        <div>
          <a href="#explorar">Explorar</a>
          <a href="#about">Manifiesto</a>
          <span>© 2026</span>
        </div>
      </footer>
      {selected && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelected(null)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) => event.stopPropagation()}
            style={{ "--accent": selected.color } as CSSProperties}
          >
            <button
              className="close"
              onClick={() => setSelected(null)}
              aria-label="Cerrar"
            >
              <Icon name="close" />
            </button>
            <span className="modal-category">
              <span />
              {selected.category}
            </span>
            <div className="modal-symbol">{selected.name.slice(0, 1)}</div>
            <h2 id="modal-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="tags">
              {selected.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="modal-stats">
              <span>
                <b>{selected.downloads}</b> descargas semanales
              </span>
              <span>
                <b>★ {selected.stars}</b> en GitHub
              </span>
            </div>
            <div className="modal-actions">
              <a
                className="button-primary"
                href={"https://www.npmjs.com/package/" + selected.npm}
                target="_blank"
                rel="noreferrer"
              >
                Ver en npm <Icon name="external" />
              </a>
              <a
                className="button-text"
                href={"https://github.com/" + selected.github}
                target="_blank"
                rel="noreferrer"
              >
                Repositorio <Icon name="external" />
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
export default App;

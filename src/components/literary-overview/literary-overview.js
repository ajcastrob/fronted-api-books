import styles from "./literary-overview.css?inline";

const DECADE_START = 1810;
const DECADE_END = 1890;
const YEAR_MIN = 1800;
const YEAR_MAX = 1900;

const MOVEMENT_MAP = [
  { max: 1830, label: "Romanticismo temprano", cssClass: "romanticism-early" },
  { max: 1850, label: "Romanticismo", cssClass: "romanticism" },
  { max: 1880, label: "Realismo", cssClass: "realism" },
  { max: 1900, label: "Naturalismo", cssClass: "naturalism" },
];

const MOVEMENT_CLASS_MAP = Object.fromEntries(
  MOVEMENT_MAP.map((m) => [m.label, m.cssClass]),
);

const MOVEMENT_RANGE_MAP = Object.fromEntries(
  MOVEMENT_MAP.map((m) => [m.label, `${YEAR_MIN + 1}–${m.max - 1}`]),
);

function getMovement(year) {
  for (const m of MOVEMENT_MAP) {
    if (year < m.max) return m;
  }
  return MOVEMENT_MAP[MOVEMENT_MAP.length - 1];
}

function yearToPercent(year) {
  return ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100;
}

function buildTimelineDecades() {
  const decades = [];
  for (let y = DECADE_START; y <= DECADE_END; y += 10) {
    decades.push({
      year: y,
      percent: yearToPercent(y),
      label: `${y}s`,
    });
  }
  return decades;
}

function countBy(arr, keyFn) {
  const counts = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (key) counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function groupById(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const id = keyFn(item);
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(item);
  }
  return map;
}

function topEntry(counts) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0] ?? ["", 0];
}

const AUTHOR_COUNTRY = {
  "Jane Austen": { country: "Reino Unido", flag: "🇬🇧" },
  "Mary Shelley": { country: "Reino Unido", flag: "🇬🇧" },
  "Stendhal": { country: "Francia", flag: "🇫🇷" },
  "Alexandre Dumas": { country: "Francia", flag: "🇫🇷" },
  "Alexandre Dumas hijo": { country: "Francia", flag: "🇫🇷" },
  "Emily Brontë": { country: "Reino Unido", flag: "🇬🇧" },
  "Charlotte Brontë": { country: "Reino Unido", flag: "🇬🇧" },
  "Gustave Flaubert": { country: "Francia", flag: "🇫🇷" },
  "Herman Melville": { country: "Estados Unidos", flag: "🇺🇸" },
  "Victor Hugo": { country: "Francia", flag: "🇫🇷" },
  "Charles Dickens": { country: "Reino Unido", flag: "🇬🇧" },
  "Fiódor Dostoievski": { country: "Rusia", flag: "🇷🇺" },
  "León Tolstói": { country: "Rusia", flag: "🇷🇺" },
  "Oscar Wilde": { country: "Irlanda", flag: "🇮🇪" },
  "Thomas Hardy": { country: "Reino Unido", flag: "🇬🇧" },
  "Honoré de Balzac": { country: "Francia", flag: "🇫🇷" },
};

function getCountry(author) {
  return AUTHOR_COUNTRY[author] ?? { country: "Desconocido", flag: "📚" };
}

function buildGenreCounts(books) {
  const genreLists = books.flatMap((b) => b.genre ?? []);
  const counts = countBy(genreLists, (g) => g);

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => ({
      genre,
      count,
      percent: Math.round((count / books.length) * 100),
    }));
}

function findMostFrequentConflict(books) {
  const conflicts = books.map((b) => b.conflict).filter(Boolean);
  const counts = countBy(conflicts, (c) => c);
  const [conflict, count] = topEntry(counts);
  return { conflict, count };
}

const template = document.createElement("template");
template.innerHTML = `
  <style>${styles}</style>
  <div class="overview overview--loading" id="overview">
    <section class="panorama-section" id="panorama-section">
      <p class="section-label">Panorama literario</p>
      <div class="panorama">
        <div class="panorama__stats" id="panorama-stats"></div>
        <div class="panorama__countries" id="panorama-countries"></div>
        <div class="panorama__movements" id="panorama-movements"></div>
        <div class="panorama__fact" id="panorama-fact"></div>
      </div>
    </section>
    <section class="timeline-section">
      <p class="section-label">Línea de tiempo</p>
      <div class="timeline" id="timeline">
        <div class="timeline__track" id="track"></div>
        <div class="timeline__bands" id="bands"></div>
      </div>
      <div class="timeline__legend" id="legend"></div>
      <div class="timeline__detail" id="detail"></div>
    </section>
    <section class="genres-section">
      <p class="section-label">Géneros literarios</p>
      <div class="genres" id="genres"></div>
      <div class="conflict-highlight" id="conflict"></div>
    </section>
  </div>
`;

class LiteraryOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._books = [];
    this._activeFilter = null;
    this._activeDot = null;
  }

  setData(books) {
    if (!books?.length) return;

    this._books = books;
    const overview = this.shadowRoot.getElementById("overview");
    overview.classList.remove("overview--loading");

    this._renderTimeline(books);
    this._renderBands();
    this._renderLegend();
    this._renderGenres(books);
    this._renderConflict(books);
    this._renderPanorama(books);
  }

  _renderTimeline(books) {
    const track = this.shadowRoot.getElementById("track");
    const decades = buildTimelineDecades();

    for (const d of decades) {
      const el = document.createElement("div");
      el.className = "timeline__decade";
      el.style.left = `${d.percent}%`;
      el.innerHTML = `
        <span class="timeline__decade-tick"></span>
        <span class="timeline__decade-label">${d.label}</span>
      `;
      track.appendChild(el);
    }

    const sorted = [...books].sort((a, b) => a.year - b.year);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    for (let i = 0; i < sorted.length; i++) {
      const book = sorted[i];
      const movement = getMovement(book.year);
      const dot = document.createElement("div");
      dot.className = `timeline__dot timeline__dot--${movement.cssClass}`;
      dot.style.left = `${yearToPercent(book.year)}%`;
      dot.setAttribute("role", "button");
      dot.setAttribute("tabindex", "0");
      dot.setAttribute(
        "aria-label",
        `${book.name}, ${book.author}, ${book.year}`
      );
      dot.dataset.bookIndex = i;
      dot.dataset.movement = movement.cssClass;

      if (!prefersReducedMotion) {
        dot.style.animationDelay = `${i * 40}ms`;
      }

      const tooltipPosition = yearToPercent(book.year) > 85 ? "left" : "right";
      dot.innerHTML = `
        <div class="timeline__tooltip timeline__tooltip--${tooltipPosition}">
          <p class="timeline__tooltip-title">${book.name}</p>
          <p class="timeline__tooltip-author">${book.author}</p>
          <p class="timeline__tooltip-year">${book.year} · ${movement.label}</p>
        </div>
      `;

      dot.addEventListener("click", () => this._handleDotClick(dot, book));
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this._handleDotClick(dot, book);
        }
      });

      track.appendChild(dot);
    }
  }

  _renderBands() {
    const bands = this.shadowRoot.getElementById("bands");

    for (let i = 0; i < MOVEMENT_MAP.length; i++) {
      const movement = MOVEMENT_MAP[i];
      const prevMax = i === 0 ? YEAR_MIN : MOVEMENT_MAP[i - 1].max;
      const startPercent = yearToPercent(prevMax);
      const endPercent = yearToPercent(movement.max);
      const width = endPercent - startPercent;

      const band = document.createElement("div");
      band.className = `timeline__band timeline__band--${movement.cssClass}`;
      band.style.left = `${startPercent}%`;
      band.style.width = `${width}%`;
      band.setAttribute("aria-hidden", "true");
      bands.appendChild(band);
    }
  }

  _handleDotClick(dot, book) {
    if (this._activeDot === dot) {
      this._clearSelection();
      return;
    }

    this._clearSelection();

    this._activeDot = dot;
    dot.classList.add("timeline__dot--active");

    const movement = getMovement(book.year);
    const detail = this.shadowRoot.getElementById("detail");
    detail.innerHTML = `
      <div class="timeline__detail-card">
        <p class="timeline__detail-title">${book.name}</p>
        <p class="timeline__detail-author">${book.author}</p>
        <div class="timeline__detail-meta">
          <span class="timeline__detail-year">${book.year}</span>
          <span class="timeline__detail-movement">${movement.label}</span>
        </div>
      </div>
    `;

    this.dispatchEvent(
      new CustomEvent("book-select", {
        bubbles: true,
        composed: true,
        detail: { book },
      })
    );
  }

  _clearSelection() {
    if (this._activeDot) {
      this._activeDot.classList.remove("timeline__dot--active");
      this._activeDot = null;
    }
    const detail = this.shadowRoot.getElementById("detail");
    detail.innerHTML = "";
  }

  _renderLegend() {
    const legend = this.shadowRoot.getElementById("legend");

    for (const m of MOVEMENT_MAP) {
      const item = document.createElement("div");
      item.className = "legend-item";
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `Filtrar: ${m.label}`);
      item.dataset.movement = m.cssClass;
      item.innerHTML = `
        <span class="legend-dot legend-dot--${m.cssClass}"></span>
        <span class="legend-label">${m.label}</span>
      `;

      item.addEventListener("click", () => this._handleLegendClick(item, m.cssClass));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this._handleLegendClick(item, m.cssClass);
        }
      });

      legend.appendChild(item);
    }
  }

  _handleLegendClick(item, movementClass) {
    const dots = this.shadowRoot.querySelectorAll(".timeline__dot");

    if (this._activeFilter === movementClass) {
      this._activeFilter = null;
      item.classList.remove("legend-item--active");
      dots.forEach((dot) => {
        dot.classList.remove("timeline__dot--dimmed");
      });
      return;
    }

    this.shadowRoot.querySelectorAll(".legend-item").forEach((el) => {
      el.classList.remove("legend-item--active");
    });
    item.classList.add("legend-item--active");
    this._activeFilter = movementClass;

    dots.forEach((dot) => {
      if (dot.dataset.movement === movementClass) {
        dot.classList.remove("timeline__dot--dimmed");
      } else {
        dot.classList.add("timeline__dot--dimmed");
      }
    });
  }

  _renderGenres(books) {
    const container = this.shadowRoot.getElementById("genres");
    const counts = buildGenreCounts(books);
    const maxCount = counts[0]?.count ?? 1;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    for (const g of counts) {
      const row = document.createElement("div");
      row.className = "genre-row";
      const barWidth = Math.round((g.count / maxCount) * 100);
      row.innerHTML = `
        <span class="genre-label">${g.genre}</span>
        <div class="genre-bar">
          <div class="genre-bar__fill" style="width: 0%;" data-width="${barWidth}%"></div>
        </div>
        <span class="genre-count">${g.count}</span>
      `;
      container.appendChild(row);
    }

    requestAnimationFrame(() => {
      const fills = container.querySelectorAll(".genre-bar__fill");
      fills.forEach((fill, i) => {
        if (!prefersReducedMotion) {
          fill.style.transitionDelay = `${i * 60}ms`;
        }
        fill.style.width = fill.dataset.width;
      });
    });
  }

  _renderConflict(books) {
    const container = this.shadowRoot.getElementById("conflict");
    const { conflict, count } = findMostFrequentConflict(books);
    if (!conflict) return;

    container.innerHTML = `
      <p class="conflict-highlight__label">Conflicto más recurrente</p>
      <p class="conflict-highlight__text">${conflict}</p>
      <p class="conflict-highlight__count">Aparece en ${count} de ${books.length} obras</p>
    `;
  }

  _renderPanorama(books) {
    this._renderPanoramaStats(books);
    this._renderPanoramaCountries(books);
    this._renderPanoramaMovements(books);
    this._renderPanoramaFact(books);
  }

  _renderPanoramaStats(books) {
    const container = this.shadowRoot.getElementById("panorama-stats");
    const years = books.map((b) => b.year).filter(Boolean);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const uniqueAuthors = new Set(books.map((b) => b.author)).size;
    const allGenres = books.flatMap((b) => b.genre ?? []);
    const uniqueGenres = new Set(allGenres).size;

    container.innerHTML = `
      <div class="stat-card">
        <p class="stat-card__value">${books.length}</p>
        <p class="stat-card__label">Obras</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">${minYear}–${maxYear}</p>
        <p class="stat-card__label">Rango temporal</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">${uniqueAuthors}</p>
        <p class="stat-card__label">Autores</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">${uniqueGenres}</p>
        <p class="stat-card__label">Géneros</p>
      </div>
    `;
  }

  _renderPanoramaCountries(books) {
    const container = this.shadowRoot.getElementById("panorama-countries");
    const grouped = groupById(books, (b) => getCountry(b.author).country);
    const sorted = [...grouped.entries()]
      .map(([country, items]) => ({
        country,
        flag: getCountry(items[0].author).flag,
        count: items.length,
      }))
      .sort((a, b) => b.count - a.count);

    for (const { country, flag, count } of sorted) {
      const chip = document.createElement("div");
      chip.className = "country-chip";
      chip.innerHTML = `
        <span class="country-chip__flag">${flag}</span>
        <span class="country-chip__name">${country}</span>
        <span class="country-chip__count">${count}</span>
      `;
      container.appendChild(chip);
    }
  }

  _renderPanoramaMovements(books) {
    const container = this.shadowRoot.getElementById("panorama-movements");
    const movementCounts = countBy(books, (b) => getMovement(b.year).label);
    const sorted = Object.entries(movementCounts).sort((a, b) => b[1] - a[1]);

    for (const [label, count] of sorted) {
      const row = document.createElement("div");
      row.className = "movement-row";
      row.innerHTML = `
        <span class="movement-row__dot movement-row__dot--${MOVEMENT_CLASS_MAP[label]}"></span>
        <span class="movement-row__name">${label}</span>
        <span class="movement-row__range">${MOVEMENT_RANGE_MAP[label] ?? ""}</span>
        <span class="movement-row__count">${count} obras</span>
      `;
      container.appendChild(row);
    }
  }

  _renderPanoramaFact(books) {
    const container = this.shadowRoot.getElementById("panorama-fact");
    const years = books.map((b) => b.year).filter(Boolean);
    const decades = countBy(years, (y) => `${Math.floor(y / 10) * 10}s`);
    const [peakDecade, peakCount] = topEntry(decades);
    const oldest = books.reduce((a, b) => (a.year < b.year ? a : b));
    const newest = books.reduce((a, b) => (a.year > b.year ? a : b));

    container.innerHTML = `
      <p class="panorama__fact-label">Dato curioso</p>
      <p class="panorama__fact-text">
        La década más prolífica fue <strong>${peakDecade}</strong> con ${peakCount} obras.
        La más antigua del catálogo es <strong>${oldest.name}</strong> (${oldest.year})
        y la más reciente <strong>${newest.name}</strong> (${newest.year}),
        separadas por ${newest.year - oldest.year} años de literatura.
      </p>
    `;
  }
}

customElements.define("literary-overview", LiteraryOverview);
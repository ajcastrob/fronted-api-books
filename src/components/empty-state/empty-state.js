import styles from "./empty-state.css?inline";

const suggestions = [
  { title: "Moby Dick", author: "Herman Melville" },
  { title: "Orgullo y prejuicio", author: "Jane Austen" },
  { title: "Cumbres borrascosas", author: "Emily Brontë" },
  { title: "El rojo y el negro", author: "Stendhal" },
  { title: "La Guerra y la paz", author: "León Tolstói" },
  { title: "Frankenstein", author: "Mary Shelley" },
  { title: "La Cartuja de Parma", author: "Stendhal" },
  { title: "Madame Bovary", author: "Gustave Flaubert" },
  { title: "Tess of the d'Urbervilles", author: "Thomas Hardy" },
  { title: "Anna Karenina", author: "León Tolstói" },
  { title: "Notas del subsuelo", author: "Fiódor Dostoievski" },
  { title: "El conde de Montecristo", author: "Alejandro Dumas" },
];

const picked = suggestions.sort(() => Math.random() - 0.5).slice(0, 6);

const chipsHTML = picked
  .map(
    (s) =>
      `<button class="empty-state__chip" data-query="${s.title}" aria-label="Buscar ${s.title}">
        <span class="chip__title">${s.title}</span>
        <span class="chip__author">${s.author}</span>
      </button>`,
  )
  .join("");

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <div class="empty-state__icon" aria-hidden="true">
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 10C24 10 18 6 10 8V38C18 36 24 40 24 40V10Z" />
      <path d="M24 10C24 10 30 6 38 8V38C30 36 24 40 24 40V10Z" />
      <line x1="24" y1="10" x2="24" y2="40" />
    </svg>
  </div>
  <p class="empty-state__title">Busca una novela del XIX</p>
  <p class="empty-state__text">Escribe el título o el autor para descubrir una obra del siglo de la novela</p>
  <p class="empty-state__hint">O prueba con alguna de estas obras:</p>
  <div class="empty-state__suggestions">${chipsHTML}</div>
`;

class EmptyState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (e) => {
      const chip = e.target.closest(".empty-state__chip");
      if (!chip) return;
      const query = chip.dataset.query;
      this.dispatchEvent(
        new CustomEvent("suggest", { bubbles: true, detail: { query } }),
      );
    });
  }
}

customElements.define("empty-state", EmptyState);

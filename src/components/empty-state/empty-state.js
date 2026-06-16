import styles from "./empty-state.css?inline";

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
`;

class EmptyState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("empty-state", EmptyState);
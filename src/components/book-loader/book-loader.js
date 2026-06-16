import styles from "./book-loader.css?inline";

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <div class="ink-loader" role="status" aria-label="Buscando libro">
    <div class="ink-blot"></div>
    <div class="ink-blot"></div>
    <div class="ink-blot"></div>
    <div class="ink-dot"></div>
    <div class="ink-dot"></div>
    <div class="ink-dot"></div>
    <div class="ink-dot"></div>
  </div>
`;

class BookLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("book-loader", BookLoader);
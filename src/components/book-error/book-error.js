import styles from "./book-error.css?inline";

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <div class="error-message">
    <svg class="error-message__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
    <p class="error-message__text"></p>
    <button class="error-message__retry" type="button">Intentar de nuevo</button>
  </div>
`;

class BookError extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._onRetry = this._handleRetry.bind(this);
  }

  static get observedAttributes() {
    return ["message", "hint"];
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector(".error-message__retry")
      .addEventListener("click", this._onRetry);
    this.render();
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector(".error-message__retry")
      .removeEventListener("click", this._onRetry);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.render();
  }

  _handleRetry() {
    this.dispatchEvent(new CustomEvent("retry", { bubbles: true, composed: true }));
  }

  render() {
    const message = this.getAttribute("message") ?? "";
    const hint = this.getAttribute("hint") ?? "";
    const text = hint ? `${message}. ${hint}` : message;
    this.shadowRoot.querySelector(".error-message__text").textContent = text;
  }
}

customElements.define("book-error", BookError);
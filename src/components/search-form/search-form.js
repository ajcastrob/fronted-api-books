import styles from "./search-form.css?inline";

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <form class="form" part="form" aria-label="Búsqueda de novelas del siglo XIX">
    <input
      type="text"
      id="search-input"
      name="name"
      placeholder="Ej: orgullo y prejuicio, frankenstein..."
      required
      autocomplete="off"
      aria-label="Nombre del libro"
    />
    <button type="submit" id="search-submit" aria-label="Buscar libro">
      <span>Buscar</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </button>
  </form>
`;

class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._onSubmit = this._handleSubmit.bind(this);
  }

  connectedCallback() {
    this.form = this.shadowRoot.querySelector(".form");
    this.input = this.shadowRoot.querySelector("#search-input");
    this.submitBtn = this.shadowRoot.querySelector("#search-submit");

    this.form.addEventListener("submit", this._onSubmit);
  }

  disconnectedCallback() {
    this.form.removeEventListener("submit", this._onSubmit);
  }

  _handleSubmit(event) {
    event.preventDefault();
    const query = this.input.value.trim();
    if (!query) return;

    this.dispatchEvent(
      new CustomEvent("search", {
        detail: { query },
        bubbles: true,
        composed: true,
      }),
    );
  }

  getQuery() {
    return this.input?.value.trim() ?? "";
  }

  focusInput() {
    this.input?.focus();
  }

  reset() {
    this.form?.reset();
  }

  setQuery(value) {
    if (this.input) this.input.value = value;
  }

  setSubmitting(isSubmitting) {
    if (!this.submitBtn) return;
    this.submitBtn.classList.toggle("submitting", isSubmitting);
    if (isSubmitting) {
      this.submitBtn.classList.remove("settled");
    }
  }

  setSettled() {
    if (!this.submitBtn) return;
    this.submitBtn.classList.remove("submitting");
    this.submitBtn.classList.add("settled");
  }
}

customElements.define("search-form", SearchForm);
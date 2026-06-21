import styles from "./results-panel.css?inline";
import { mapBookToCardAttrs } from "../../utils/book-mapper";
import "../book-card/book-card";
import "../book-loader/book-loader";
import "../book-error/book-error";
import "../empty-state/empty-state";

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <empty-state id="empty"></empty-state>
  <ul class="results-list" id="list" aria-live="polite" aria-atomic="true"></ul>
  <output class="status-message" id="status" role="status"></output>
`;

class ResultsPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._onRetry = this._handleRetry.bind(this);
  }

  connectedCallback() {
    this.list = this.shadowRoot.querySelector("#list");
    this.empty = this.shadowRoot.querySelector("#empty");
    this.status = this.shadowRoot.querySelector("#status");

    this.list.addEventListener("retry", this._onRetry);
    this.empty.addEventListener("suggest", this._handleSuggest.bind(this));
    this.showEmpty();
  }

  disconnectedCallback() {
    this.list.removeEventListener("retry", this._onRetry);
  }

  _handleRetry() {
    this.dispatchEvent(new CustomEvent("retry", { bubbles: true, composed: true }));
  }

  _handleSuggest(event) {
    this.dispatchEvent(
      new CustomEvent("suggest", {
        bubbles: true,
        composed: true,
        detail: event.detail,
      }),
    );
  }

  showEmpty() {
    this.empty.hidden = false;
    this.list.innerHTML = "";
    this.status.textContent = "";
  }

  showLoading() {
    this.empty.hidden = true;
    this.status.textContent = "";
    this.list.innerHTML = `<li><book-loader></book-loader></li>`;
  }

  showError(message, hint) {
    this.empty.hidden = true;
    this.status.textContent = "";
    this.list.innerHTML = `<li><book-error message="${this._escapeAttr(message)}" hint="${this._escapeAttr(hint)}"></book-error></li>`;
  }

  showBook(book) {
    this.empty.hidden = true;
    this.list.innerHTML = "";

    const li = document.createElement("li");
    li.classList.add("animate-in");

    const card = document.createElement("book-card");
    const attrs = mapBookToCardAttrs(book);
    for (const [key, value] of Object.entries(attrs)) {
      card.setAttribute(key, value);
    }

    li.appendChild(card);
    this.list.appendChild(li);
    
    // Smooth scroll only if not the first result to avoid jumping on initial load
    if (this.list.children.length > 1) {
      li.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  setStatus(text) {
    this.status.textContent = text;
  }

  dismiss() {
    const items = this.list.querySelectorAll("li");
    if (items.length === 0) {
      this.showEmpty();
      return;
    }

    items.forEach((item, i) => {
      item.classList.remove("animate-in");
      item.style.setProperty("--stagger-delay", `${i * 0.04}s`);
      item.classList.add("animate-out");
    });

    const last = items[items.length - 1];
    const handler = () => {
      this.showEmpty();
      last.removeEventListener("animationend", handler);
    };
    last.addEventListener("animationend", handler);
  }

  _escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }
}

customElements.define("results-panel", ResultsPanel);
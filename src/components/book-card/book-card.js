import styles from "./book-card.css?inline";

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <div class="card">
    <div class="cover-section">
      <div class="book-cover">
        <img src="" alt="" loading="lazy" />
      </div>
    </div>
    <div class="content">
      <div class="meta-line">
        <span class="book-year"></span>
        <span class="dot"></span>
        <span class="book-genre">Literatura</span>
        <span class="era-badge" id="era-badge" hidden>XIX</span>
      </div>
      <h2 class="book-title"></h2>
      <p class="book-author"></p>
      <p class="movement-line" id="movement-line"></p>
      <div class="divider" role="presentation" aria-hidden="true"></div>
      <div class="book-description-wrapper">
        <p class="book-description"></p>
      </div>
      <div class="description-footer" hidden>
        <button class="desc-toggle">Leer más</button>
      </div>
    </div>
  </div>
`;

class BookCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._cursorBound = false;
  }

  static get observedAttributes() {
    return ["name", "author", "year", "description", "image", "movement", "era"];
  }

  connectedCallback() {
    this.render();
    const descBtn = this.shadowRoot.querySelector(".desc-toggle");
    const cover = this.shadowRoot.querySelector(".book-cover");

    descBtn.addEventListener("click", this.handleDescToggle);
    cover.addEventListener("click", this.handleCoverClick);

    this._initCursorTracking();
  }

  disconnectedCallback() {
    const descBtn = this.shadowRoot.querySelector(".desc-toggle");
    const cover = this.shadowRoot.querySelector(".book-cover");
    const card = this.shadowRoot.querySelector(".card");

    descBtn.removeEventListener("click", this.handleDescToggle);
    cover.removeEventListener("click", this.handleCoverClick);

    if (card) {
      card.removeEventListener("mousemove", this._onMouseMove);
      card.removeEventListener("mouseleave", this._onMouseLeave);
    }
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.render();
  }

  _initCursorTracking() {
    const card = this.shadowRoot.querySelector(".card");
    const cover = this.shadowRoot.querySelector(".book-cover");

    const mmq = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)");
    if (!mmq.matches) return;
    if (this._cursorBound) return;
    this._cursorBound = true;

    this._onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const shiftX = (x - 0.5) * 6;
      const shiftY = (y - 0.5) * 4;
      cover.style.setProperty("transform", `translate(${shiftX}px, ${shiftY}px) scale(1.01)`);
      cover.classList.add("cursor-track");
    };

    this._onMouseLeave = () => {
      cover.style.removeProperty("transform");
      cover.classList.remove("cursor-track");
    };

    card.addEventListener("mousemove", this._onMouseMove);
    card.addEventListener("mouseleave", this._onMouseLeave);
  }

  handleCoverClick = () => {
    const cover = this.shadowRoot.querySelector(".book-cover");
    cover.classList.remove("pop");
    void cover.offsetWidth;
    cover.classList.add("pop");
  };

  handleDescToggle = () => {
    const wrapper = this.shadowRoot.querySelector(".book-description-wrapper");
    const desc = this.shadowRoot.querySelector(".book-description");
    const btn = this.shadowRoot.querySelector(".desc-toggle");
    const expanded = wrapper.classList.toggle("expanded");
    btn.textContent = expanded ? "Leer menos" : "Leer más";

    if (expanded) {
      wrapper.style.maxHeight = `${desc.scrollHeight}px`;
    } else {
      wrapper.style.maxHeight = "10rem";
    }
  };

  getAttr(name) {
    return this.getAttribute(name) ?? "";
  }

  render() {
    const card = this.shadowRoot.querySelector(".card");
    const img = card.querySelector(".book-cover img");
    const title = card.querySelector(".book-title");
    const author = card.querySelector(".book-author");
    const year = card.querySelector(".book-year");
    const description = card.querySelector(".book-description");
    const descWrapper = card.querySelector(".book-description-wrapper");
    const descFooter = card.querySelector(".description-footer");
    const movementLine = card.querySelector(".movement-line");
    const eraBadge = card.querySelector(".era-badge");

    img.src = this.getAttr("image");
    img.alt = this.getAttr("name");
    img.classList.remove("loaded");

    const onLoad = () => img.classList.add("loaded");
    const onError = () => {
      img.src = "";
      img.alt = "Portada no disponible";
      img.classList.add("loaded");
    };
    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });

    title.textContent = this.getAttr("name");
    author.textContent = this.getAttr("author");
    year.textContent = this.getAttr("year");
    description.textContent = this.getAttr("description");

    const movement = this.getAttr("movement");
    movementLine.textContent = movement;
    movementLine.hidden = !movement;

    eraBadge.hidden = this.getAttr("era") !== "xix";

    const descText = this.getAttr("description");
    descFooter.hidden = descText.length <= 120;

    descWrapper.classList.remove("expanded");
    descWrapper.style.maxHeight = "10rem";
  }
}

customElements.define("book-card", BookCard);
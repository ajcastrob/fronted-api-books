import styles from "./book-card.css?inline";

const template = document.createElement("template");

template.innerHTML = `
  <style>${styles}</style>
  <div class="card">
    <div class="book-cover">
      <img src="" alt="" loading="lazy" />
    </div>
    <div class="content">
      <div class="meta-line">
        <span class="book-folio"></span>
        <span class="book-genre"></span>
      </div>
      <h2 class="book-title"></h2>
      <p class="book-author"></p>
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
    this._assignCorners();
  }

  _assignCorners() {
    // Randomly assign one of two corner patterns
    const pattern = Math.random() > 0.5 ? "corner-tl-br" : "corner-tr-bl";
    this.classList.add(pattern);
  }

  render() {
    const card = this.shadowRoot.querySelector(".card");
    const img = card.querySelector(".book-cover img");
    const title = card.querySelector(".book-title");
    const author = card.querySelector(".book-author");
    const folio = card.querySelector(".book-folio");
    const genre = card.querySelector(".book-genre");

    const imageUrl = this.getAttribute("image");
    img.src = imageUrl || "https://images.unsplash.com/photo-1543004218-ee141104975a?auto=format&w=600&q=80&fit=crop";
    img.alt = this.getAttribute("name") || "";

    title.textContent = this.getAttribute("name") || "";
    author.textContent = this.getAttribute("author") || "";
    
    const year = this.getAttribute("year");
    const movement = this.getAttribute("movement") || "Literatura";
    folio.textContent = `Folio ${year} · `;
    genre.textContent = movement;
  }
}

customElements.define("book-card", BookCard);
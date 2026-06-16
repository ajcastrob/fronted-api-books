import styles from "./literary-quote.css?inline";

const quotes = [
  {
    text: "¿Qué es poesía?, dices mientras clavas en mi pupila tu pupila azul. ¿Qué es poesía? ¿Y me lo preguntas? Poesía... eres tú.",
    author: "Gustavo Adolfo Bécquer",
    source: "Rima XXI",
  },
  {
    text: "No hay camino para la paz, la paz es el camino.",
    author: "Mahatma Gandhi",
    source: "1914",
  },
  {
    text: "Era un hombre que no podía ver a un niño sin levantarlo en el aire y besarle la cara.",
    author: "Charles Dickens",
    source: "Oliver Twist",
  },
  {
    text: "Todas las familias felices se parecen unas a otras, pero cada familia infeliz es infeliz a su manera.",
    author: "León Tolstói",
    source: "Anna Karénina",
  },
  {
    text: "La novela es un espejo que se pasea por un camino llano.",
    author: "Stendhal",
    source: "Rojo y negro",
  },
  {
    text: "El que con niños se acuesta, huesos de piojo le quedan.",
    author: "Proverbio del XIX",
    source: "Refranero",
  },
];

const random = quotes[Math.floor(Math.random() * quotes.length)];

const template = document.createElement("template");
template.innerHTML = `
  <style>${styles}</style>
  <p class="quote">${random.text}</p>
  <p class="attribution">${random.author} · ${random.source}</p>
  <span class="ornament" aria-hidden="true">❦</span>
`;

class LiteraryQuote extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("literary-quote", LiteraryQuote);

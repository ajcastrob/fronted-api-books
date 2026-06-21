import styles from "./literary-quote.css?inline";

const quotes = [
  {
    text: "Era el mejor de los tiempos, era el peor de los tiempos; la época de la sabiduría y la época de la bobería...",
    author: "Charles Dickens",
    source: "Historia de dos ciudades",
  },
  {
    text: "Llamandme Ismael. Hace unos años -no importa cuánto hace exactamente-, teniendo poco o ningún dinero en el bolsillo, y nada en particular que me interesara en tierra, pensé que me iría a navegar un poco por ahí...",
    author: "Herman Melville",
    source: "Moby Dick",
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
    text: "Una tarde extramadamente calurosa de principios de julio, un joven salió de la reducida habitación que tenía alquilada en la callejuela de S, y con paso lento e indeciso, se dirigió al puente K.",
    author: "Fiodor Dostoewski",
    source: "Crimen y castigo",
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

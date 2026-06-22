import { getAllBooks, getBookByName } from "../api/api";
import { getHint, isXIXCentury, normalizeQuery } from "../utils/literary";
import "../components/search-form/search-form";
import "../components/results-panel/results-panel";
import "../components/literary-quote/literary-quote";
import "../components/literary-overview/literary-overview";

export class BookSearchApp {
  constructor(root = document.getElementById("app")) {
    this.root = root;
    this.searchForm = root.querySelector("search-form");
    this.resultsPanel = root.querySelector("results-panel");
    this.overview = root.querySelector("#overview");
    this.colophon = root.querySelector("#colophon");

    this._onSearch = this._handleSearchEvent.bind(this);
    this._onRetry = this._handleRetry.bind(this);
    this._onSuggest = this._handleSuggest.bind(this);
    this._onKeydown = this._handleKeydown.bind(this);

    this.searchForm.addEventListener("search", this._onSearch);
    this.resultsPanel.addEventListener("retry", this._onRetry);
    this.resultsPanel.addEventListener("suggest", this._onSuggest);
    document.addEventListener("keydown", this._onKeydown);

    this.colophon.hidden = false;
    this._loadOverview();
  }

  async _loadOverview() {
    try {
      const books = await getAllBooks();
      this.overview?.setData(books);
    } catch {
      this.overview?.remove();
    }
  }

  _handleSearchEvent(event) {
    this.search(event.detail.query);
  }

  _handleSuggest(event) {
    this.searchForm.setQuery(event.detail.query);
    this.search(event.detail.query);
  }

  _handleRetry() {
    const query = this.searchForm.getQuery();
    if (query) {
      this.search(query);
    }
  }

  _handleKeydown(event) {
    if (event.key !== "Escape") return;

    this.resultsPanel.dismiss();
    this.searchForm.reset();
    this.searchForm.focusInput();
    this.colophon.hidden = false;
  }

  async search(query) {
    const name = normalizeQuery(query);
    if (!name) return;

    this.searchForm.setSubmitting(true);
    this.resultsPanel.showLoading();
    this.colophon.hidden = true;

    try {
      const book = await getBookByName({ name });
      this.resultsPanel.showBook(book);

      const xix = isXIXCentury(book.year);
      this.resultsPanel.setStatus(
        xix
          ? "1 resultado encontrado"
          : "1 resultado encontrado (anterior al siglo XIX)",
      );
    } catch (error) {
      this.resultsPanel.showError(error.message, getHint(name));
      this.resultsPanel.setStatus("");
    } finally {
      this.searchForm.setSubmitting(false);
      this.searchForm.setSettled();
    }
  }
}
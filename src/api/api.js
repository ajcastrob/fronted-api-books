const apiURL = "https://api-books-vqyf.onrender.com/books";
const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabaseHeaders = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
};

const toError = (status, query) => {
  if (status === 404) throw new Error(`No encontramos "${query}"`);
  throw new Error(`Error del servidor: ${status}`);
};

const toNetworkError = (error) => {
  if (
    error.message &&
    (error.message.startsWith("Error del servidor:") ||
      error.message.startsWith("No encontramos"))
  ) {
    throw error;
  }
  throw new Error("Error de conexión. Verifica tu conexión a internet.");
};

async function supabaseQuery(table, params = "") {
  const res = await fetch(`${supabaseURL}/rest/v1/${table}?${params}`, {
    headers: supabaseHeaders,
  });
  if (!res.ok) throw new Error(`Error Supabase: ${res.status}`);
  return res.json();
}

export function groupById(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const id = keyFn(item);
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(item);
  }
  return map;
}

function mergeBooks(books, genres, characters, bookGenres, bookCharacters) {
  const genreNames = new Map(genres.map((g) => [g.id, g.name]));
  const charNames = new Map(characters.map((c) => [c.id, c.name]));

  const grouped = (arr, idKey, nameKey, nameMap) => {
    const map = groupById(arr, (x) => x[idKey]);
    const result = new Map();
    for (const [bookId, entries] of map) {
      result.set(
        bookId,
        entries.map((e) => nameMap.get(e[nameKey])).filter(Boolean),
      );
    }
    return result;
  };

  const bookGenreMap = grouped(bookGenres, "book_id", "genre_id", genreNames);
  const bookCharMap = grouped(bookCharacters, "book_id", "character_id", charNames);

  return books.map((b) => ({
    ...b,
    genre: bookGenreMap.get(b.id) ?? [],
    characters: bookCharMap.get(b.id) ?? [],
  }));
}

export const getAllBooks = async () => {
  try {
    const [books, genres, characters, bookGenres, bookCharacters] =
      await Promise.all([
        supabaseQuery("books", "select=*&order=year.asc"),
        supabaseQuery("genres", "select=*"),
        supabaseQuery("characters", "select=*"),
        supabaseQuery("book_genres", "select=*"),
        supabaseQuery("book_characters", "select=*"),
      ]);

    return mergeBooks(books, genres, characters, bookGenres, bookCharacters);
  } catch (error) {
    throw toNetworkError(error);
  }
};

export const getBookByName = async ({ name }) => {
  try {
    const response = await fetch(`${apiURL}/${encodeURIComponent(name)}`);

    if (!response.ok) {
      toError(response.status, name);
    }

    return await response.json();
  } catch (error) {
    throw toNetworkError(error);
  }
};
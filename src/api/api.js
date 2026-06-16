const apiURL = "https://api-books-vqyf.onrender.com/books";

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
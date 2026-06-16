import { XIX_CANON } from "./constants";

export const normalizeQuery = (raw) => {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-záéíóúüñ0-9-]/g, "");
};

export const getLiteraryMovement = (year) => {
  const y = parseInt(year, 10);
  if (isNaN(y)) return "";
  if (y < 1830) return "Romanticismo temprano";
  if (y < 1850) return "Romanticismo";
  if (y < 1880) return "Realismo";
  if (y < 1900) return "Naturalismo / Realismo tardío";
  return "";
};

export const isXIXCentury = (year) => {
  const y = parseInt(year, 10);
  return !isNaN(y) && y >= 1800 && y <= 1899;
};

export const getHint = (query, canon = XIX_CANON) => {
  const suggestions = canon.filter((s) => s.includes(query) || query.includes(s));
  if (suggestions.length > 0) {
    return `Quizás quisiste decir: ${suggestions.map((s) => s.replace(/-/g, " ")).join(", ")}.`;
  }
  return "Revisa la ortografía o prueba otro título del siglo XIX.";
};
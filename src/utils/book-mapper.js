import { getLiteraryMovement, isXIXCentury } from "./literary";

export const mapBookToCardAttrs = (book) => {
  const year = book.year;
  const attrs = {
    name: book.name,
    author: book.author,
    year: String(year),
    description: book.description,
    image: book.image,
    movement: getLiteraryMovement(year),
  };

  if (isXIXCentury(year)) {
    attrs.era = "xix";
  }

  return attrs;
};
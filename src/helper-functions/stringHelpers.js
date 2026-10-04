export const capitalizeLabel = (text) =>
  (text ?? "")
    .toString()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

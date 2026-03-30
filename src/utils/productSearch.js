const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

const getLevenshteinDistance = (source, target) => {
  const rows = source.length + 1;
  const cols = target.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = source[row - 1] === target[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[source.length][target.length];
};

const matchesProductSearchValue = (productValue, rawQuery) => {
  const query = normalizeText(rawQuery);
  if (!query) {
    return true;
  }

  const normalizedValue = normalizeText(productValue);
  if (!normalizedValue) {
    return false;
  }

  if (normalizedValue.includes(query)) {
    return true;
  }

  const queryPrefix = query.slice(0, Math.min(5, query.length));
  const words = normalizedValue.split(" ").filter(Boolean);
  const compactValue = normalizedValue.replace(/\s+/g, "");
  const candidates = [...words, compactValue];

  return candidates.some((candidate) => {
    if (candidate.startsWith(queryPrefix)) {
      return true;
    }

    if (query.length < 5) {
      return false;
    }

    const comparableSegment = candidate.slice(0, query.length);
    if (!comparableSegment || Math.abs(comparableSegment.length - query.length) > 2) {
      return false;
    }

    return getLevenshteinDistance(comparableSegment, query) <= 2;
  });
};

export const matchesProductSearch = (product, rawQuery) => {
  const query = normalizeText(rawQuery);
  if (!query) {
    return true;
  }

  return [product?.name, product?.brand, product?.category, product?.description].some((value) =>
    matchesProductSearchValue(value || "", query)
  );
};

export const normalizeProductSearchQuery = (value = "") => normalizeText(value);
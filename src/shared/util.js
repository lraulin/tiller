export function camelCase(str) {
  return str
    .trim()
    .replace("#", " number ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export const arraysToObjects = (headers, data) => {
  if (!headers.length) throw new Error("No headers provided");
  if (!data.length) throw new Error("No data provided");
  if (headers.length !== data[0].length)
    throw new Error(
      "Headers and data length mismatch: " + headers.length + " !== " + data[0]
    );

  return data.map((row) => {
    return row.reduce((acc, value, i) => {
      const key = headers[i];
      if (key === "") return acc;
      return { ...acc, [key]: value };
    }, {});
  });
};

/**
 *
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const ascending = (a, b) => a - b;

/**
 *
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const descending = (a, b) => b - a;

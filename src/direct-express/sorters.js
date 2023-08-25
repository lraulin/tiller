/**
 *
 * @param {import("./main.js").DirectExpressTransaction} a
 * @param {import("./main.js").DirectExpressTransaction} b
 * @returns {number}
 */
export const byTransactionIdDescending = (a, b) =>
  b.transactionId - a.transactionId;

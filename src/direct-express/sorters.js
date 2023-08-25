import { DirectExpressTransaction } from "./types.js";

/**
 *
 * @param {DirectExpressTransaction} a
 * @param {DirectExpressTransaction} b
 * @returns {number}
 */
export const byTransactionIdDescending = (a, b) =>
  b.transactionId - a.transactionId;

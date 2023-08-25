/**@typedef {import('./main.js').DirectExpressTransaction} DirectExpressTransaction */
import { idMapReducer } from "./reducers.js";
import { byTransactionIdDescending } from "./sorters.js";

/**
 *
 * @param {DirectExpressTransaction} t
 * @returns {any[]}
 */
export const directExpressToRow = (t) => t.toRow();

/**
 *
 * @param {DirectExpressTransaction} d
 * @returns {import('./main.js').Transaction}
 */
export const directExpressToTransaction = (d) => d.toTiller();

/**
 *
 * @param {DirectExpressTransaction[]} directExpressTransactions
 * @returns {DirectExpressTransaction[]}
 */
export const deDuplicate = (directExpressTransactions) => {
  const transactionsById = directExpressTransactions.reduce(idMapReducer, {});

  return Object.values(transactionsById).sort(byTransactionIdDescending);
};

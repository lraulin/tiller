import { DirectExpressTransaction } from "./types.js";
import { Transaction } from "../transactions/types.js";
import { byTransactionIdDescending } from "./sorters.js";
import { idMapReducer } from "./reducers.js";

/**
 *
 * @param {DirectExpressTransaction} t
 * @returns {any[]}
 */
export const directExpressToRow = (t) => t.toRow();

/**
 *
 * @param {DirectExpressTransaction} d
 * @returns {Transaction}
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

export const directExpressHeaders = Object.freeze({
  DATE: 1,
  "TRANSACTION ID": 2,
  DESCRIPTION: 3,
  AMOUNT: 4,
  "TRANSACTION TYPE": 5,
  CITY: 6,
  STATE: 7,
  COUNTRY: 8,
  1: "DATE",
  2: "TRANSACTION ID",
  3: "DESCRIPTION",
  4: "AMOUNT",
  5: "TRANSACTION TYPE",
  6: "CITY",
  7: "STATE",
  8: "COUNTRY",
});

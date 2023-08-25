/**@typedef {import('./main.js').Transaction} Transaction*/

import { createTransaction } from "./main.js";

/**
 *
 * @param {Transaction} t
 * @returns {any[]}
 */
export const toRow = ({
  date,
  description,
  category,
  amount,
  account,
  accountNumber,
  institution,
  month,
  week,
  transactionId,
  accountId,
  checkNumber,
  fullDescription,
  dateAdded,
  categorizedDate,
}) => [
  ,
  // A
  date, // B
  description, // C
  category, // D
  amount, // E
  account, // F
  accountNumber, // G
  institution, // H
  month, // I
  week, // J
  transactionId, // K
  accountId, // L
  checkNumber, // M
  fullDescription, // N
  dateAdded, // O
  categorizedDate, // P
];

/**
 *
 * @param {import("../categories.js").CategoryLookup} categoryLookup
 * @returns {(r:any[])=>Transaction}
 */
export const rowToTransaction = (categoryLookup) => (r) => {
  if (r.length < 16) throw new Error("Invalid transaction row");

  const [
    ,
    date,
    description,
    category,
    amount,
    account,
    accountNumber,
    institution,
    month,
    week,
    transactionId,
    accountId,
    checkNumber,
    fullDescription,
    dateAdded,
    categorizedDate,
  ] = r;
  const type = categoryLookup[category]?.type ?? "Uncategorized";
  const hidden = categoryLookup[category]?.hidden ?? false;

  return createTransaction({
    date,
    description,
    category,
    type,
    hidden,
    amount,
    account,
    accountNumber,
    institution,
    month,
    week,
    transactionId,
    accountId,
    checkNumber,
    fullDescription,
    dateAdded,
    categorizedDate,
  });
};

/**
 *
 * @param {Transaction} t
 * @returns {number}
 */
export const parseNumericTransactionId = (t) =>
  Number.parseInt(t.transactionId);

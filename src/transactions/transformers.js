import { CategoryLookup, CategoryType } from "../categories/types.js";
import { Transaction, TransactionColumnName } from "./types.js";
import { startOfMonth, startOfWeek } from "../utils.js";

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
 * @param {Transaction} t
 * @returns {number}
 */
export const toTimeStamp = (t) => {
  if (!t.date) throw new Error("Transaction missing date");
  if (!t.date.getTime) throw new Error("Invalid date in transaction");
  return t.date.getTime();
};

/**
 *
 * @param {CategoryLookup} categoryLookup
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

/**
 * Create a new transaction object. All values are optional and defaults
 * are provided if omitted.
 *
 * @return {Transaction}
 */
export const createTransaction = ({
  date = new Date(),
  amount = 0,
  category = "",
  type = /**@type {CategoryType} */ ("Uncategorized"),
  hidden = false,
  account = "",
  institution = "",
  accountNumber = "",
  description = "",
  fullDescription = "",
  transactionId = "",
  accountId = "",
  checkNumber = "",
  month = startOfMonth(date),
  week = startOfWeek(date),
  dateAdded = new Date(),
  categorizedDate = undefined,
} = {}) => ({
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

export const transactionHeaders = Object.freeze({
  0: "",
  1: "Date",
  2: "Description",
  3: "Category",
  4: "Amount",
  5: "Account",
  6: "Account #",
  7: "Institution",
  8: "Month",
  9: "Week",
  10: "Transaction ID",
  11: "Account ID",
  12: "Check Number",
  13: "Full Description",
  14: "Date Added",
  15: "Categorized Date",
  "": 0,
  Date: 1,
  Description: 2,
  Category: 3,
  Amount: 4,
  Account: 5,
  "Account #": 6,
  Institution: 7,
  Month: 8,
  Week: 9,
  "Transaction ID": 10,
  "Account ID": 11,
  "Check Number": 12,
  "Full Description": 13,
  "Date Added": 14,
  "Categorized Date": 15,
});

/**
 *
 * @param {TransactionColumnName} c
 * @returns {number}
 */
export const columnNumber = (c) => transactionHeaders[c] + 1;

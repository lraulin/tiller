/**@typedef {import("../categories.js").TimeUnit} TimeUnit */
/**@typedef {import("../categories.js").CategoryType} CategoryType */
import { startOfMonth, startOfWeek } from "../utils.js";
import { getRowsFromSheet, getSheet, overwriteSheet } from "../sheets.js";
import { getCategoryLookup } from "../categories.js";
import {
  institutionIsComerica,
  isNotPending,
  typeIsExpense,
  typeIsIncome,
} from "./predicates.js";
import {
  parseNumericTransactionId,
  rowToTransaction,
  toRow,
} from "./transformers.js";
import * as de from "../direct-express/main.js";
import { directExpressToTransaction } from "../direct-express/transformers.js";

const SHEET_NAME = "Transactions";
const transactionSheet = getSheet(SHEET_NAME);

let transactions = /**@type {Transaction[]} */ ([]);
let expenses = /**@type {Transaction[]} */ ([]);
let income = /**@type {Transaction[]} */ ([]);

function getTransactionsFromSheet() {
  const transactionRows = getRowsFromSheet(transactionSheet);
  if (transactionRows.length === 0) throw new Error("No transactions found");

  const rowToTransactionWithCategory = rowToTransaction(getCategoryLookup());

  return transactionRows.map(rowToTransactionWithCategory);
}

export function getTransactions() {
  if (transactions.length > 0) {
    return transactions;
  }

  transactions = getTransactionsFromSheet();
  return transactions;
}

export function getExpenses() {
  if (expenses.length > 0) {
    return expenses;
  }

  if (!transactions.length) {
    getTransactions();
  }

  expenses = transactions.filter(typeIsExpense);
  return expenses;
}

/**
 *
 * @returns {Transaction[]}
 */
export function getIncome() {
  if (income.length > 0) {
    return income;
  }

  if (!transactions.length) {
    getTransactions();
  }

  income = transactions.filter(typeIsIncome);
  return expenses;
}

export function writeTransactions() {
  if (!transactions.length) {
    throw new Error("No transactions to write");
  }

  const data = transactions.map(toRow);
  overwriteSheet(transactionSheet, data);
}

function getMostRecentDirectExpressTransactionId() {
  const directExpressTransactions = getTransactions().filter(
    institutionIsComerica
  );
  if (directExpressTransactions.length === 0) return 0;
  return Math.max(...directExpressTransactions.map(parseNumericTransactionId));
}

export function importDirectExpress() {
  transactions = getTransactions().filter(isNotPending);
  const afterTransId = getMostRecentDirectExpressTransactionId();
  const directExpressImports = de.getDirectExpressTransactions({
    afterTransId,
  });
  transactions = [
    ...transactions,
    ...directExpressImports.map(directExpressToTransaction),
  ];
}

/**
 * Represents an item from the Transaction table.
 * @typedef {object} Transaction
 * @property {Date} date
 * @property {number} amount
 * @property {string} category
 * @property {CategoryType} type
 * @property {boolean} hidden
 * @property {string} account
 * @property {string} institution
 * @property {string} accountNumber
 * @property {string} description
 * @property {string} fullDescription
 * @property {string} transactionId
 * @property {string} accountId
 * @property {string} checkNumber
 * @property {Date} month
 * @property {Date} week
 * @property {Date} dateAdded
 * @property {Date|undefined} categorizedDate
 */

/**
 *
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
} = {}) => {
  return {
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
  };
};

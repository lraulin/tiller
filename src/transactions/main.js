import * as de from "../direct-express/main.js";

import { Transaction, TransactionColumnName } from "./types.js";
import { ascending, isValidDate } from "../utils.js";
import {
  backup,
  getRowsFromSheet,
  getSheet,
  overwriteSheet,
  sortSheet,
} from "../sheets/main.js";
import {
  columnNumber,
  parseNumericTransactionId,
  rowToTransaction,
  toRow,
  toTimeStamp,
  transactionHeaders,
} from "./transformers.js";
import {
  institutionIsComerica,
  isNotPending,
  typeIsExpense,
  typeIsIncome,
} from "./predicates.js";

import { directExpressToTransaction } from "../direct-express/transformers.js";
import { getCategoryLookup } from "../categories/main.js";

/**@type {GoogleAppsScript.Spreadsheet.Sheet} */
const sheet = getSheet("Transactions");

/**@type {Transaction[]} */
let transactions = [];

/**@type {Transaction[]} */
let expenses = [];

/**@type {Transaction[]} */
let income = [];

/**
 *
 * @returns {Transaction[]}
 */
function getTransactionsFromSheet() {
  const transactionRows = getRowsFromSheet(sheet);
  if (transactionRows.length === 0) throw new Error("No transactions found");

  const rowToTransactionWithCategory = rowToTransaction(getCategoryLookup());

  return transactionRows.map(rowToTransactionWithCategory);
}

/**
 *
 * @returns {Transaction[]}
 */
export function getTransactions() {
  if (transactions.length) {
    return transactions;
  }

  transactions = getTransactionsFromSheet();
  if (!transactions.length) {
    throw new Error("Unable to retrieve transactions from sheet");
  }
  return transactions;
}

/**
 *
 * @returns {Transaction[]}
 */
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
  overwriteSheet(sheet, data);
}

function getMostRecentDirectExpressTransactionId() {
  const directExpressTransactions = getTransactions().filter(
    institutionIsComerica
  );
  if (directExpressTransactions.length === 0) return 0;
  return Math.max(...directExpressTransactions.map(parseNumericTransactionId));
}

export function importDirectExpress() {
  backup("Transactions");

  transactions = getTransactions().filter(isNotPending);
  const afterTransId = getMostRecentDirectExpressTransactionId();
  const directExpressImports = de.getDirectExpressTransactions({
    afterTransId,
  });
  transactions = [
    ...transactions,
    ...directExpressImports.map(directExpressToTransaction),
  ];
  overwriteSheet(sheet, transactions.map(toRow));
}

/**
 *
 * @returns {Date}
 */
export function getFirstTransactionDate() {
  if (transactions.length === 0) throw new Error("called with empty array");

  const firstDateTimeStamp = transactions.map(toTimeStamp).sort(ascending)?.[0];
  if (!firstDateTimeStamp) throw new Error("firstDateTimeStamp is undefined");

  const firstTransactionDate = new Date(firstDateTimeStamp);
  if (!isValidDate)
    throw new Error(
      "Invalid date; " +
        JSON.stringify({ firstDateTimeStamp, firstTransactionDate })
    );

  return firstTransactionDate;
}

/**
 * Sorts a Google Sheet containing transactions based on the specified column and order.
 *
 * @function
 * @param {Object} [options] - The options object for sorting the transactions.
 * @param {TransactionColumnName} [options.columnName="Date"] - The name of the column to sort by.
 * @param {boolean} [options.ascending=false] - Whether to sort the transactions in ascending order.
 * @example
 *
 * // Sort the transactions by 'Date' in descending order (default settings)
 * sortTransactionsSheet();
 *
 * // Sort the transactions by 'Description' in ascending order
 * sortTransactionsSheet({ columnName: "Description", ascending: true });
 *
 * // Sort the transactions by 'Amount' in descending order
 * sortTransactionsSheet({ columnName: "Amount" });
 */
export function sortTransactionsSheet({
  columnName = "Date",
  ascending = false,
} = {}) {
  const column = columnNumber(columnName);
  sortSheet({ sheet, column, ascending });
}

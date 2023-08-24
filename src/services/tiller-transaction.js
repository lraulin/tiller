/**@typedef {import("./categories.js").TimeUnit} TimeUnit */
/**@typedef {import("./categories.js").CategoryType} CategoryType */
import { startOfMonth, startOfWeek } from "../utils.js";
import { getRowsFromSheet, getSheet, overwriteSheet } from "./sheets.js";
import { getCategoryLookup } from "./categories.js";
import * as de from "./direct-express.js";

const SHEET_NAME = "Transactions";
const transactionSheet = getSheet(SHEET_NAME);

let transactions = /**@type {Transaction[]} */ ([]);
let expenses = /**@type {Transaction[]} */ ([]);
let income = /**@type {Transaction[]} */ ([]);

function _getTransactionsFromSheet() {
  const transactionRows = getRowsFromSheet(transactionSheet);
  if (transactionRows.length === 0) throw new Error("No transactions found");

  const categoryLookup = getCategoryLookup();

  return transactionRows.map((r) => {
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
  });
}

export function getTransactions() {
  if (transactions.length > 0) {
    return transactions;
  }

  transactions = _getTransactionsFromSheet();
  return transactions;
}

export function getExpenses() {
  if (expenses.length > 0) {
    return expenses;
  }

  if (!transactions.length) {
    getTransactions();
  }

  expenses = transactions.filter(
    (t) => t.hidden === false && t.type === "Expense"
  );
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

  income = transactions.filter(
    (t) => t.hidden === false && t.type === "Income"
  );
  return expenses;
}

export function writeTransactions() {
  if (!transactions.length) {
    throw new Error("No transactions to write");
  }

  const data = transactions.map((t) => t.toRow());
  overwriteSheet(transactionSheet, data);
}

export function importDirectExpress() {
  const directExpressImports = de.getDirectExpressTransactions();
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
 * @property {function():any[]} toRow
 */

/**
 *
 *
 * @param {object} data{
 * @param {Date=}  data.date = new Date(),
 * @param {number=} data.amount = 0,
 * @param {string=} data.category = "",
 * @param {CategoryType=}  data.type = "Uncategorized",
 * @param {boolean=}  data.hidden = false,
 * @param {string=}  data.account = "",
 * @param {string=}  data.institution = "",
 * @param {string=}  data.accountNumber = "",
 * @param {string=}  data.description = "",
 * @param {string=}  data.fullDescription = "",
 * @param {string=}  data.transactionId = "",
 * @param {string=}  data.accountId = "",
 * @param {string=}  data.checkNumber = "",
 * @param {Date=}  data.month = startOfMonth(date),
 * @param {Date=}  data.week = startOfWeek(date),
 * @param {Date=}  data.dateAdded = new Date(),
 * @param {Date=}  data.categorizedDate = null,
 * @return {Transaction}
 */
export const createTransaction = ({
  date = new Date(),
  amount = 0,
  category = "",
  type = "Uncategorized",
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
  categorizedDate,
}) => {
  const toRow = () => [
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
  ];

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
    toRow,
  };
};

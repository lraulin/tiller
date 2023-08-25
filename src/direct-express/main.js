import { deDuplicate, directExpressToRow } from "./transformers.js";
import { getRowsFromSheet, getSheet, overwriteSheet } from "../sheets/main.js";

import { DirectExpressTransaction } from "./types.js";
import { byTransactionIdDescending } from "./sorters.js";
import { createTransaction } from "../transactions/transformers.js";

const SHEET_NAME = "DirectExpress";
const ACCOUNT_NAME = "Direct Express";
const ACCOUNT_NUMBER = "xxxx0947";
const INSTITUTION = "Comerica";

const headers = Object.freeze({
  DATE: 0,
  "TRANSACTION ID": 1,
  DESCRIPTION: 2,
  AMOUNT: 3,
  "TRANSACTION TYPE": 4,
  CITY: 5,
  STATE: 6,
  COUNTRY: 7,
  0: "DATE",
  1: "TRANSACTION ID",
  2: "DESCRIPTION",
  3: "AMOUNT",
  4: "TRANSACTION TYPE",
  5: "CITY",
  6: "STATE",
  7: "COUNTRY",
});

/**@type {GoogleAppsScript.Spreadsheet.Sheet} */
const directExpressSheet = getSheet("DirectExpress");

/**@type {DirectExpressTransaction[]} */
let directExpressTransactions = [];

function _getDirectExpressTransactionsFromSheet() {
  const directExpressRows = getRowsFromSheet(directExpressSheet);
  if (directExpressRows.length === 0)
    throw new Error("No direct express transactions found");

  directExpressTransactions = directExpressRows.map(createFromRow);
}

/**
 *
 * Retrieves transactions from cache if available, otherwise populates cache
 * from spreadsheet, then returns transactions. Optionally, can filter be
 * applied to returned data.
 *
 * @returns {DirectExpressTransaction[]}
 */
export function getDirectExpressTransactions({ afterTransId = 0 } = {}) {
  if (directExpressTransactions.length > 0) {
    return directExpressTransactions;
  }
  _getDirectExpressTransactionsFromSheet();

  if (afterTransId) {
    return directExpressTransactions.filter(
      (t) => t.transactionId > afterTransId
    );
  }
  return directExpressTransactions;
}

/**
 *
 * @param {DirectExpressTransaction[]} transactions
 */
export function setDirectExpressTransacionts(transactions) {
  directExpressTransactions = [...transactions];
}

/**
 *
 * @returns {any[][]}
 */
export function getAsRows() {
  return directExpressTransactions.map(directExpressToRow);
}

export function deDuplicateDirectExpressTransactions() {
  if (!directExpressTransactions.length) {
    getDirectExpressTransactions();
  }

  directExpressTransactions = deDuplicate(directExpressTransactions);
}

export function sortDirectExpressTransactions() {
  directExpressTransactions.sort(byTransactionIdDescending);
}

export function writeToDirectExpressSheet() {
  if (!directExpressTransactions.length) {
    throw new Error("Attempting to overwrite sheet with empty data!");
  }

  overwriteSheet(directExpressSheet, getAsRows());
}

/**
 *
 * @param {DirectExpressTransaction} a
 * @param {DirectExpressTransaction} b
 * @returns {number}
 */
const descendingByTransactionId = (a, b) => b.transactionId - a.transactionId;

/**@type {DirectExpressTransaction} */
const directExpressTransactionOLOO = {
  date: null,
  transactionId: 0,
  description: "",
  amount: 0,
  transactionType: "",
  city: "",
  state: "",
  country: "",
  isPending: false,
  init({
    date,
    transactionId,
    description,
    amount,
    transactionType,
    city,
    state,
    country,
  }) {
    this.date = date === "Pending" ? null : date;
    this.transactionId = transactionId;
    this.description = description;
    this.amount = amount;
    this.transactionType = transactionType;
    this.city = city;
    this.state = state;
    this.country = country;
    this.isPending = date === "Pending" ? true : false;
    return this;
  },
  toRow() {
    const row = Array(8).fill(undefined);
    row[headers.DATE] = this.isPending ? "Pending" : this.date;
    row[headers["TRANSACTION ID"]] = this.transactionId;
    row[headers.DESCRIPTION] = this.description;
    row[headers.AMOUNT] = this.amount;
    row[headers["TRANSACTION TYPE"]] = this.transactionType;
    row[headers.CITY] = this.city;
    row[headers.STATE] = this.state;
    row[headers.COUNTRY] = this.country;
    return row;
  },
  toTiller() {
    return createTransaction({
      date: this.date ? this.date : new Date(),
      amount: this.amount,
      account: ACCOUNT_NAME,
      institution: INSTITUTION,
      accountNumber: ACCOUNT_NUMBER,
      description: this.isPending
        ? "[PENDING] " + this.description
        : this.description,
      fullDescription: [this.city, this.state, this.country].join(", "),
      transactionId: String(this.transactionId),
    });
  },
};

/**
 *
 * @param {any[]} row
 * @returns {DirectExpressTransaction}
 */
const createFromRow = (row) => {
  const date = row[headers.DATE];
  const transactionId = row[headers["TRANSACTION ID"]];
  const description = row[headers.DESCRIPTION];
  const amount = row[headers.AMOUNT];
  const transactionType = row[headers["TRANSACTION TYPE"]];
  const city = row[headers.CITY];
  const state = row[headers.STATE];
  const country = row[headers.COUNTRY];
  const isPending = date === "Pending" ? true : false;

  const obj = Object.create(directExpressTransactionOLOO);
  obj.init({
    date,
    amount,
    description,
    transactionId,
    transactionType,
    city,
    state,
    country,
    isPending,
  });
  return obj;
};

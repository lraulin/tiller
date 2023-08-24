import { getRowsFromSheet, getSheet, overwriteSheet } from "./sheets.js";
import { isValidDate } from "../utils.js";
import * as tiller from "./tiller-transaction.js";

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

const directExpressSheet = getSheet(SHEET_NAME);
let directExpressTransactions = /**@type {DirectExpressTransaction[]} */ ([]);

function _getDirectExpressTransactionsFromSheet() {
  const directExpressRows = getRowsFromSheet(directExpressSheet);
  if (directExpressRows.length === 0)
    throw new Error("No direct express transactions found");

  directExpressTransactions = directExpressRows.map(createFromRow);
}

export function getDirectExpressTransactions() {
  if (directExpressTransactions.length > 0) {
    return directExpressTransactions;
  }
  _getDirectExpressTransactionsFromSheet();
  return directExpressTransactions;
}

export function cleanUp() {
  directExpressTransactions = getDirectExpressTransactions();
  directExpressTransactions = deDuplicate(directExpressTransactions);
  directExpressTransactions.sort((a, b) => b.transactionId - a.transactionId);
  overwriteSheet(directExpressSheet, getAsRows());
}

function getAsRows() {
  return directExpressTransactions.map((t) => t.toRow());
}

/**
 * @typedef {Record<number,DirectExpressTransaction>} IdMap
 */

/**
 *
 * @param {IdMap} accumulator
 * @param {DirectExpressTransaction} current
 * @returns {IdMap}
 */
const idMapReducer = (accumulator, current) => {
  if (!accumulator[current.transactionId]) {
    accumulator[current.transactionId] = current;
    return accumulator;
  }

  const copyA = accumulator[current.transactionId];
  const copyB = current;

  if (copyA.isPending) {
    accumulator[current.transactionId] = copyB;
  }
  return accumulator;
};

/**
 *
 * @param {DirectExpressTransaction} a
 * @param {DirectExpressTransaction} b
 * @returns {number}
 */
const descendingByTransactionId = (a, b) => b.transactionId - a.transactionId;

/**
 *
 * @param {DirectExpressTransaction[]} directExpressTransactions
 * @returns
 */
const deDuplicate = (directExpressTransactions) => {
  const transactionsById = directExpressTransactions.reduce(idMapReducer, {});

  return Object.values(transactionsById).sort(descendingByTransactionId);
};

/**
 * @typedef {Object} DEData
 * @property {Date?} date
 * @property {number} transactionId
 * @property {string} description
 * @property {number} amount
 * @property {string} transactionType
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {boolean} isPending
 */

/**
 * @typedef {Object} DirectExpressTransaction
 * @property {Date?} date
 * @property {number} transactionId
 * @property {string} description
 * @property {number} amount
 * @property {string} transactionType
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {boolean} isPending
 * @property {function(DEData):DirectExpressTransaction} init
 * @property {function():any[]} toRow
 */

const directExpressTransactionOLOO = {
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
    this.date = isValidDate(date) ? date : null;
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
    return tiller.createTransaction({
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

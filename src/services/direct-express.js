import { count } from "console";
import { alert, getRowsFromSheet, getSheet, overwriteSheet } from "./sheets.js";
import { isValidDate } from "../utils.js";
import * as tiller from "./tiller-transaction.js";

const SHEET_NAME = "DirectExpress";
const ACCOUNT_NAME = "Direct Express";
const ACCOUNT_NUMBER = "xxxx0947";
const INSTITUTION = "Comerica";

const headers = Object.freeze({
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

const deDuplicate = (directExpressTransactions) => {
  let duplicateCount = 0;
  const transactionsById = directExpressTransactions.reduce((a, c) => {
    if (!a[c.transactionId]) {
      a[c.transactionId] = c;
      return a;
    }

    duplicateCount++;
    const copyA = a[c.transactionId];
    const copyB = c;

    if (copyA.pending) {
      a[c.transactionId] = copyB;
    } else {
      a[c.transactionId] = copyA;
    }
    return a;
  }, {});

  return Object.values(transactionsById).sort(
    (a, b) => b.transactionId - a.transactionId
  );
};

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
  },
  toRow() {
    return [
      this.date ? this.date : "Pending",
      this.transactionId,
      this.description,
      this.amount,
      this.transactionType,
      this.city,
      this.state,
      this.country,
    ];
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
 * @param {*} param0
 * @returns {DirectExpressTransaction}
 */
const createFromRow = ([
  date,
  transactionId,
  description,
  amount,
  ,
  city,
  state,
  country,
]) => {
  const obj = Object.create(directExpressTransactionOLOO);
  const isPending = date === "Pending" ? true : false;
  obj.init({
    date: isValidDate(date) ? date : null,
    amount,
    description,
    transactionId: String(transactionId),
    fullDescription: [city, state, country].join(", "),
    isPending,
  });
  return obj;
};

/** */

/**@typedef {import("./types").TimeUnit} TimeUnit */
/**@typedef {import("./types").CategoryRow} CategoryRow */
/**@typedef {import("./models/tiller-transaction").Transaction} Transaction*/
/**@typedef {import("./types").DirectExpressRow} DirectExpressRow */
import { sheetNames } from "./consts.js";

import {
  filterToExpenses,
  getNewTransactionsFromDirectExpress,
  getSpendingData,
  rowsToTransactions,
} from "./core.js";
import { alert, appendToSheet, getSheet, sortSheet } from "./sheet-utils.js";

/**
 * Loads data from spreadsheets.
 * @returns {Transaction[]}
 */
function getTransactionData() {
  const categoryRows = /**@type {CategoryRow[]} */ (
    getRowsFromSheet(sheetNames.CATEGORIES)
  );
  if (categoryRows.length === 0) throw new Error("No categories found");

  const transactionRows = getRowsFromSheet(sheetNames.TRANSACTIONS);
  if (transactionRows.length === 0) throw new Error("No transactions found");

  return rowsToTransactions(categoryRows, transactionRows);
}

/**
 *
 * @returns {Transaction[]}
 */
function getExpenses() {
  return filterToExpenses(getTransactionData());
}

/**
 * Get values from Google Sheet of specified name.
 *
 * @param {string} sheetName
 * @returns {any[][]}
 */
function getRowsFromSheet(sheetName) {
  const sheet = getSheet(sheetName);
  const [, ...rows] = sheet.getDataRange().getValues();
  return rows;
}

/**
 * @typedef {object} SpendingTableParams
 * @property {TimeUnit} unit
 * @property {string} sheetName
 */

/**
 * @param {SpendingTableParams} param0
 */
function fillSpendingTable({ unit, sheetName }) {
  const data = getSpendingData({
    transactions: getExpenses(),
    lastDate: new Date(),
    unit,
  });
  const sheet = getSheet(sheetName);
  sheet.clearContents();
  appendToSheet(sheet, data);
}

function fillSpendingTables() {
  /**@type {SpendingTableParams[]} */
  const params = [
    { unit: "day", sheetName: sheetNames.DAILY },
    { unit: "week", sheetName: sheetNames.WEEKLY },
    { unit: "month", sheetName: sheetNames.MONTHLY },
  ];
  params.forEach(fillSpendingTable);
}

export function importDirectExpress() {
  const rows = /**@type {DirectExpressRow[]} */ (
    getRowsFromSheet(sheetNames.DIRECT_EXPRESS)
  );
  const newTillerTransactions = getNewTransactionsFromDirectExpress(
    getTransactionData(),
    rows
  );
  if (newTillerTransactions.length) {
    appendToSheet(
      getSheet(sheetNames.TRANSACTIONS),
      newTillerTransactions.map((t) => t.toRow())
    );
  }
  alert(
    newTillerTransactions.length + " transactions added from Direct Express"
  );
}

export function fillCustomSheets() {
  fillSpendingTables();
  importDirectExpress();
}

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Lee")
    .addItem("Import Direct Express", "importDirectExpress")
    .addItem("Fill My Sheets", "fillCustomSheets")
    .addItem("Sort Transactions", "sortTransactions")
    .addItem("Sort DirectExpress", "sortDirectExpress")
    .addToUi();
}

export function sortTransactions() {
  const sheet = getSheet(sheetNames.TRANSACTIONS);
  sortSheet({ sheet, column: transactionHeaders.Date, ascending: false });
}

export function sortDirectExpress() {
  const sheet = getSheet(sheetNames.DIRECT_EXPRESS);
  sortSheet({
    sheet,
    column: directExpressHeaders.DATE,
    ascending: false,
  });
}

// Gas plugin needs assignments to "global" to create top-level functions...
const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = fillCustomSheets;
global.importDirectExpress = importDirectExpress;
global.sortTransactions = sortTransactions;
global.sortDirectExpress = sortDirectExpress;

// But apparently Google changed how it works, and "global"
// is not found, but assigning to "globalThis" works.
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

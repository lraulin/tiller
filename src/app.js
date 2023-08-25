/** */

/**@typedef {import("./services/categories.js").TimeUnit} TimeUnit */
/**@typedef {import("./services/tiller-transaction").Transaction} Transaction*/
import { sheetNames } from "./consts.js";

import { getSpendingData } from "./core.js";
import { appendToSheet, getSheet, sortSheet } from "./services/sheets.js";
import * as tiller from "./services/tiller-transaction.js";
import * as de from "./services/direct-express.js";

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
    transactions: tiller.getExpenses(),
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

export function importDirectExpress() {}

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
    .addItem("Clean Up Direct Express", "cleanUpDirectExpress")
    .addToUi();
}

export function sortTransactions() {
  const sheet = getSheet(sheetNames.TRANSACTIONS);
  sortSheet({ sheet, column: transactionHeaders.Date, ascending: false });
}

export function cleanUpDirectExpress() {
  de.cleanUp();
}

// Gas plugin needs assignments to "global" to create top-level functions...
const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = fillCustomSheets;
global.importDirectExpress = importDirectExpress;
global.sortTransactions = sortTransactions;
global.cleanUpDirectExpress = cleanUpDirectExpress;

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

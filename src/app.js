import * as tiller from "./transactions/main.js";

import { appendToSheet, getSheet } from "./sheets/main.js";

import { SheetName } from "./sheets/types.js";
import { TimeUnit } from "./categories/types.js";
import { cleanUp } from "./direct-express/global.js";
import { getSpendingData } from "./core.js";

/**
 * @typedef {object} SpendingTableParams
 * @property {TimeUnit} unit
 * @property {SheetName} sheetName
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
    { unit: "day", sheetName: "Daily" },
    { unit: "week", sheetName: "Weekly" },
    { unit: "month", sheetName: "Monthly" },
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

// Gas plugin needs assignments to "global" to create top-level functions...
const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = fillCustomSheets;
global.importDirectExpress = importDirectExpress;
global.sortTransactions = tiller.sortTransactionsSheet;
global.cleanUpDirectExpress = cleanUp;

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

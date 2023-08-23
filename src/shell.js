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

function alert(message) {
  SpreadsheetApp.getUi().alert(message);
}

/**
 * Gets Google Sheet by name.
 *
 * @param {string} name
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error(`Unable to retrieve '${name}' sheet`);
  return sheet;
}

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
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {any[][]} data
 */
function appendToSheet(sheet, data) {
  if (!data.length) console.log("No data to append!");
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
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
    .addToUi();
}

const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = fillCustomSheets;
global.importDirectExpress = importDirectExpress;
globalThis.onOpen = onOpen;
globalThis.fillCustomSheets = fillCustomSheets;
globalThis.importDirectExpress = importDirectExpress;

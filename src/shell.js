/**@typedef {import("./types").TimeUnit} TimeUnit */
/**@typedef {import("./types").CategoryRow} CategoryRow */
/**@typedef {import("./types").TransactionRow} TransactionRow */
/**@typedef {import("./types").DirectExpressRow} DirectExpressRow */
import { sheetNames } from "./consts.js";

import {
  filterToExpenses,
  getNewTransactionsFromDirectExpress,
  getSpendingData,
  rowsToTransactions,
} from "./core.js";

let allTransactions /**@type {Transaction[]} */ = [];
let expenses /**@type {Transaction[]} */ = [];

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
 *
 */
function init() {
  const categoryRows = /**@type {CategoryRow[]} */ (
    getRowsFromSheet(sheetNames.CATEGORIES)
  );
  const transactionRows = /**@type {TransactionRow[]} */ (
    getRowsFromSheet(sheetNames.TRANSACTIONS)
  );
  allTransactions = rowsToTransactions(categoryRows, transactionRows);
  expenses = filterToExpenses(allTransactions);
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
    transactions: expenses,
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
  params.forEach((params) => {
    fillSpendingTable(params);
  });
}

export function importDirectExpress() {
  const rows = /**@type {DirectExpressRow[]} */ (
    getRowsFromSheet(sheetNames.DIRECT_EXPRESS)
  );
  const newTillerTransactions = getNewTransactionsFromDirectExpress(
    allTransactions,
    rows
  );
  if (newTillerTransactions.length) {
    // @ts-ignore
    appendToSheet(getSheet(sheetNames.TRANSACTIONS), newTillerTransactions);
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
  init();
  const ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu("Lee")
    .addItem("Import Direct Express", "importDirectExpress")
    .addItem("Fill My Sheets", "fillCustomSheets")
    .addToUi();
}

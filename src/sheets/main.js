import { SheetName } from "./types.js";

/**
 * Get values from Google Sheet of specified name.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @returns {any[][]}
 */
export function getRowsFromSheet(sheet) {
  const [, ...rows] = sheet.getDataRange().getValues();
  return rows;
}

/**
 * Generic helper functions for interacting with Google Sheets.
 */

export function alert(message) {
  SpreadsheetApp.getUi().alert(message);
}

/**
 * Gets Google Sheet by name.
 *
 * @param {SheetName} name
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
export function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error(`Unable to retrieve '${name}' sheet`);
  return sheet;
}

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {any[][]} data
 */
export function appendToSheet(sheet, data) {
  if (!data.length) console.log("No data to append!");
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {any[][]} data
 */
export function overwriteSheet(sheet, data) {
  const [headers] = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  sheet.clearContents();
  appendToSheet(sheet, [headers, ...data]);
}

/**
 *
 * @param {object} param0
 * @param {GoogleAppsScript.Spreadsheet.Sheet} param0.sheet
 * @param {number} param0.column
 * @param {boolean} param0.ascending
 */
export function sortSheet({ sheet, column, ascending = true }) {
  const range = getDataRangeWithoutHeader(sheet);
  range.sort({ column, ascending });
}

/**
 * Returns range containing data, excluding first row.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @returns {GoogleAppsScript.Spreadsheet.Range}
 */
export function getDataRangeWithoutHeader(sheet) {
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
}

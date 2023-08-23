/**
 * Generic helper functions for interacting with Google Sheets.
 */

export function alert(message) {
  SpreadsheetApp.getUi().alert(message);
}

/**
 * Gets Google Sheet by name.
 *
 * @param {string} name
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
 * @param {object} param0
 * @param {GoogleAppsScript.Spreadsheet.Sheet} param0.sheet
 * @param {number} param0.column
 * @param {boolean} param0.ascending
 */
export function sortSheet({ sheet, column, ascending = true }) {
  const rangeExcludingHeader = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    sheet.getLastColumn()
  );
  rangeExcludingHeader.sort({ column, ascending });
}

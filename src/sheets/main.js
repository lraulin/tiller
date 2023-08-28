export const WORKBOOK_NAME = "Tiller Foundation Template";
const BACKUP_POSTFIX = "Backup";

/**
 *
 * @param {string} sheetName
 * @param {string} postfix
 * @param {number} number
 * @returns
 */
const getBackupName = (
  sheetName,
  number,
  postfix = BACKUP_POSTFIX,
  separator = "_"
) => [sheetName, postfix, number].join(separator);

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @returns {any[]}
 */
export const getFirstRow = (sheet) =>
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @returns
 */
export const getHeaderNames = (sheet) =>
  getFirstRow(sheet).map((cell) => cell.toString());

/**@type {string[]} */
let sheetNames = [];

/**
 *
 */
function getSheetNames(forceUpdate = false) {
  if (sheetNames.length && !forceUpdate) {
    return sheetNames;
  }

  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  if (!sheets.length) {
    throw new Error("No sheets found");
  }

  sheetNames = sheets.map((sheet) => sheet.getName());
}

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
  if (!data.length) Logger.log("No data to append!");
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
export function clearDataKeepHeaders(sheet) {
  const dataRange = getDataRangeWithoutHeaders(sheet);
  dataRange.clearContent();
}

/**
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {any[][]} data
 */
export function overwriteSheet(sheet, data) {
  clearDataKeepHeaders(sheet);
  appendToSheet(sheet, data);
}

/**
 *
 * @param {object} param0
 * @param {GoogleAppsScript.Spreadsheet.Sheet} param0.sheet
 * @param {number} param0.column
 * @param {boolean} param0.ascending
 */
export function sortSheet({ sheet, column, ascending = true }) {
  const range = getDataRangeWithoutHeaders(sheet);
  range.sort({ column, ascending });
}

/**
 * Returns range containing data, excluding first row.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @returns {GoogleAppsScript.Spreadsheet.Range}
 */
export function getDataRangeWithoutHeaders(sheet) {
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
}

const getHighestBackupNumber = (sheetNames, baseName) => {
  if (!sheetNames.length) throw new Error("No sheet names found");

  const backupNumbers = sheetNames
    .filter((n) => n.includes(baseName))
    .map((n) => {
      const match = n.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
  return backupNumbers.length ? Math.max(...backupNumbers) : 0;
};

/**
 *
 * @param {string} sheetName
 */
export function backup(sheetName) {
  return function () {
    const workBook = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheet(sheetName);
    getSheetNames(true);
    const number = getHighestBackupNumber(sheetNames, sheetName) + 1;

    sheet.copyTo(workBook).setName(getBackupName(sheetName, number));
  };
}

/**
 *
 * @param {string} baseSheetName
 */
export function restoreBackup(baseSheetName) {
  return function () {
    const backupNumber = getHighestBackupNumber(sheetNames, baseSheetName);
    const originalSheet = getSheet(baseSheetName);
    const backupName = getBackupName(baseSheetName, backupNumber);
    const backupSheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(backupName);
    if (!backupSheet)
      throw new Error(`Unable to retrieve '${backupName}' sheet`);

    backup(baseSheetName);

    const workBook = SpreadsheetApp.getActiveSpreadsheet();
    workBook.deleteSheet(originalSheet);
    backupSheet.copyTo(workBook).setName(baseSheetName);
    workBook.deleteSheet(backupSheet);
  };
}

export function clearAllBackups() {
  const workBook = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = workBook.getSheets();
  const backups = sheets.filter((s) => s.getName().includes(BACKUP_POSTFIX));
  backups.forEach((b) => workBook.deleteSheet(b));
}

// function backupInOtherSpreadsheet() {
//   var source = SpreadsheetApp.getActiveSpreadsheet();
//   var sheet = source.getSheets()[0];

//   var destination = SpreadsheetApp.openById(BACKUP_SPREADSHEET_ID);
//   sheet.copyTo(destination);
// }

(function init() {
  getSheetNames();
})();

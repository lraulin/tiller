/**
 * BaseSheetService is responsible for interacting with Google Sheets.
 * It provides methods for loading and saving data, and initializes with a sheet name and model.
 *
 * @typedef {Object} BaseSheetService
 *
 * @property {GoogleAppsScript.Spreadsheet.Sheet|null} sheet - The Google Spreadsheet sheet object.
 * @property {Function|null} model - The model function used for processing rows.
 * @property {any[]} data - The loaded data from the Google Sheet.
 * @property {string[]} headers - The column headers from the Google Sheet.
 * @property {Function} load - Loads the data from the Google Sheet into the `data` property.
 * @property {Function} save - Saves the `data` back into the Google Sheet.
 * @property {Function} sortSheet - Sorts the Google Sheet based on a given sort specification object.
 */

/**@type {BaseSheetService} */
export let BaseSheetService;

/**
 * BaseSheetService is responsible for interacting with Google Sheets.
 * It provides methods for loading and saving data, and initializes with a sheet name and model.
 *
 * @typedef {Object} TransactionService
 *
 * @property {GoogleAppsScript.Spreadsheet.Sheet|null} sheet - The Google Spreadsheet sheet object.
 * @property {Function|null} model - The model function used for processing rows.
 * @property {Transaction[]} data - The loaded data from the Google Sheet.
 * @property {string[]} headers - The column headers from the Google Sheet.
 * @property {Function} load - Loads the data from the Google Sheet into the `data` property.
 * @property {Function} save - Saves the `data` back into the Google Sheet.
 * @property {Function} sortSheet - Sorts the Google Sheet based on a given sort specification object.
 */

/**@type {} */
export let BaseSheetService;

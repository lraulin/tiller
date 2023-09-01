import { InitializationError, SheetError } from "../shared/errors.js";

import { BACKUP_POSTFIX } from "../shared/constants.js";
import { BaseSheetService } from "../shared/types.js";
import stampit from "stampit";
import { toCamelCase } from "../shared/strings.js";

const ERR_MSG_NO_SHEET = ": sheet not found";
const ERR_MSG_NO_MODEL = ": missing data model";

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

const hasData = (arr = []) => arr.some((v) => !!v);
const justLetters = (str) => str.toLowerCase().replace(/[^a-z]/g, "");

// Google Sheets API Helpers
const { getActiveSpreadsheet, getUi } = SpreadsheetApp;
const getSheetByName = (sheetName) =>
  getActiveSpreadsheet().getSheetByName(sheetName);
const getSheets = () => getActiveSpreadsheet().getSheets();
const alert = (msg) => getUi().alert(msg);

const BaseSheetServiceFactory = stampit({
  // #region PROPERTIES
  props: {
    sheet: null,
    sheetName: "",
    model: null,
    data: [],
  }, // #endregion PROPERTIES

  // #region INIT

  /**
   * @this {BaseSheetService}
   * @param {Object} param0
   * @param {string} param0.sheetName
   * @param {Function} param0.model
   */
  init({ sheetName, model }) {
    Logger.log("BaseSheetServiceFactory.init");
    Logger.log("sheetName: " + sheetName);
    Logger.log("model: " + model);
    this.sheetName = sheetName;
    this.sheet = getSheetByName(sheetName);
    if (!this.sheet)
      throw new InitializationError(`Unable to retrieve '${sheetName}' sheet`);
    this.model = model;
    this.load();
  }, // #endregion INIT

  // #region METHODS
  methods: {
    /**
     * @this {BaseSheetService}
     */
    get headers() {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return this.sheet
        .getRange(1, 1, 1, this.sheet.getLastColumn())
        .getValues()[0]
        .map((h) => String(h).trim());
    },

    get numColumns() {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return this.sheet.getLastColumn();
    },

    get lastRow() {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return this.sheet.getLastRow();
    },

    /** @this {BaseSheetService} */
    get highestBackupNumber() {
      const sheets = getSheets();
      if (!sheets.length) {
        throw new SheetError("No sheets found");
      }

      const sheetNames = sheets.map((sheet) => sheet.getName());
      const backupNumbers = sheetNames
        .filter((n) => n.includes(this.sheetName))
        .map((n) => {
          const match = n.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });
      const backupNumber = backupNumbers.length
        ? Math.max(...backupNumbers)
        : 0;
      return backupNumber;
    },

    /**
     * Loads data from sheet into memory
     * @this {BaseSheetService}
     */
    load() {
      Logger.log("Loading data from " + this.sheetName + " sheet");
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      if (this.model === null) throw new InitializationError(ERR_MSG_NO_MODEL);

      const [, ...rows] = this.sheet.getDataRange().getValues().filter(hasData);
      this.data = rows.map((row) => this.model?.(row));
      Logger.log("Loaded " + this.data.length + " rows");
      Logger.log(this.data);
    },

    /**
     * Writes in-memory data to sheet
     *
     * @this {BaseSheetService}
     */
    save() {
      Logger.log("Saving data to " + this.sheetName + " sheet");
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

      this.getRange().clearContent();

      const rows = this.data.map((t) => t.toArray());
      Logger.log(rows);
      this.getRange({ numRows: rows.length }).setValues(rows);
    },

    /**
     * Gets a range of cells from the sheet. Defaults to the entire sheet
     * excluding headers.
     * @this {BaseSheetService}
     * @returns {GoogleAppsScript.Spreadsheet.Range}
     */
    getRange({
      startRow = 2,
      startColumn = 1,
      numRows = this.lastRow,
      numColumns = this.numColumns,
    } = {}) {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return this.sheet.getRange(startRow, startColumn, numRows, numColumns);
    },
    /** @this {BaseSheetService} */
    sortSheet(sortSpecObj) {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      const range = this.sheet.getRange(
        2,
        1,
        this.sheet.getLastRow() - 1,
        this.sheet.getLastColumn()
      );
      range.sort(sortSpecObj);
      this.load();
    },

    /** @this {BaseSheetService} */
    sortByColumn({ columnName, ascending = true }) {
      const headers = this.headers.map(justLetters);
      const column = headers.indexOf(justLetters(columnName)) + 1;
      this.sortSheet({ column, ascending });
    },
    /** @this {BaseSheetService} */
    backup() {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

      const workBook = getActiveSpreadsheet();
      const number = this.highestBackupNumber + 1;

      this.sheet
        .copyTo(workBook)
        .setName(getBackupName(this.sheetName, number));
    },
    /** @this {BaseSheetService} */
    restore() {
      if (!this.sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

      const originalSheet = this.sheet;
      const backupName = getBackupName(
        this.sheetName,
        this.highestBackupNumber
      );
      const backupSheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName(backupName);
      if (!backupSheet)
        throw new SheetError(`Unable to retrieve '${backupName}' sheet`);

      const workBook = SpreadsheetApp.getActiveSpreadsheet();
      workBook.deleteSheet(originalSheet);
      backupSheet.copyTo(workBook).setName(this.sheetName);
      workBook.deleteSheet(backupSheet);
    },
  }, // #endregion METHODS
});

export default BaseSheetServiceFactory;

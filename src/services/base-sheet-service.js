import { InitializationError, SheetError } from "../shared/errors.js";

import { BACKUP_POSTFIX } from "../shared/constants.js";
import { BaseRowCreator } from "../models/base-row.js";

const ERR_MSG_NO_SHEET = ": sheet not found";

const { getActiveSpreadsheet } = SpreadsheetApp;
const getSheetByName = (sheetName) =>
  getActiveSpreadsheet().getSheetByName(sheetName);
const getSheets = () => getActiveSpreadsheet().getSheets();
const getBackupName = (
  sheetName,
  number,
  postfix = BACKUP_POSTFIX,
  separator = "_"
) => [sheetName, postfix, number].join(separator);

const hasData = (arr = []) => arr.some((v) => !!v);
const justLetters = (str) => str.toLowerCase().replace(/[^a-z]/g, "");

const BaseSheetServiceFactory = ({ sheetName }) => {
  let data = [];
  let headers = [];
  let keys = [];
  const sheet = getSheetByName(sheetName);
  if (!sheet)
    throw new InitializationError(`Unable to retrieve '${sheetName}' sheet`);

  Logger.log("BaseSheetServiceFactory.init");
  Logger.log("sheetName: " + sheetName);

  /**
   * Loads data from sheet into memory
   */
  // const load = () => {
  //   Logger.log("Loading data from " + sheetName + " sheet");
  //   if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

  //   const [, ...loadedData] = sheet.getDataRange().getValues().filter(hasData);
  //   Logger.log("Loaded " + data.length + " rows");
  //   Logger.log(data);
  //   data = loadedData;
  // };

  // load();
  // if (!data.length) {
  //   Logger.log("Something went wrong...");
  //   Logger.log("Failed to load data from sheet " + sheetName);
  //   throw new Error("Failed to load data from sheet " + sheetName);
  // }

  const load = () => {
    const [firstRow, ...rows] = sheet
      .getDataRange()
      .getValues()
      .filter(hasData);
    const rowCreator = BaseRowCreator(firstRow);
    data = rows.map(rowCreator);
  };
  load();

  // const save = () => {
  //   Logger.log("Saving data to " + sheetName + " sheet");
  //   if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

  //   getRange().clearContent();

  //   const rows = data.map((t) => t.toArray());
  //   Logger.log(rows);
  //   getRange({ numRows: rows.length }).setValues(rows);
  // };

  const save = () => {
    const rows = data.map((obj) =>
      camelHeaders.reduce((acc, header, i) => {
        acc[i] = obj[header];
        return acc;
      }, Array(camelHeaders.length).fill(""))
    );
    getRange().clearContent();

    getRange({ numRows: rows.length }).setValues(rows);
  };

  const getRange = ({
    startRow = 2,
    startColumn = 1,
    numRows = lastRow,
    numColumns = numColumns,
  } = {}) => {
    if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
    return sheet.getRange(startRow, startColumn, numRows, numColumns);
  };
  function sortSheet(sortSpecObj) {
    if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
    const range = sheet.getRange(
      2,
      1,
      sheet.getLastRow() - 1,
      sheet.getLastColumn()
    );
    range.sort(sortSpecObj);
    load();
  }

  const sortByColumn = ({ columnName, ascending = true }) => {
    const headers = headers.map(justLetters);
    const column = headers.indexOf(justLetters(columnName)) + 1;
    sortSheet({ column, ascending });
  };

  const backup = () => {
    if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

    const workBook = getActiveSpreadsheet();
    const number = highestBackupNumber + 1;

    sheet.copyTo(workBook).setName(getBackupName(sheetName, number));
  };

  const restore = () => {
    if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);

    const originalSheet = sheet;
    const backupName = getBackupName(sheetName, highestBackupNumber);
    const backupSheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(backupName);
    if (!backupSheet)
      throw new SheetError(`Unable to retrieve '${backupName}' sheet`);

    const workBook = SpreadsheetApp.getActiveSpreadsheet();
    workBook.deleteSheet(originalSheet);
    backupSheet.copyTo(workBook).setName(sheetName);
    workBook.deleteSheet(backupSheet);
  };

  const accessors = {
    get data() {
      return [...data];
    },

    set data(newData) {
      data = [...newData];
    },

    get headers() {
      if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return headers;
    },

    get numColumns() {
      if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return sheet.getLastColumn();
    },

    get lastRow() {
      if (!sheet) throw new InitializationError(ERR_MSG_NO_SHEET);
      return sheet.getLastRow();
    },

    get highestBackupNumber() {
      const sheets = getSheets();
      if (!sheets.length) {
        throw new SheetError("No sheets found");
      }

      const sheetNames = sheets.map((sheet) => sheet.getName());
      const backupNumbers = sheetNames
        .filter((n) => n.includes(sheetName))
        .map((n) => {
          const match = n.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });
      const backupNumber = backupNumbers.length
        ? Math.max(...backupNumbers)
        : 0;
      return backupNumber;
    },
  };

  const publicMethods = {
    load,
    save,
    getRange,
    sortSheet,
    sortByColumn,
    backup,
    restore,
  };

  return { ...accessors, ...publicMethods };
};

export default BaseSheetServiceFactory;

import Transaction from "./transaction.js";
import sheets from "../sheets/index.js";

const SHEET_NAME = "Transactions";

export default class TransactionsService {
  sheetName = SHEET_NAME;

  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /**@type {Transaction[]} */
  #transactions;

  constructor() {
    this.#sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!this.#sheet) throw new Error(`Sheet ${SHEET_NAME} not found`);
  }

  get expenses() {
    return this.#transactions.filter((t) => t.isExpense());
  }

  get income() {
    return this.#transactions.filter((t) => t.isIncome());
  }

  get firstTransactionDate() {}

  /**
   * Sorts transcactions by date descending.
   */
  sortByDate() {
    this.#transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Gets data from Transactions sheet.
   */
  loadData() {
    const [...rows] = sheet.getDataRange().getValues();
    this.#transactions = rows.map((row) => new Transaction(row));
  }
  /**
   * Updates Transactions sheet with current data.
   */

  saveData() {
    const data = this.#transactions.map((t) => t.toArray());
    sheets.overwrite(this.#sheetName, data);
  }

  /**
   * Creates a copy of the sheet appendded with "_BACKUP_{#}"
   */
  backup() {
    sheets.backup(this.#sheetName);
  }

  /**
   * Replaces Transaction sheet with the most recent backup.
   */
  restore() {
    sheets.restoreBackup(this.#sheetName);
  }
}

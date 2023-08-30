import DirectExpressTransaction from "../models/direct-express-transaction.js";
import sheets from "../shared/sheets.js";
import { transactionsByDateDescending } from "../shared/dates.js";

const DIRECT_EXPRESS = "DirectExpress";
const NUMBER_OF_COLUMNS = 8;

class DirectExpressService {
  sheetName = DIRECT_EXPRESS;
  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /**@type {DirectExpressTransaction[]} */
  #transactions;

  constructor() {
    this.#sheet = sheets.get(this.sheetName);
    this.load();
    Logger.log("DirectExpressService loaded");
    Logger.log(this.#transactions);
  }

  #validateRows(rows) {
    let valid = true;
    if (!rows.length) throw new Error("No rows to import");

    rows.array.forEach((row) => {
      if (row.length !== NUMBER_OF_COLUMNS) {
        valid = false;
        Logger.log("ERROR: Invalid row length: " + row.length);
        Logger.log(row);
      }
    });
    if (!valid) throw new Error("Invalid rows");
  }

  load() {
    const [, ...rows] = this.#sheet.getDataRange().getValues();
    this.#validateRows(rows);
    this.#transactions = rows.map((row) => new DirectExpressTransaction(row));
  }

  save() {
    const rows = this.#transactions.map((t) => t.toArray());
    sheets.overwrite(this.#sheet, rows);
  }

  get transactions() {
    return [...this.#transactions];
  }

  getNewTransactions(lastId) {
    if (lastId === undefined) return [...this.#transactions];
    return this.transactions.filter((t) => t.transactionId > lastId);
  }

  /**
   * Sorts transcactions by date descending.
   */
  sortByDateDescending() {
    this.#transactions.sort(transactionsByDateDescending);
  }

  /**
   * Removes duplicate transactions, keeping the ones lower in the sheet.
   */
  dedupe() {
    const lookup = this.#transactions.reduce((acc, c) => {
      acc[c.transactionId] = c;
      return acc;
    }, {});
    this.#transactions = Object.values(lookup);
    this.sortByDateDescending();
  }
}

export default new DirectExpressService();

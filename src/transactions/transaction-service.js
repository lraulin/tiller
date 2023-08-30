import Transaction from "./transaction.js";
import directExpress from "../direct-express/index.js";
import { getSheetByName } from "../utils.js";
import sheets from "../sheets/index.js";
import { sort } from "./main.js";

const TRANSACTIONS = "Transactions";

class TransactionsService {
  sheetName = TRANSACTIONS;

  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /**@type {Transaction[]} */
  #transactions;

  constructor() {
    this.#sheet = getSheetByName(TRANSACTIONS);
  }

  get expenses() {
    return this.#transactions.filter((t) => t.isExpense);
  }

  get income() {
    return this.#transactions.filter((t) => t.isIncome);
  }

  get firstTransactionDate() {
    const timeStamp = Math.min(
      ...this.#transactions.map((t) => t.date.getTime())
    );
    return new Date(timeStamp);
  }

  get lastTransactionDate() {
    const timeStamp = Math.max(
      ...this.#transactions.map((t) => t.date.getTime())
    );
    return new Date(timeStamp);
  }

  get lastFromDirectExpress() {
    sort();
    return this.#transactions.filter((t) => t.isFromDirectExpress)?.[0];
  }

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
    const [...rows] = this.#sheet.getDataRange().getValues();
    this.#transactions = rows.map((row) => new Transaction(row));
  }
  /**
   * Updates Transactions sheet with current data.
   */

  saveData() {
    const data = this.#transactions.map((t) => t.toArray());
    sheets.overwrite(this.#sheet, data);
  }

  getById(id) {
    return this.#transactions.find((t) => t.transactionId === id);
  }

  /**
   * Creates a copy of the sheet appendded with "_BACKUP_{#}"
   */
  backup() {
    sheets.backup(this.sheetName);
  }

  /**
   * Replaces Transaction sheet with the most recent backup.
   */
  restore() {
    sheets.restoreBackup(this.sheetName);
  }

  importDirectExpress() {
    sheets.backup(TRANSACTIONS);
    const pendingTransactions = this.#transactions.filter((t) => t.isPending);

    const afterTransId = parseInt(this.lastFromDirectExpress.transactionId);
    if (Number.isNaN(afterTransId))
      throw new Error("Invalid Direct Express transaction id");

    const directExpressImports = directExpress.getDirectExpressTransactions({
      afterTransId,
    });

    this.#transactions = [
      ...this.#transactions,
      ...directExpressImports.map((d) => new Transaction(d)),
    ];

    // Preserve category of pending transactions
    pendingTransactions.forEach((t) => {
      const transaction = this.getById(t.transactionId);

      if (transaction === undefined) {
        Logger.log(
          `Transaction ${t.transactionId} not found in import; keeping old version`
        );
        this.#transactions.push(t);
        return;
      }

      transaction.category = t.category;
    });

    this.sortByDate();
    this.saveData();
  }
}

export default new TransactionsService();

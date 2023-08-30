import {
  areSame,
  getDateRange,
  startOf,
  transactionsByDateDescending,
} from "../shared/dates.js";

import Transaction from "../models/transaction.js";
import sheets from "../shared/sheets.js";

const TRANSACTIONS = "Transactions";

const sumTransactions = (transactions) =>
  transactions.reduce((a, c) => a + c.amount, 0);

class TransactionsService {
  sheetName = TRANSACTIONS;

  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /**@type {Transaction[]} */
  #transactions;

  constructor() {
    this.#sheet = sheets.get(TRANSACTIONS);
    this.load();
    Logger.log("TransactionsService loaded");
    Logger.log(this.#transactions);
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

  get lastNonPendingFromDirectExpress() {
    this.sortByDateDescending();
    return this.#transactions.filter(
      (t) => t.isFromDirectExpress && !t.isPending
    )?.[0];
  }

  get pendingTransactions() {
    return [...this.#transactions.filter((t) => t.isPending)];
  }

  get nonPendingTransactions() {
    return [...this.#transactions.filter((t) => !t.isPending)];
  }

  /**
   * Sorts transcactions by date descending.
   */
  sortByDateDescending() {
    this.#transactions.sort(transactionsByDateDescending);
  }

  getTransactionInDateRange(start = undefined, stop = undefined) {
    const startDate = start ?? this.firstTransactionDate;
    const stopDate = stop ?? this.lastTransactionDate;
    return this.#transactions.filter(
      (t) => t.date >= startDate && t.date <= stopDate
    );
  }

  /**
   *
   * @param {"day"|"week"|"month"} unit
   * @param {Date} date
   */
  getTransactionByTimeUnit(unit, date) {
    const areSameUnit = areSame(unit);
    return this.#transactions.filter((t) => areSameUnit(t.date, date));
  }

  /**
   * Gets data from Transactions sheet.
   */
  load() {
    const [, ...rows] = this.#sheet.getDataRange().getValues();
    this.#transactions = rows.map((row) => new Transaction(row));
  }
  /**
   * Updates Transactions sheet with current data.
   */

  save() {
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

  /**
   * Returns an array of arrays (suitable for table data) with total start date
   * and amount total for each period supplied. I.e. if unit is 'days',
   * will return amount total for each day within the given date range.
   * If month, it will return a total for each month range, etc.
   *
   */
  #getSpendingReportData({
    unit,
    lastDate,
    firstDate = this.firstTransactionDate,
  }) {
    /**@type {function(Date):Date} */
    const startOfUnit = startOf(unit);

    const dates = getDateRange(
      startOfUnit(firstDate),
      startOfUnit(lastDate),
      unit
    );

    return dates.map((date) => {
      const total = Math.abs(
        sumTransactions(this.getTransactionByTimeUnit(unit, date))
      );
      return [date, total];
    });
  }

  #generateSpendingReport({ unit, string }) {
    const data = this.#getSpendingReportData({
      lastDate: new Date(),
      unit,
    });
    const sheet = sheets.get(string);
    sheet.clearContents();
    sheets.append(sheet, data);
  }

  generateAllReports() {
    const params = [
      { unit: "day", string: "Daily" },
      { unit: "week", string: "Weekly" },
      { unit: "month", string: "Monthly" },
    ];
    params.forEach(this.#generateSpendingReport);
  }

  updateFromDirectExpress(newTransactions) {
    // Preserve category of pending transactions while replacing old with new.
    const pendingIds = this.pendingTransactions.map((t) => t.transactionId);
    const transactionsToAdd = newTransactions.map((t) => {
      if (pendingIds.includes(t.transactionId)) {
        const old = this.getById(t.transactionId);
        if (!old)
          throw new Error(
            "Transaction with ID " +
              t.transactionId +
              " wasn't found, but it should be there..."
          );
        t.category = old.category;
      }
      return t;
    });
    this.#transactions = [...this.nonPendingTransactions, ...transactionsToAdd];
  }
}

export default new TransactionsService();

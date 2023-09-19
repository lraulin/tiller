import {
  areSame,
  getDateRange,
  startOf,
  transactionsByDateDescending,
} from "../shared/dates.js";

import BaseSheetService from "./base-sheet-service";
import Transaction from "../models/transaction";

const sumTransactions = (transactions) =>
  transactions.reduce((a, c) => a + c.amount, 0);

class TransactionService extends BaseSheetService<Transaction> {
  constructor() {
    super("Transactions", Transaction);
  }

  get expenses() {
    return this.data.filter((t) => t.isExpense);
  }

  get income() {
    return this.data.filter((t) => t.isIncome);
  }

  get firstTransactionDate() {
    const timeStamp = Math.min(
      ...this.data.map((t) => t.date?.getTime() || Number.MAX_SAFE_INTEGER)
    );
    return new Date(timeStamp);
  }

  get lastTransactionDate() {
    const timeStamp = Math.max(...this.data.map((t) => t.date?.getTime() || 0));
    return new Date(timeStamp);
  }

  get lastNonPendingFromDirectExpress() {
    // sort
    return this.data.filter((t) => t.isFromDirectExpress && !t.isPending)?.[0];
  }

  get pendingTransactions() {
    return [...this.data.filter((t) => t.isPending)];
  }

  get nonPendingTransactions() {
    return [...this.data.filter((t) => !t.isPending)];
  }

  sortByDateDescending() {
    this.data.sort(transactionsByDateDescending);
  }

  getTransactionInDateRange(start = undefined, stop = undefined) {
    const startDate = start ?? this.firstTransactionDate;
    const stopDate = stop ?? this.lastTransactionDate;
    return this.data.filter(
      (t) => t.date !== null && t.date >= startDate && t.date <= stopDate
    );
  }

  getTransactionByTimeUnit(unit, date) {
    const areSameUnit = areSame(unit);
    return this.data.filter((t) => areSameUnit(t.date, date));
  }

  getSpendingReportData({
    unit,
    lastDate,
    firstDate = this.firstTransactionDate,
  }) {
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

  generateSpendingReport({ unit, sheetName }) {
    const data = this.getSpendingReportData({
      lastDate: new Date(),
      unit,
    });
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) throw new Error(`Unable to find sheet ${sheetName}`);
    sheet.clearContents();
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
  }

  generateAllReports() {
    this.generateSpendingReport({ unit: "day", sheetName: "Daily" });
    this.generateSpendingReport({ unit: "week", sheetName: "Weekly" });
    this.generateSpendingReport({ unit: "month", sheetName: "Monthly" });
  }

  getById(id) {
    return this.data.find((t) => t.transactionId === id);
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
    this.data = [...this.nonPendingTransactions, ...transactionsToAdd];
  }

  generatePenFedIds() {
    this.data = this.data.map((t) => {
      if (t.isPenFed) {
        const id =
          "pf" +
          t.date.toISOString().slice(0, 10) +
          t.amount.toFixed(2).replace(".", "") +
          t.description.slice(0, 3);
        t.transactionId = id;
      }
      return t;
    });
    this.save();
  }
}

export default new TransactionService();

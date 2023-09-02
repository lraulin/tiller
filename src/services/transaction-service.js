import {
  areSame,
  getDateRange,
  startOf,
  transactionsByDateDescending,
} from "../shared/dates.js";

import BaseSheetServiceFactory from "./base-sheet-service.js";
import Transaction from "../models/transaction.js";

const sumTransactions = (transactions) =>
  transactions.reduce((a, c) => a + c.amount, 0);

const TransactionServiceFactory = () => {
  const base = BaseSheetServiceFactory({ sheetName: "Transactions" });
  base.data = base.data.map((row) => Transaction(row));

  const methods = {
    get expenses() {
      return base.data.filter((t) => t.isExpense);
    },

    get income() {
      return base.data.filter((t) => t.isIncome);
    },

    get firstTransactionDate() {
      const timeStamp = Math.min(
        ...base.data.map((t) => t.date?.getTime() || Number.MAX_SAFE_INTEGER)
      );
      return new Date(timeStamp);
    },

    get lastTransactionDate() {
      const timeStamp = Math.max(
        ...base.data.map((t) => t.date?.getTime() || 0)
      );
      return new Date(timeStamp);
    },

    get lastNonPendingFromDirectExpress() {
      // sort
      return base.data.filter(
        (t) => t.isFromDirectExpress && !t.isPending
      )?.[0];
    },

    get pendingTransactions() {
      return [...base.data.filter((t) => t.isPending)];
    },

    get nonPendingTransactions() {
      return [...base.data.filter((t) => !t.isPending)];
    },

    sortByDateDescending() {
      base.data.sort(transactionsByDateDescending);
    },

    getTransactionInDateRange(start = undefined, stop = undefined) {
      const startDate = start ?? this.firstTransactionDate;
      const stopDate = stop ?? this.lastTransactionDate;
      return base.data.filter(
        (t) => t.date !== null && t.date >= startDate && t.date <= stopDate
      );
    },

    getTransactionByTimeUnit(unit, date) {
      const areSameUnit = areSame(unit);
      return base.data.filter((t) => areSameUnit(t.date, date));
    },

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
    },

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
      sheet
        .getRange(lastRow + 1, 1, data.length, data[0].length)
        .setValues(data);
    },

    generateAllReports() {
      this.generateSpendingReport({ unit: "day", sheetName: "Daily" });
      this.generateSpendingReport({ unit: "week", sheetName: "Weekly" });
      this.generateSpendingReport({ unit: "month", sheetName: "Monthly" });
    },

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
      base = [...this.nonPendingTransactions, ...transactionsToAdd];
    },
  };

  return { ...base, ...methods };
};

export default TransactionServiceFactory();

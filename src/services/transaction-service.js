import {
  areSame,
  getDateRange,
  startOf,
  transactionsByDateDescending,
} from "../shared/dates.js";

import Transaction from "../models/transaction.js";
import sheets from "../shared/sheets.js";
import BaseSheetService from "./base-sheet-service.js";
import stampit from "stampit";

const sumTransactions = (transactions) =>
  transactions.reduce((a, c) => a + c.amount, 0);

const TransactionService = stampit(
  BaseSheetService({ sheetName: "Transactions", model: Transaction }),
  {
    methods: {
      get expenses() {
        return this.#transactions.filter((t) => t.isExpense);
      },

      get income() {
        return this.#transactions.filter((t) => t.isIncome);
      },

      get firstTransactionDate() {
        const timeStamp = Math.min(...this.data.map((t) => t.date.getTime()));
        return new Date(timeStamp);
      },

      get lastTransactionDate() {
        const timeStamp = Math.max(...this.data.map((t) => t.date.getTime()));
        return new Date(timeStamp);
      },

      get lastNonPendingFromDirectExpress() {
        // sort
        return this.data.filter(
          (t) => t.isFromDirectExpress && !t.isPending
        )?.[0];
      },

      get pendingTransactions() {
        return [...this.data.filter((t) => t.isPending)];
      },

      get nonPendingTransactions() {
        return [...this.data.filter((t) => !t.isPending)];
      },

      sortByDateDescending() {
        this.data.sort(transactionsByDateDescending);
      },

      getTransactionInDateRange(start = undefined, stop = undefined) {
        const startDate = start ?? this.firstTransactionDate;
        const stopDate = stop ?? this.lastTransactionDate;
        return this.data.filter(
          (t) => t.date >= startDate && t.date <= stopDate
        );
      },

      getTransactionByTimeUnit(unit, date) {
        const areSameUnit = areSame(unit);
        return this.data.filter((t) => areSameUnit(t.date, date));
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

      generateSpendingReport({ unit, string }) {
        const data = this.getSpendingReportData({
          lastDate: new Date(),
          unit,
        });
        const sheet = sheets.get(string);
        sheet.clearContents();
        sheets.append(sheet, data);
      },

      generateAllReports() {
        const params = [
          { unit: "day", string: "Daily" },
          { unit: "week", string: "Weekly" },
          { unit: "month", string: "Monthly" },
        ];
        params.forEach(this.generateSpendingReport);
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
        this.data = [...this.nonPendingTransactions, ...transactionsToAdd];
      },
    },
  }
);

export default TransactionService;

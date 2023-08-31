import {
  areSame,
  getDateRange,
  startOf,
  transactionsByDateDescending,
} from "../shared/dates.js";

import BaseSheetService from "./base-sheet-service.js";
import Transaction from "../models/transaction.js";
import { TransactionService } from "../shared/types.js";
import sheets from "../shared/sheets.js";
import stampit from "stampit";

const sumTransactions = (transactions) =>
  transactions.reduce((a, c) => a + c.amount, 0);

const TransactionServiceFactory = stampit(BaseSheetService, {
  methods: {
    /**@this {TransactionService} */
    get expenses() {
      return this.data.filter((t) => t.isExpense);
    },

    /**@this {TransactionService} */
    get income() {
      return this.data.filter((t) => t.isIncome);
    },

    /**@this {TransactionService} */
    get firstTransactionDate() {
      const timeStamp = Math.min(
        ...this.data.map((t) => t.date?.getTime() || Number.MAX_SAFE_INTEGER)
      );
      return new Date(timeStamp);
    },

    /**@this {TransactionService} */
    get lastTransactionDate() {
      const timeStamp = Math.max(
        ...this.data.map((t) => t.date?.getTime() || 0)
      );
      return new Date(timeStamp);
    },

    /**@this {TransactionService} */
    get lastNonPendingFromDirectExpress() {
      // sort
      return this.data.filter(
        (t) => t.isFromDirectExpress && !t.isPending
      )?.[0];
    },

    /**@this {TransactionService} */
    get pendingTransactions() {
      return [...this.data.filter((t) => t.isPending)];
    },

    /**@this {TransactionService} */
    get nonPendingTransactions() {
      return [...this.data.filter((t) => !t.isPending)];
    },

    /**@this {TransactionService} */
    sortByDateDescending() {
      this.data.sort(transactionsByDateDescending);
    },

    /**@this {TransactionService} */
    getTransactionInDateRange(start = undefined, stop = undefined) {
      const startDate = start ?? this.firstTransactionDate;
      const stopDate = stop ?? this.lastTransactionDate;
      return this.data.filter(
        (t) => t.date !== null && t.date >= startDate && t.date <= stopDate
      );
    },

    /**@this {TransactionService} */
    getTransactionByTimeUnit(unit, date) {
      const areSameUnit = areSame(unit);
      return this.data.filter((t) => areSameUnit(t.date, date));
    },

    /**@this {TransactionService} */
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

    /**@this {TransactionService} */
    generateSpendingReport({ unit, string }) {
      const data = this.getSpendingReportData({
        lastDate: new Date(),
        unit,
      });
      const sheet = sheets.get(string);
      sheet.clearContents();
      sheets.append(sheet, data);
    },

    /**@this {TransactionService} */
    generateAllReports() {
      const params = [
        { unit: "day", string: "Daily" },
        { unit: "week", string: "Weekly" },
        { unit: "month", string: "Monthly" },
      ];
      params.forEach(this.generateSpendingReport);
    },

    /**@this {TransactionService} */
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
});

/** @type {TransactionService} */
const service = TransactionServiceFactory({
  sheetName: "Transactions",
  model: Transaction,
});
const getTransactionService = () => service;
export default getTransactionService;

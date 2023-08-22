/**@typedef {import("./types").Transaction} Transaction */
/**@typedef {import("./types").TimeUnit} TimeUnit */
/**@typedef {import("./types").TransactionRow} TransactionRow */
import dayjs from "dayjs";
import { areSame, ascending, descending, getDateRange } from "./utils";
import { transactionToRow } from "./converters";

/**
 * @typedef {Object} TransactionStore
 * @property {Transaction[]} transactions
 * @property {function(Transaction[]):undefined} init
 * @property {function():number} count
 * @property {function():number} sum
 * @property {function():number} sum
 */
const TransactionStore = {
  /**@type {Transaction[]} */
  transactions: [],
  /**@type {Transaction[]} */
  expenses: [],
  /**@type {Transaction[]} */
  income: [],
  /**
   * Initializes object.
   * @param {Transaction[]} transactions
   */
  init(transactions) {
    this.transactions = transactions;
  },
  /**@returns {number}*/
  count() {
    return this.transactions.length;
  },
  /** @returns {number}*/
  sum() {
    return this.transactions.map((t) => t.amount).reduce((a, c) => a + c, 0);
  },
  /**
   *
   * @param {function(Transaction):boolean} predicate
   * @returns
   */
  filter(predicate) {
    const filtered = this.transactions.filter(predicate);
    return createTransactionStore(filtered);
  },
  /**@returns {TransactionStore}*/
  expenses() {
    const 
    return createTransactionStore(expenses);
  },
  /**@returns {TransactionStore} */
  income() {
    const income = this.transactions.filter((t) => t.type === "Income");
    return createTransactionStore(income);
  },
  /**@returns {Date} */
  firstDate() {
    return new Date(
      this.transactions.map((t) => t.date.getTime()).sort(ascending)[0]
    );
  },
  /**@returns {Date} */
  lastDate() {
    return new Date(
      this.transactions.map((t) => t.date.getTime()).sort(descending)[0]
    );
  },
  /**
   *
   * @param {TimeUnit} unit
   * @param {Date} lastDate
   * @param {Date=} firstDate
   * @returns {[Date, number][]}
   */
  spendingData(unit, lastDate, firstDate = this.getFirstTransactionDate()) {
    /**@type {function(Date):Date} */
    const startOf = (d) => dayjs(d).startOf(unit).toDate();

    const dates = getDateRange(startOf(firstDate), startOf(lastDate), "week");

    return dates.map((date) => {
      const total = this.filter((t) => areSame(unit)(t.date, date)).sum();
      return [date, total];
    });
  },
  /**@returns {TransactionRow[]} */
  toRows() {
    return this.transactions.map(transactionToRow);
  },
};

/**
 *
 * @param {Transaction[]} transactions
 * @returns {TransactionStore}
 */
function createTransactionStore(transactions = []) {
  const transactionsArray = Object.create(TransactionStore);
  transactionsArray.init(transactions);
  return transactionsArray;
}

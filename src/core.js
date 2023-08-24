/**@typedef {import("./services/categories.js").Category} Category */
/**@typedef {import("./types").DirectExpressRow} DirectExpressRow */
/**@typedef {import("./services/direct-express.js").DirectExpressTransaction} DirectExpressTransaction */
/**@typedef {import("./services/tiller-transaction.js").Transaction} Transaction */
/**@typedef {import("./services/categories.js").TimeUnit} TimeUnit */
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import { ascending, getDateRange, isValidDate, startOf } from "./utils.js";

dayjs.extend(isBetween);

/**
 *
 * @param {Transaction[]} transactions
 */
export const filterToExpenses = (transactions) =>
  transactions.filter((t) => t.hidden === false && t.type === "Expense");

/**
 *
 * @param {Transaction[]} transactions
 * @returns {Date}
 */
const getFirstTransactionDate = (transactions) => {
  if (transactions.length === 0) throw new Error("called with empty array");
  const firstDateTimeStamp = transactions
    .map((t) => {
      if (!t.date) throw new Error("Transaction missing date");
      if (!t.date.getTime) throw new Error("Invalid date in transaction");
      return t.date.getTime();
    })
    .sort(ascending)[0];
  const firstTransactionDate = new Date(firstDateTimeStamp);
  if (!isValidDate)
    throw new Error(
      "Invalid date; " +
        JSON.stringify({ firstDateTimeStamp, firstTransactionDate })
    );
  return firstTransactionDate;
};

/**
 *
 * @param {number[]} arr
 * @returns {number}
 */
const sum = (arr) => arr.reduce((a, c) => a + c, 0);

/**
 *
 * @param {Transaction[]} transactions
 */
const sumTransactionAmounts = (transactions) =>
  sum(transactions.map((t) => t.amount));

/**
 * Returns an array of arrays (suitable for table data) with total start date
 * and amount total for each period supplied. I.e. if unit is 'days',
 * will return amount total for each day within the given date range.
 * If month, it will return a total for each month range, etc.
 *
 * @param {Object} args
 * @param {Transaction[]} args.transactions
 * @param {TimeUnit} args.unit
 * @param {Date} args.lastDate
 * @param {Date=} args.firstDate
 * @returns {[Date, number][]}
 */
export const getSpendingData = ({
  transactions,
  unit,
  lastDate,
  firstDate = getFirstTransactionDate(transactions),
}) => {
  /**@type {function(Date):Date} */
  const startOfUnit = startOf(unit);

  const dates = getDateRange(
    startOfUnit(firstDate),
    startOfUnit(lastDate),
    unit
  );

  return dates.map((date) => {
    const total = Math.abs(
      sumTransactionAmounts(
        transactions.filter((t) => dayjs(t.date).isSame(date, unit))
      )
    );
    return [date, total];
  });
};

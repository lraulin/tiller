import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { rowToCategory } from "./converters";
import { ascending, getDateRange, getDayRange, startOfDate } from "./utils";
import { transcode } from "buffer";

dayjs.extend(isBetween);

/**
 *
 *
 * @param {import("./types").CategoryRow[]} categoryRows
 * @param {import("./types").TransactionRow[]} transactionRows
 * @returns {import("./types").Transaction[]}
 */
export const rowsToTransactions = (categoryRows, transactionRows) => {
  const categoryLookup = Object.fromEntries(
    categoryRows.map(rowToCategory).map((c) => [c.name, c])
  );
  return transactionRows.map((r) => {
    const [
      ,
      date,
      description,
      category,
      amount,
      account,
      accountNumber,
      institution,
      month,
      week,
      transactionId,
      accountId,
      checkNumber,
      fullDescription,
      dateAdded,
      categorizedDate,
    ] = r;
    const type = categoryLookup[category]?.type ?? "Uncategorized";
    const hidden = categoryLookup[category]?.hidden ?? false;

    return {
      date,
      description,
      category,
      type,
      hidden,
      amount,
      account,
      accountNumber,
      institution,
      month,
      week,
      transactionId,
      accountId,
      checkNumber,
      fullDescription,
      dateAdded,
      categorizedDate,
    };
  });
};

/**
 *
 * @param {import("./types").Transaction[]} transactions
 */
export const filterToExpenses = (transactions) =>
  transactions.filter((t) => t.hidden === false && t.type === "Expense");

const getFirstTransactionDate = (transactions) =>
  new Date(transactions.map((t) => t.date.getTime()).sort(ascending)[0]);

/**
 *
 * @param {number[]} arr
 * @returns {number}
 */
const sum = (arr) => arr.reduce((a, c) => a + c, 0);

/**
 *
 * @param {import("./types").Transaction[]} transactions
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
 * @param {import("./types").Transaction[]} args.transactions
 * @param {import("./types").TimeUnit} args.unit
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
  const startOf = (d) => dayjs(d).startOf(unit).toDate();

  const dates = getDateRange(startOf(firstDate), startOf(lastDate), "week");
  return dates.map((date) => {
    const total = sumTransactionAmounts(
      transactions.filter((t) => dayjs(t.date).isSame(date, unit))
    );
    return [date, total];
  });
};

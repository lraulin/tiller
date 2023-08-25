import { ascending, getDateRange, isValidDate, startOf } from "./utils.js";

import { TimeUnit } from "./categories/types.js";
import { Transaction } from "./transactions/types.js";
import dayjs from "dayjs";
import { getFirstTransactionDate } from "./transactions/main.js";
import isBetween from "dayjs/plugin/isBetween.js";

dayjs.extend(isBetween);

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
  firstDate = getFirstTransactionDate(),
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

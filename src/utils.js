import dayjs from "dayjs";

/**
 *
 * @param {Date} start
 * @param {Date} stop
 * @param {import("./types").TimeUnit} unit
 * @returns {Date[]}
 */
export const getDateRange = (start, stop, unit) => {
  const totalDays = dayjs(stop).diff(start, unit) + 1;
  return Array(totalDays)
    .fill(undefined)
    .map((_, i) => dayjs(stop).subtract(i, unit).toDate());
};

/**
 *
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const ascending = (a, b) => a - b;

/**
 *
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const descending = (a, b) => b - a;

const log = (x) => {
  const [k, v] = Object.entries(x)[0];
  Logger.log("*** " + k + " ***");
  Logger.log(v);
};

/**
 *
 * @param {Array[number]} arr
 * @returns {number}
 */
const sum = (arr) => arr.reduce((a, c) => a + c, 0);

/**
 *
 *
 * @param {import("./types").Transaction[]} transactions
 * @returns {number[]}
 */
const getAmounts = (transactions) => transactions.map((t) => t.amount);

/**
 *
 * @param {Array[number]} arr
 * @returns {Array[number]}
 */
const negatives = (arr) => arr.filter((n) => n < 0);

/**
 *
 * @param {Date} date
 * @returns {Date}
 */
export const previousWeekStartDate = (date) =>
  dayjs(date).startOf("week").add(-7, "day").toDate();

const combineFilters =
  (...filters) =>
  (item) => {
    return filters.map((filter) => filter(item)).every((x) => x === true);
  };

/**
 *
 * @param {Date} date
 * @returns {Date}
 */
export const startOfDate = (date) => dayjs(date).startOf("day").toDate();

/**@type {function(import("./types").TimeUnit):function(Date, Date): boolean} */
export const areSame = (unit) => (a, b) => dayjs(a).isSame(b, unit);

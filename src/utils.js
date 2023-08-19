import dayjs from "dayjs";

/**
 *
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const ascending = (a, b) => a - b;

/**
 *
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const descending = (a, b) => b - a;

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
 * @param {Transaction[]} transactions
 * @returns {number[]}
 */
const getAmounts = (transactions) => transactions.map((t) => t.amount);

/**
 *
 * @param {Array[number]} arr
 * @returns {Array[number]}
 */
const negatives = (arr) => arr.filter((n) => n < 0);

const prevWeekStartDate = (date = new Date()) =>
  dayjs(date).startOf("week").add(-7, "day");

const combineFilters =
  (...filters) =>
  (item) => {
    return filters.map((filter) => filter(item)).every((x) => x === true);
  };

const newDateNoTime = () => dayjs().startOf("day");

import { TimeUnit } from "./categories/types.js";
import { Transaction } from "./transactions/types.js";
import dayjs from "dayjs";

/**
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @param {TimeUnit} unit
 * @returns {Date[]}
 */
export const getDateRange = (dateA, dateB, unit) => {
  const start = dayjs(dateA).isBefore(dateB) ? dateA : dateB;
  const stop = dayjs(dateA).isBefore(dateB) ? dateB : dateA;
  const totalDays = dayjs(stop).diff(start, unit) + 1;
  if (totalDays < 0)
    throw new Error(
      "totalDays is negative;" +
        JSON.stringify({ start, stop, totalDays, unit })
    );
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

export const startOf = (unit) => (date) => dayjs(date).startOf(unit).toDate();
export const startOfDate = startOf("day");
export const startOfWeek = startOf("week");
export const startOfMonth = startOf("month");

/**
 * Returns a functions that checks if the two dates are within the same
 * unit supplied (day, week, month, etc.)
 *
 * @param {TimeUnit} unit
 * @returns {function(Date, Date):boolean}
 */
export const areSame = (unit) => (a, b) => dayjs(a).isSame(b, unit);

/**
 * Checks if a Date object is valid.
 *
 * @param {Date} d
 * @returns {boolean}
 */
export const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

/**
 * Get data from sheet as array of objects with keys matching column headers.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @returns
 */
export const getDataFromSheet = (sheet) => {
  if (!sheet) throw new Error("Called 'getDatafrom sheet' with falsy argument");

  const [headers, ...data] = sheet.getDataRange().getValues();

  return data.map((row) => {
    return row.reduce((acc, value, i) => {
      const key = headers[i];
      if (key === "") return acc;
      return { ...acc, [key]: value };
    }, {});
  });
};

/**
 *
 * @param {string} name
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
export const getSheetByName = (name) => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (sheet === null) throw new Error(`Sheet ${name} not found`);
  return sheet;
};

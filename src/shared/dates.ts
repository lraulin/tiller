import dayjs from "dayjs";

export const parseDate = (date: string): Date => dayjs(date).toDate();
export const formatDate = (date: Date): string =>
  dayjs(date).format("M/D/YYYY");

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
 * @param {Date} date
 * @returns {Date}
 */
export const previousWeekStartDate = (date) =>
  dayjs(date).startOf("week").add(-7, "day").toDate();

export const startOf = (unit) => (date) => dayjs(date).startOf(unit).toDate();
export const startOfDate = startOf("day");
export const startOfWeek = startOf("week");
export const startOfMonth = startOf("month");

/**
 * Returns a functions that checks if the two dates are within the same
 * unit supplied (day, week, month, etc.)
 *
 * @param {dayjs.OpUnitType} unit
 * @returns {function(Date?, Date?):boolean}
 */
export const areSame = (unit) => (a, b) => dayjs(a).isSame(b, unit);

/**
 * Checks if a Date object is valid.
 *
 * @param {Date} d
 * @returns {boolean}
 */
export const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

export const transactionsByDateDescending = (a, b) =>
  b.date.getTime() - a.date.getTime();

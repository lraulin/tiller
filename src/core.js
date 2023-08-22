/**@typedef {import("./types").Category} Category */
/**@typedef {import("./types").CategoryRow} CategoryRow */
/**@typedef {import("./types").DirectExpressRow} DirectExpressRow */
/**@typedef {import("./types").DirectExpressTransaction} DirectExpressTransaction */
/**@typedef {import("./types").TimeUnit} TimeUnit */
/**@typedef {import("./types").Transaction} Transaction */
/**@typedef {import("./types").TransactionRow} TransactionRow */
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import { ascending, descending, getDateRange } from "./utils.js";
import { directExpress } from "./consts.js";
import { directExpressRowToObj } from "./types.js";

dayjs.extend(isBetween);

/**
 *
 *
 * @param {CategoryRow} r
 * @return {Category}
 */
export const rowToCategory = (r) => {
  const [name, group, type, hideFromReports] = r;
  return {
    name,
    group,
    type,
    hidden: hideFromReports === "Hidden" ? true : false,
  };
};

/**
 *
 *
 * @param {CategoryRow[]} categoryRows
 * @param {TransactionRow[]} transactionRows
 * @returns {Transaction[]}
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
      categorizedDate: categorizedDate ?? null,
    };
  });
};

/**
 *
 * @param {Transaction[]} transactions
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
  const startOf = (d) => dayjs(d).startOf(unit).toDate();

  const dates = getDateRange(startOf(firstDate), startOf(lastDate), "week");
  return dates.map((date) => {
    const total = sumTransactionAmounts(
      transactions.filter((t) => dayjs(t.date).isSame(date, unit))
    );
    return [date, total];
  });
};

/**
 *
 * @param {DirectExpressTransaction} directExpressRow
 * @returns {Transaction}
 */
const directExpressToTiller = ({
  date,
  transactionId,
  description,
  amount,
  city,
  state,
  country,
  isPending,
}) => ({
  date,
  amount,
  category: "",
  type: "Uncategorized",
  account: directExpress.ACCOUNT_NAME,
  institution: directExpress.INSTITUTION,
  accountNumber: directExpress.ACCOUNT_NUMBER,
  description: isPending ? "[PENDING] " + description : description,
  fullDescription: [city, state, country].join(", "),
  transactionId: String(transactionId),
  accountId: "",
  checkNumber: "",
  month: dayjs(date).startOf("month").toDate(),
  week: dayjs(date).startOf("week").toDate(),
  dateAdded: new Date(),
  categorizedDate: null,
  hidden: false,
});

/**
 *
 * @param {Transaction[]} transactions
 * @param {DirectExpressRow[]} directExpressRows
 */
export const getNewTransactionsFromDirectExpress = (
  transactions,
  directExpressRows
) => {
  const mostRecentId = transactions
    .filter((t) => t.account === "Direct Express")
    .map((t) => Number(t.transactionId))
    .sort(descending)?.[0];
  const newImports = directExpressRows
    .map(directExpressRowToObj)
    .filter((t) => t.transactionId > mostRecentId);
  const newTillerTransactions = newImports.map(directExpressToTiller);
  return newTillerTransactions;
};

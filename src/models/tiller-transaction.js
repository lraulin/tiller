/**@typedef {import("../types").TimeUnit} TimeUnit */
/**@typedef {import("../types").CategoryRow} CategoryRow */
/**@typedef {import("../types").CategoryType} CategoryType */
/**@typedef {import("../types").DirectExpressRow} DirectExpressRow */

import { startOfMonth, startOfWeek } from "../utils.js";

/**
 * Represents an item from the Transaction table.
 * @typedef {object} Transaction
 * @property {Date} date
 * @property {number} amount
 * @property {string} category
 * @property {CategoryType} type
 * @property {boolean} hidden
 * @property {string} account
 * @property {string} institution
 * @property {string} accountNumber
 * @property {string} description
 * @property {string} fullDescription
 * @property {string} transactionId
 * @property {string} accountId
 * @property {string} checkNumber
 * @property {Date} month
 * @property {Date} week
 * @property {Date} dateAdded
 * @property {Date|undefined} categorizedDate
 * @property {function():any[]} toRow
 */

/**
 *
 *
 * @param {object} data{
 * @param {Date=}  data.date = new Date(),
 * @param {number=} data.amount = 0,
 * @param {string=} data.category = "",
 * @param {CategoryType=}  data.type = "Uncategorized",
 * @param {boolean=}  data.hidden = false,
 * @param {string=}  data.account = "",
 * @param {string=}  data.institution = "",
 * @param {string=}  data.accountNumber = "",
 * @param {string=}  data.description = "",
 * @param {string=}  data.fullDescription = "",
 * @param {string=}  data.transactionId = "",
 * @param {string=}  data.accountId = "",
 * @param {string=}  data.checkNumber = "",
 * @param {Date=}  data.month = startOfMonth(date),
 * @param {Date=}  data.week = startOfWeek(date),
 * @param {Date=}  data.dateAdded = new Date(),
 * @param {Date=}  data.categorizedDate = null,
 * @return {Transaction}
 */
export const createTransaction = ({
  date = new Date(),
  amount = 0,
  category = "",
  type = "Uncategorized",
  hidden = false,
  account = "",
  institution = "",
  accountNumber = "",
  description = "",
  fullDescription = "",
  transactionId = "",
  accountId = "",
  checkNumber = "",
  month = startOfMonth(date),
  week = startOfWeek(date),
  dateAdded = new Date(),
  categorizedDate,
}) => {
  const toRow = () => [
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
  ];

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
    toRow,
  };
};

/**
 *
 * @param {any[]} row
 */
export const createTransactionFromRow = ([
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
]) =>
  createTransaction({
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
  });

/**
 * @typedef {'Expense'|'Income'|'Transfer'|'Uncategorized'} CategoryType
 */

/**
 * @typedef {'Transactions'|'Categories'|'Direct Express'|'Daily'|'Weekly'|'Monthly'} SheetName
 */

/**
 * @typedef {'year'|'month'|'week'|'day'} TimeUnit
 */

/**
 * Represents an item from the Category table.
 *
 * @typedef {object} Category
 * @property {string} name
 * @property {CategoryType} type
 * @property {string} group
 * @property {boolean} hidden
 */

/**
 * Object to retrieve category information by category name.
 *
 * @typedef {Object.<string, Category>} CategoryLookup
 */

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
 * @property {Date} categorizedDate
 */

/**
 *
 *
 * @param {*} spec
 * @return {Transaction}
 */
const createTransaction = (spec) => {
  const {
    date,
    amount,
    category,
    account,
    institution,
    accountNumber,
    description,
    fullDescription,
    transactionId,
    accountId,
    checkNumber,
    month,
    week,
    dateAdded,
    categorizedDate,
  } = spec;
  /**
   *
   * @returns {TransactionRow}
   */
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

  return Object.freeze({ ...spec, toRow });
};

/**
 * Row from Tiller's Categories table
 *
 *  0	Category
 *  1	Group
 *  2	Type
 *  3	Hide From Reports
 *  4	Jan 2023
 *  5	Feb 2023
 *  6	Mar 2023
 *  7	Apr 2023
 *  8	May 2023
 *  9	Jun 2023
 * 10	Jul 2023
 * 11	Aug 2023
 * 12	Sep 2023
 * 13	Oct 2023
 * 14	Nov 2023
 * 15	Dec 2023
 *
 * @typedef {[string, string, CategoryType, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string]} CategoryRow
 */

/**
 *
 * Row from Tiller's transactions table
 *
 *  0
 *  1	Date
 *  2	Description
 *  3	Category
 *  4	Amount
 *  5	Account
 *  6	Account #
 *  7	Institution
 *  8	Month
 *  9	Week
 * 10	Transaction ID
 * 11	Account ID
 * 12	Check Number
 * 13	Full Description
 * 14	Date Added
 * 15	Categorized Date
 * @typedef {[undefined, Date, string, string, number, string, string, string, Date, Date, string, string, string, string, Date, Date]} TransactionRow
 */

export default {};

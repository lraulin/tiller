import { CategoryType } from "../categories/types.js";

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
 */

/**@type {Transaction} */
export let Transaction;

/**@typedef {""| "Date"| "Description"| "Category"| "Amount"| "Account"| "Account #"| "Institution"| "Month"| "Week"| "Transaction ID"| "Account ID"| "Check Number"| "Full Description"| "Date Added"| "Categorized Date"} TransactionColumnName */

/**@type {TransactionColumnName} */
export let TransactionColumnName;

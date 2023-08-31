import CategoryType from "../models/category-type-enum.js";

/**
 * This is super-unmaintainable, but it's a temporary solution to force type hinting to
 * play nice with stampit.
 */

/**
 * BaseSheetService is responsible for interacting with Google Sheets.
 * It provides methods for loading and saving data, and initializes with a sheet name and model.
 *
 * @typedef {Object} BaseSheetService
 *
 * @property {GoogleAppsScript.Spreadsheet.Sheet|null} sheet - The Google Spreadsheet sheet object.
 * @property {Function|null} model - The model function used for processing rows.
 * @property {any[]} data - The loaded data from the Google Sheet.
 * @property {string[]} headers - The column headers from the Google Sheet.
 * @property {Function} load - Loads the data from the Google Sheet into the `data` property.
 * @property {Function} save - Saves the `data` back into the Google Sheet.
 * @property {Function} sortSheet - Sorts the Google Sheet based on a given sort specification object.
 */

/**@type {BaseSheetService} */
export let BaseSheetService;

/**
 * @typedef {Object} Transaction
 *
 * @property {Date|null} date - The date of the transaction.
 * @property {string} description - The description of the transaction.
 * @property {string} category - The category of the transaction.
 * @property {boolean} hidden - Whether the transaction is hidden or not.
 * @property {number} amount - The amount of the transaction.
 * @property {string} account - The account related to the transaction.
 * @property {string} accountNumber - The account number related to the transaction.
 * @property {string} institution - The institution related to the transaction.
 * @property {string} transactionId - The ID of the transaction.
 * @property {string} accountId - The ID of the account related to the transaction.
 * @property {string} checkNumber - The check number related to the transaction.
 * @property {string} fullDescription - The full description of the transaction.
 * @property {Date} dateAdded - The date the transaction was added.
 * @property {Date|undefined} categorizedDate - The date the transaction was categorized.
 * @property {boolean} isExpense - Whether the transaction is an expense or not.
 * @property {boolean} isIncome - Whether the transaction is income or not.
 * @property {Date} week - The week of the transaction.
 * @property {Date} month - The month of the transaction.
 * @property {boolean} isFromDirectExpress - Whether the transaction is from Direct Express or not.
 * @property {boolean} isPending - Whether the transaction is pending or not.
 * @property {string} type - The type of the transaction.
 * @property {Function} init - The unit of the transaction.
 */

/**@type {Transaction} */
export let Transaction;

/**
 * BaseSheetService is responsible for interacting with Google Sheets.
 * It provides methods for loading and saving data, and initializes with a sheet name and model.
 *
 * @typedef {Object} TransactionService
 *
 * @property {GoogleAppsScript.Spreadsheet.Sheet|null} sheet - The Google Spreadsheet sheet object.
 * @property {Function|null} model - The model function used for processing rows.
 * @property {Transaction[]} data - The loaded data from the Google Sheet.
 * @property {string[]} headers - The column headers from the Google Sheet.
 * @property {Function} load - Loads the data from the Google Sheet into the `data` property.
 * @property {Function} save - Saves the `data` back into the Google Sheet.
 * @property {Function} sortSheet - Sorts the Google Sheet based on a given sort specification object.
 *
 * @property {Transaction[]} expenses - The transactions that are expenses.
 * @property {Transaction[]} income - The transactions that are income.
 * @property {Date} firstTransactionDate - The date of the first transaction.
 * @property {Date} lastTransactionDate - The date of the last transaction.
 * @property {Transaction} lastNonPendingFromDirectExpress - The last transaction that is not pending and is from Direct Express.
 * @property {Transaction[]} pendingTransactions - The transactions that are pending.
 * @property {Transaction[]} nonPendingTransactions - The transactions that are not pending.
 * @property {Function} sortByDateDescending - Sorts the transactions by date descending.
 * @property {Function} getTransactionInDateRange - Gets the transactions in a given date range.
 * @property {Function} generateAllReports - Generates all reports.
 * @property {Function} backup - Backs up the transactions.
 * @property {Function} restore - Restores the transactions.
 * @property {Function} clearAllBackups - Clears all backups.
 * @property {Function} updateFromDirectExpress - Updates the transactions from Direct Express.
 * @property {Function} updateFromTransactions - Updates the transactions from the Transactions sheet.
 * @property {Function} getTransactionByTimeUnit - Gets the transactions by time unit.
 * @property {Function} getSpendingReportData - Gets the spending report data.
 * @property {Function} getById - Gets a transaction by ID.
 * @property {function({ unit: string; string: string; }): void} generateSpendingReport - Generates the spending report.
 */

/**@type {TransactionService} */
export let TransactionService;

/**
 * @typedef {Object} Category
 *
 * @property {string} name - The name of the category.
 * @property {typeof CategoryType} type - The type of the category.
 * @property {string} group - The group of the category.
 * @property {boolean} isHidden - Whether the category is hidden or not.
 * @property {Object} budget - The budget for the category.
 */

/**
 * CategoryService is responsible for interacting with the 'Categories' sheet.
 * It extends the BaseSheetService to handle category-specific functionality.
 *
 * @typedef {Object} CategoryService
 *
 * FROM BASE
 * @property {GoogleAppsScript.Spreadsheet.Sheet|null} sheet - The Google Spreadsheet sheet object.
 * @property {Function|null} model - The model function used for processing rows.
 * @property {any[]} data - The loaded data from the Google Sheet.
 * @property {string[]} headers - The column headers from the Google Sheet.
 * @property {Function} load - Loads the data from the Google Sheet into the `data` property.
 * @property {Function} save - Saves the `data` back into the Google Sheet.
 * @property {Function} sortSheet - Sorts the Google Sheet based on a given sort specification object.
 *
 * OWN
 * @property {Object} lookup - A lookup table for quick category retrieval.
 * @property {Category[]} data - The loaded category data from the Google Sheet.
 * @property {function(string): Category} getCategoryData - Retrieves the data for a specified category.
 *
 */

/** @type {CategoryService} */
export let CategoryService;

/**
 * @typedef DirectExpressTransaction
 *
 * @property {Date?} date
 * @property {number} transactionId
 * @property {string} description
 * @property {number} amount
 * @property {string} transactionType
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {boolean} isPending
 * @property {Function} init
 * @property {Function} fromRow
 * @property {Function} toArray
 * @property {Function} fromDirectExpress
 */

/** @type {DirectExpressTransaction} */
export let DirectExpressTransaction;

/**
 * @typedef DirectExpressService
 *
 * FROM BASE
 * @property {GoogleAppsScript.Spreadsheet.Sheet|null} sheet - The Google Spreadsheet sheet object.
 * @property {Function|null} model - The model function used for processing rows.
 * @property {DirectExpressTransaction[]} data - The loaded data from the Google Sheet.
 * @property {string[]} headers - The column headers from the Google Sheet.
 * @property {Function} load - Loads the data from the Google Sheet into the `data` property.
 * @property {Function} save - Saves the `data` back into the Google Sheet.
 * @property {Function} sortSheet - Sorts the Google Sheet based on a given sort specification object.
 *
 * OWN
 * @property {Function} getNewTransactions
 * @property {Function} dedupe
 *
 */

/** @type {DirectExpressService} */
export let DirectExpressService;

/**
 * @typedef MasterService
 *
 * @property {DirectExpressService?} directExpressService
 * @property {TransactionService?} transactionService
 * @property {() => void} importDirectExpressToTransactions
 * @property {() => void} generateReports
 * @property {() => void} sortTransactions
 * @property {() => void} cleanUpDirectExpress
 * @property {() => void} backupTransactions
 * @property {() => void} restoreTransactions
 * @property {() => void} clearAllBackups
 */
/** @type {MasterService} */
export let MasterService;

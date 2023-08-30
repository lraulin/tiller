import { startOfMonth, startOfWeek } from "../utils.js";

import { DirectExpressTransaction } from "../direct-express/types.js";
import { PENDING_PREFIX } from "../direct-express/main.js";
import categories from "../categories/index.js";

const DATE_INDEX = 1;
const DESCRIPTION_INDEX = 2;
const CATEGORY_INDEX = 3;
const AMOUNT_INDEX = 4;
const ACCOUNT_INDEX = 5;
const ACCOUNT_NUMBER_INDEX = 6;
const INSTITUTION_INDEX = 7;
const MONTH_INDEX = 8;
const WEEK_INDEX = 9;
const TRANSACTION_ID_INDEX = 10;
const ACCOUNT_ID_INDEX = 11;
const CHECK_NUMBER_INDEX = 12;
const FULL_DESCRIPTION_INDEX = 13;
const DATE_ADDED_INDEX = 14;
const CATEGORIZED_DATE_INDEX = 15;

export default class Transaction {
  /**@type {Date} */
  #date;

  /**@type {string} */
  description = "";
  /**@type {string} */
  category = "";
  /**@type {string} */
  type = "";
  /**@type {boolean} */
  hidden = false;
  /**@type {number} */
  amount = 0;
  /**@type {string} */
  account = "";
  /**@type {string} */
  accountNumber = "";
  /**@type {string} */
  institution = "";
  /**@type {string} */
  transactionId = "";
  /**@type {string} */
  accountId = "";
  /**@type {string} */
  checkNumber = "";
  /**@type {string} */
  fullDescription = "";
  /**@type {Date} */
  dateAdded = new Date();
  /**@type {Date|undefined} */
  categorizedDate;

  constructor(data) {
    if (Array.isArray(data)) {
      this.#initFromRow(data);
    } else if (typeof data === "object") {
      this.#initFromDirectExpress(data);
    }
  }

  #initFromRow(row) {
    if (row.length < 16) throw new Error("Invalid transaction row");

    this.date = row[DATE_INDEX];
    this.description = row[DESCRIPTION_INDEX];
    this.category = row[CATEGORY_INDEX];
    this.amount = row[AMOUNT_INDEX];
    this.account = row[ACCOUNT_INDEX];
    this.accountNumber = row[ACCOUNT_NUMBER_INDEX];
    this.institution = row[INSTITUTION_INDEX];
    this.transactionId = row[TRANSACTION_ID_INDEX];
    this.accountId = row[ACCOUNT_ID_INDEX];
    this.checkNumber = row[CHECK_NUMBER_INDEX];
    this.fullDescription = row[FULL_DESCRIPTION_INDEX];
    this.dateAdded = row[DATE_ADDED_INDEX];
    this.categorizedDate = row[CATEGORIZED_DATE_INDEX];

    const categoryData = categories.getCategoryLookup()?.[this.category];
    this.type = categoryData?.type ?? "Uncategorized";
    this.hidden = categoryData?.hidden ?? false;
  }
  //TODO: this will assume it's a direct express object for now;
  // ideally have one for Direct Express and another for creating a new one from scratch with data supplied by the caller
  /**
   *
   * @param {DirectExpressTransaction} obj
   */
  #initFromDirectExpress(obj) {
    this.date = obj.date ?? new Date();
    this.description = obj.description;
    this.amount = obj.amount;
    this.account = "Direct Express";
    this.institution = "Comerica";
    this.transactionId = String(obj.transactionId);
    this.fullDescription = [obj.city, obj.state, obj.country].join(", ");

    const categoryData = categories.getCategoryLookup()?.[this.category];
    this.type = categoryData?.type ?? "Uncategorized";
    this.hidden = categoryData?.hidden ?? false;
  }

  /** @param {Date} date */
  set date(date) {
    this.#date = date;
    this.week = startOfWeek(date);
    this.month = startOfMonth(date);
  }

  /** @returns {Date} */
  get date() {
    return this.#date;
  }

  get isExpense() {
    return this.type === "Expense";
  }

  get isIncome() {
    return this.type === "Income";
  }

  get isPending() {
    return this.description.includes(PENDING_PREFIX);
  }

  get isFromDirectExpress() {
    return this.institution === "Comerica";
  }

  /** @returns {any[]} */
  toArray() {
    const row = Array(16).fill(undefined);
    row[DATE_INDEX] = this.date;
    row[DESCRIPTION_INDEX] = this.description;
    row[CATEGORY_INDEX] = this.category;
    row[AMOUNT_INDEX] = this.amount;
    row[ACCOUNT_INDEX] = this.account;
    row[ACCOUNT_NUMBER_INDEX] = this.accountNumber;
    row[INSTITUTION_INDEX] = this.institution;
    row[MONTH_INDEX] = this.month;
    row[WEEK_INDEX] = this.week;
    row[TRANSACTION_ID_INDEX] = this.transactionId;
    row[ACCOUNT_ID_INDEX] = this.accountId;
    row[CHECK_NUMBER_INDEX] = this.checkNumber;
    row[FULL_DESCRIPTION_INDEX] = this.fullDescription;
    row[DATE_ADDED_INDEX] = this.dateAdded;
    row[CATEGORIZED_DATE_INDEX] = this.categorizedDate;
    return row;
  }
}

import { startOfMonth, startOfWeek } from "../shared/dates.js";

import { DIRECT_EXPRESS } from "../shared/consts.js";
import { PENDING_DESCRIPTION_PREFIX } from "../shared/consts.js";
import { Transaction } from "../shared/types.js";
import categoryService from "../services/category-service.js";
import stampit from "stampit";

const columns = Object.freeze({
  "(Tiller Image)": 0,
  date: 1,
  description: 2,
  category: 3,
  amount: 4,
  account: 5,
  accountNumber: 6,
  institution: 7,
  month: 8,
  week: 9,
  transactionId: 10,
  accountId: 11,
  checkNumber: 12,
  fullDescription: 13,
  dateAdded: 14,
  categorizedDate: 15,
});

const TransactionFactory = stampit({
  // #region PROPERTIES
  props: {
    date: null,
    description: "",
    category: "",
    hidden: false,
    amount: 0,
    account: "",
    accountNumber: "",
    institution: "",
    transactionId: "",
    accountId: "",
    checkNumber: "",
    fullDescription: "",
    dateAdded: new Date(),
    categorizedDate: undefined,
  },
  // #endregion PROPERTIES
  // #region INIT
  init({
    date,
    description,
    category,
    amount,
    account,
    accountNumber,
    institution,
    transactionId,
    accountId,
    checkNumber,
    fullDescription,
    dateAdded,
    categorizedDate,
  }) {
    this.date = date;
    this.description = description;
    this.category = category;
    this.amount = amount;
    this.account = account;
    this.accountNumber = accountNumber;
    this.institution = institution;
    this.transactionId = transactionId;
    this.accountId = accountId;
    this.checkNumber = checkNumber;
    this.fullDescription = fullDescription;
    this.dateAdded = dateAdded;
    this.categorizedDate = categorizedDate;
  },
  // #endregion INIT
  // #region METHODS
  methods: {
    // #region GETTERS
    /** @this {Transaction} */
    get week() {
      return startOfWeek(this.date);
    },
    /** @this {Transaction} */
    get month() {
      return startOfMonth(this.date);
    },
    /** @this {Transaction} */
    get isExpense() {
      return this.type === "Expense";
    },
    /** @this {Transaction} */
    get isIncome() {
      return this.type === "Income";
    },
    /** @this {Transaction} */
    get isPending() {
      return this.description.includes(PENDING_DESCRIPTION_PREFIX);
    },
    /** @this {Transaction} */
    get isFromDirectExpress() {
      return this.institution === "Comerica";
    },
    /** @this {Transaction} */
    get type() {
      return categoryService.getCategoryData(this.category)?.type;
    },
    /** @this {Transaction} */
    get group() {
      return categoryService.getCategoryData(this.category)?.group;
    },
    // #endregion GETTERS
    // #region INIT HELPERS
    fromRow(row) {
      this.init({
        date: row[columns.date],
        description: row[columns.description],
        category: row[columns.category],
        amount: row[columns.amount],
        account: row[columns.account],
        accountNumber: row[columns.accountNumber],
        institution: row[columns.institution],
        transactionId: row[columns.transactionId],
        accountId: row[columns.accountId],
        checkNumber: row[columns.checkNumber],
        fullDescription: row[columns.fullDescription],
        dateAdded: row[columns.dateAdded],
        categorizedDate: row[columns.categorizedDate],
      });
    },

    /** @this {Transaction} */
    fromDirectExpress(det) {
      this.init({
        date: det.date ?? new Date(),
        description: det.description,
        amount: det.amount,
        account: DIRECT_EXPRESS.ACCOUNT_NAME,
        institution: DIRECT_EXPRESS.INSTITUTION,
        accountNumber: DIRECT_EXPRESS.ACCOUNT_NUMBER,
        transactionId: String(det.transactionId),
        fullDescription: [det.city, det.state, det.country].join(", "),
      });
    },
    // #endregion INIT HELPERS
    // #region ARRAY HELPERS
    /** @this {Transaction} */
    toArray() {
      const row = Array(16).fill("");
      row[columns.date] = this.date;
      row[columns.description] = this.description;
      row[columns.category] = this.category;
      row[columns.amount] = this.amount;
      row[columns.account] = this.account;
      row[columns.accountNumber] = this.accountNumber;
      row[columns.institution] = this.institution;
      row[columns.week] = this.week;
      row[columns.month] = this.month;
      row[columns.transactionId] = this.transactionId;
      row[columns.accountId] = this.accountId;
      row[columns.checkNumber] = this.checkNumber;
      row[columns.fullDescription] = this.fullDescription;
      row[columns.dateAdded] = this.dateAdded;
      row[columns.categorizedDate] = this.categorizedDate;
      return row;
    },
    // #endregion ARRAY HELPERS
    // #endregion METHODS
  },
});

export default TransactionFactory;

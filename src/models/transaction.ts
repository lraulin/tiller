import { DIRECT_EXPRESS, Institution } from "../shared/constants";
import { startOfMonth, startOfWeek } from "../shared/dates";

import DirectExpressTransaction from "./direct-express-transaction";
import Model from "./model";
import { PENDING_DESCRIPTION_PREFIX } from "../shared/constants";
import categoryService from "../services/category-service";

type TransactionRow = [
  Date, // date
  string, // description
  string, // category
  number, // amount
  string, // account
  string, // accountNumber
  string, // institution
  Date, // month
  Date, // week
  number | string, // transactionId
  string, // accountId
  string, // checkNumber
  string, // fullDescription
  Date, // dateAdded
  Date | string // categorizedDate
];

enum Column {
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
}

const getInstitution = (institution: string): Institution => {
  switch (institution) {
    case "PenFed":
      return "PenFed";
    case "Comerica":
      return "Comerica";
    case "Capital One":
      return "Capital One";
    default:
      return "Unknown";
  }
};

interface TransactionData {
  date: Date | null;
  description: string;
  category: string;
  amount: number;
  account: string;
  accountNumber: string;
  institution: Institution;
  transactionId: string;
  accountId: string;
  checkNumber: string;
  fullDescription: string;
  dateAdded: Date;
  categorizedDate?: Date;
}

export default class Transaction extends Model implements TransactionData {
  date: Date | null = null;
  description = "";
  category = "";
  amount = 0;
  account = "";
  accountNumber = "";
  institution: Institution = "Unknown";
  transactionId = "";
  accountId = "";
  checkNumber = "";
  fullDescription = "";
  dateAdded = new Date();
  categorizedDate?: Date;

  constructor(data: TransactionData);
  constructor(data: TransactionRow);
  constructor(data: TransactionData | TransactionRow) {
    super(data);
    if (Array.isArray(data)) {
      this.initFromRow(data);
    } else {
      this.initFromObject(data);
    }
  }

  // Getters
  get week() {
    return startOfWeek(this.date);
  }

  get month() {
    return startOfMonth(this.date);
  }

  get isExpense() {
    return this.type === "Expense";
  }

  get isIncome() {
    return this.type === "Income";
  }

  get isPending() {
    return this.description.includes(PENDING_DESCRIPTION_PREFIX);
  }

  get isFromDirectExpress() {
    return this.institution === "Comerica";
  }

  get type() {
    return categoryService.getCategoryData(this.category)?.type;
  }

  get group() {
    return categoryService.getCategoryData(this.category)?.group;
  }

  get isPenFed() {
    return this.institution === "PenFed";
  }

  private initFromRow(row: any[]) {
    this.date = row[Column.date];
    this.description = row[Column.description];
    this.category = row[Column.category];
    this.amount = row[Column.amount];
    this.account = row[Column.account];
    this.accountNumber = row[Column.accountNumber];
    this.institution = getInstitution(row[Column.institution]);
    this.transactionId = row[Column.transactionId];
    this.accountId = row[Column.accountId];
    this.checkNumber = row[Column.checkNumber];
    this.fullDescription = row[Column.fullDescription];
    this.dateAdded = row[Column.dateAdded];
    this.categorizedDate = row[Column.categorizedDate];
  }

  private initFromObject(data: TransactionData) {
    this.date = data.date;
    this.description = data.description;
    this.category = data.category;
    this.amount = data.amount;
    this.account = data.account;
    this.accountNumber = data.accountNumber;
    this.institution = data.institution;
    this.transactionId = data.transactionId;
    this.accountId = data.accountId;
    this.checkNumber = data.checkNumber;
    this.fullDescription = data.fullDescription;
    this.dateAdded = data.dateAdded;
    this.categorizedDate = data.categorizedDate;
  }

  fromDirectExpress(det: DirectExpressTransaction) {
    this.date = det.date ?? new Date();
    this.description = det.description;
    this.amount = det.amount;
    this.account = DIRECT_EXPRESS.ACCOUNT_NAME;
    this.institution = DIRECT_EXPRESS.INSTITUTION;
    this.accountNumber = DIRECT_EXPRESS.ACCOUNT_NUMBER;
    this.transactionId = String(det.transactionId);
    this.fullDescription = [det.city, det.state, det.country].join(", ");
    this.dateAdded = new Date();
    this.categorizedDate = undefined;
  }

  toArray() {
    const row = Array(16).fill("");
    row[Column.date] = this.date;
    row[Column.description] = this.description;
    row[Column.category] = this.category;
    row[Column.amount] = this.amount;
    row[Column.account] = this.account;
    row[Column.accountNumber] = this.accountNumber;
    row[Column.institution] = this.institution;
    row[Column.week] = this.week;
    row[Column.month] = this.month;
    row[Column.transactionId] = this.transactionId;
    row[Column.accountId] = this.accountId;
    row[Column.checkNumber] = this.checkNumber;
    row[Column.fullDescription] = this.fullDescription;
    row[Column.dateAdded] = this.dateAdded;
    row[Column.categorizedDate] = this.categorizedDate;
    return row;
  }
}

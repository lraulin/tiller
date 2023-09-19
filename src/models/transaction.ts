import { DIRECT_EXPRESS, Institution } from "../shared/constants";
import { startOfMonth, startOfWeek } from "../shared/dates";

import DirectExpressTransaction from "./direct-express-transaction";
import Model from "./model";
import { PENDING_DESCRIPTION_PREFIX } from "../shared/constants";
import categoryService from "../services/category-service";

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
  constructor(data: any[]);
  constructor(data: TransactionData | any[]) {
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
    this.date = row[columns.date];
    this.description = row[columns.description];
    this.category = row[columns.category];
    this.amount = row[columns.amount];
    this.account = row[columns.account];
    this.accountNumber = row[columns.accountNumber];
    this.institution = getInstitution(row[columns.institution]);
    this.transactionId = row[columns.transactionId];
    this.accountId = row[columns.accountId];
    this.checkNumber = row[columns.checkNumber];
    this.fullDescription = row[columns.fullDescription];
    this.dateAdded = row[columns.dateAdded];
    this.categorizedDate = row[columns.categorizedDate];
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
  }
}

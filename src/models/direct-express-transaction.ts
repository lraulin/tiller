import Model from "./model";

type DirectExpressRow = [
  "Pending" | Date, // Date
  number, // Transaction ID
  string, // Description
  number, // Amount
  string, // Transaction Type
  string, // City
  string, // State
  string // Country
];

interface TransactionData {
  date: Date | null;
  transactionId: number;
  description: string;
  amount: number;
  transactionType: string;
  city: string;
  state: string;
  country: string;
  isPending: boolean;
}

export default class DirectExpressTransaction
  extends Model
  implements TransactionData
{
  date: Date | null = null;
  transactionId: number = 0;
  description: string = "";
  amount: number = 0;
  transactionType: string = "";
  city: string = "";
  state: string = "";
  country: string = "";
  isPending: boolean = false;

  constructor(data: TransactionData);
  constructor(data: DirectExpressRow);
  constructor(data: TransactionData | DirectExpressRow) {
    super(data);
    if (Array.isArray(data)) {
      this.fromRow(data);
      return;
    }
    this.initFromObject(data);
  }

  private initFromObject({
    date,
    transactionId,
    description,
    amount,
    transactionType,
    city,
    state,
    country,
    isPending,
  }: TransactionData) {
    this.date = date;
    this.transactionId = transactionId;
    this.description = description;
    this.amount = amount;
    this.transactionType = transactionType;
    this.city = city;
    this.state = state;
    this.country = country;
    this.isPending = isPending;
  }

  private fromRow(row: DirectExpressRow) {
    this.date = row[0] === "Pending" ? null : row[0];
    this.transactionId = Number(row[1]);
    this.description = row[2];
    this.amount = row[3];
    this.transactionType = row[4];
    this.city = row[5];
    this.state = row[6];
    this.country = row[7];
    this.isPending = row[0] === "Pending";
  }

  toArray(): DirectExpressRow {
    return [
      this.date ?? "Pending",
      this.transactionId,
      this.description,
      this.amount,
      this.transactionType,
      this.city,
      this.state,
      this.country,
    ];
  }
}

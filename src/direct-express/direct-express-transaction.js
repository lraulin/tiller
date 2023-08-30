// const headers = [
//   "DATE",
//   "TRANSACTION ID",
//   "DESCRIPTION",
//   "AMOUNT",
//   "TRANSACTION TYPE",
//   "CITY",
//   "STATE",
//   "COUNTRY",
// ];

export default class DirectExpressTransaction {
  /** @type {Date?} */
  date;
  /** @type {number} */
  transactionId;
  /** @type {string} */
  description;
  /** @type {number} */
  amount;
  /** @type {string} */
  transactionType;
  /** @type {string} */
  city;
  /** @type {string} */
  state;
  /** @type {string} */
  country;
  /** @type {boolean} */
  isPending;

  constructor([
    date,
    transactionId,
    description,
    amount,
    transactionType,
    city,
    state,
    country,
  ]) {
    this.date = date === "Pending" ? null : date;
    this.transactionId = transactionId;
    this.description = description;
    this.amount = amount;
    this.transactionType = transactionType;
    this.city = city;
    this.state = state;
    this.country = country;
    this.isPending = date === "Pending";
  }

  toArray() {
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

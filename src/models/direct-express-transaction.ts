import { DirectExpressTransaction } from "../shared/types";
import stampit from "stampit";

const DirectExpressTransactionFactory = stampit({
  props: {
    date: null,
    transactionId: 0,
    description: "",
    amount: 0,
    transactionType: "",
    city: "",
    state: "",
    country: "",
    isPending: false,
  },
  init(data) {
    if (Array.isArray(data)) {
      this.fromRow(data);
      return;
    }
    this.initFromObject(data);
  },
  methods: {
    /** @this {DirectExpressTransaction} */
    initFromObject({
      date,
      transactionId,
      description,
      amount,
      transactionType,
      city,
      state,
      country,
      isPending,
    }) {
      this.date = date;
      this.transactionId = transactionId;
      this.description = description;
      this.amount = amount;
      this.transactionType = transactionType;
      this.city = city;
      this.state = state;
      this.country = country;
      this.isPending = isPending;
    },
    /** @this {DirectExpressTransaction} */
    fromRow(row) {
      this.date = row[0] === "Pending" ? null : row[0];
      this.transactionId = row[1];
      this.description = row[2];
      this.amount = row[3];
      this.transactionType = row[4];
      this.city = row[5];
      this.state = row[6];
      this.country = row[7];
      this.isPending = row[0] === "Pending";
    },
    /** @this {DirectExpressTransaction} */
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
    },
  },
});

export default DirectExpressTransactionFactory;

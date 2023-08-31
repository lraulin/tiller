import stampit from "stampit";

const DirectExpressTransaction = stampit({
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
  init({
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
  methods: {
    fromRow(row) {
      this.init({
        date: row[0] === "Pending" ? null : row[0],
        transactionId: row[1],
        description: row[2],
        amount: row[3],
        transactionType: row[4],
        city: row[5],
        state: row[6],
        country: row[7],
        isPending: row[0] === "Pending",
      });
    },
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

export default DirectExpressTransaction;

import BaseSheetService from "./base-sheet-service.js";
import DirectExpressTransaction from "../models/direct-express-transaction.js";

const DirectExpressService = BaseSheetService({
  sheetName: "DirectExpress",
  model: DirectExpressTransaction,
}).compose({
  // #region METHODS
  methods: {
    getNewTransactions(lastId) {
      if (lastId === undefined) return [...this.data];
      return this.data.filter((t) => t.transactionId > lastId);
    },
    dedupe() {
      const lookup = this.#transactions.reduce((acc, c) => {
        acc[c.transactionId] = c;
        return acc;
      }, {});
      this.#transactions = Object.values(lookup);
      this.sortByDateDescending();
    },
  }, // #endregion METHODS
});

export default DirectExpressService;

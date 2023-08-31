import BaseSheetServiceFactory from "./base-sheet-service.js";
import { DirectExpressService } from "../shared/types.js";
import DirectExpressTransactionFactory from "../models/direct-express-transaction.js";
import stampit from "stampit";

const DirectExpressServiceFactory = stampit(BaseSheetServiceFactory, {
  // #region METHODS
  methods: {
    getNewTransactions(lastId) {
      if (lastId === undefined) return [...this.data];
      return this.data.filter((t) => t.transactionId > lastId);
    },

    /** @this {DirectExpressService} */
    dedupe() {
      const lookup = this.data.reduce((acc, c) => {
        acc[c.transactionId] = c;
        return acc;
      }, {});
      this.data = Object.values(lookup);
      this.data.sort(
        (a, b) =>
          (b.date?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (a.date?.getTime() || Number.MAX_SAFE_INTEGER)
      );
    },
  }, // #endregion METHODS
});

/** @type {DirectExpressService} */
const service = DirectExpressServiceFactory({
  sheetName: "DirectExpress",
  model: DirectExpressTransactionFactory,
});
const getDirectExpressService = () => service;
export default getDirectExpressService;

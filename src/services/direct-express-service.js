import BaseSheetService from "./base-sheet-service.js";
import { DirectExpressService } from "../shared/types.js";
import DirectExpressTransactionFactory from "../models/direct-express-transaction.js";
import stampit from "stampit";

const DirectExpressServiceFactory = stampit(
  BaseSheetService({
    sheetName: "DirectExpress",
    model: DirectExpressTransactionFactory,
  }),
  {
    // #region METHODS
    methods: {
      getNewTransactions(lastId) {
        if (lastId === undefined) return [...this.data];
        return this.data.filter((t) => t.transactionId > lastId);
      },

      dedupe() {
        const lookup = this.data.reduce((acc, c) => {
          acc[c.transactionId] = c;
          return acc;
        }, {});
        this.data = Object.values(lookup);
        this.sortByDateDescending();
      },
    }, // #endregion METHODS
  }
);

/** @type {DirectExpressService} */
const service = DirectExpressServiceFactory();
export default service;

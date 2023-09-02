import BaseSheetServiceFactory from "./base-sheet-service.js";
import { DirectExpressService } from "../shared/types.js";
import DirectExpressTransactionFactory from "../models/direct-express-transaction.js";

const DirectExpressServiceFactory = () => {
  const base = BaseSheetServiceFactory({ sheetName: "DirectExpress" });
  base.data = base.data.map((row) => DirectExpressTransactionFactory(row));
  Logger.log("Wrapping transactions");
  Logger.log(base.data);

  const methods = {
    getNewTransactions(lastId) {
      if (lastId === undefined) return [...data];
      return data.filter((t) => t.transactionId > lastId);
    },

    /** @this {DirectExpressService} */
    dedupe() {
      const startedWith = data.length;
      Logger.log("Cleaning up " + startedWith + " transactions");
      const lookup = base.data.reduce((acc, c) => {
        acc[c.transactionId] = c;
        return acc;
      }, {});
      base.data = Object.values(lookup);
      base.data.sort(
        (a, b) =>
          (b.date?.getTime?.() || Number.MAX_SAFE_INTEGER) -
          (a.date?.getTime?.() || Number.MAX_SAFE_INTEGER)
      );
      const dupsRemoved = startedWith - data.length;
      Logger.log("Removed " + dupsRemoved + " duplicate transactions");
      base.save();
      // sortByDate();
      base.load();
    },
    sortByDate() {
      base.sortByColumn({ column: "date", ascending: false });
    },
  };

  return { ...base, ...methods };
};

export default DirectExpressServiceFactory();

import BaseSheetService from "./base-sheet-service";
import DirectExpressTransaction from "../models/direct-express-transaction";

class DirectExpressService extends BaseSheetService<DirectExpressTransaction> {
  constructor() {
    super("DirectExpress", DirectExpressTransaction);
  }

  getNewTransactions(lastId) {
    if (lastId === undefined) return [...this.data];
    return this.data.filter((t) => t.transactionId > lastId);
  }

  dedupe() {
    const startedWith = this.data.length;
    Logger.log("Cleaning up " + startedWith + " transactions");
    const lookup = this.data.reduce((acc, c) => {
      acc[c.transactionId] = c;
      return acc;
    }, {});
    this.data = Object.values(lookup);
    this.data.sort(
      (a, b) =>
        (b.date?.getTime?.() || Number.MAX_SAFE_INTEGER) -
        (a.date?.getTime?.() || Number.MAX_SAFE_INTEGER)
    );
    const dupsRemoved = startedWith - this.data.length;
    Logger.log("Removed " + dupsRemoved + " duplicate transactions");
    this.save();
    // this.sortByDate();
    this.load();
  }

  sortByDate() {
    this.sortByColumn({ columnName: "date", ascending: false });
  }
}

export default new DirectExpressService();

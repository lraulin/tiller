import directExpressService from "./direct-express-service.js";
import sheets from "../shared/sheets.js";
import transactionService from "./transaction-service.js";

class MasterService {
  #directExpressService = directExpressService;
  #transactionService = transactionService;

  importDirectExpressToTransactions() {
    Logger.log("Importing from Direct Express to Transactions");

    transactionService.backup();

    const afterTransId =
      transactionService.lastNonPendingFromDirectExpress?.transactionId;
    Logger.log("afterTransId: " + afterTransId);

    const directExpressImports = directExpressService.getNewTransactions({
      afterTransId,
    });
    Logger.log(
      directExpressImports.length + " new transactions from Direct Express"
    );

    transactionService.updateFromDirectExpress(directExpressImports);
  }

  generateReports() {
    Logger.log("Generating reports");
    this.#transactionService.generateAllReports();
  }

  sortTransactions() {
    Logger.log("Sorting transactions");
    this.#transactionService.sortByDateDescending();
  }

  cleanUpDirectExpress() {
    Logger.log("Cleaning up Direct Express");
    this.#directExpressService.dedupe();
  }

  backupTransactions() {
    Logger.log("Backing up transactions");
    this.#transactionService.backup();
  }

  restoreTransactions() {
    Logger.log("Restoring transactions");
    this.#transactionService.restore();
  }

  clearAllBackups() {
    sheets.clearAllBackups();
  }
}

export default new MasterService();

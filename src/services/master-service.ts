import { BACKUP_POSTFIX } from "../shared/constants";
import { InitializationError } from "../shared/errors";
import directExpressService from "./direct-express-service";
import transactionService from "./transaction-service";

const ERR_MSG_TRANSACTION_SERVICE_NULL = "transactionService is null";
const ERR_MSG_DIRECT_EXPRESS_SERVICE_NULL = "directExpressService is null";

export default {
  importDirectExpressToTransactions() {
    Logger.log("Importing from Direct Express to Transactions");
    if (!transactionService)
      throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
    if (!directExpressService)
      throw new InitializationError(ERR_MSG_DIRECT_EXPRESS_SERVICE_NULL);

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
  },

  generateReports() {
    Logger.log("Generating reports");
    if (!transactionService)
      throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
    transactionService.generateAllReports();
  },

  sortTransactions() {
    Logger.log("Sorting transactions");
    if (!transactionService)
      throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
    transactionService.sortByDateDescending();
  },

  cleanUpDirectExpress() {
    Logger.log("Cleaning up Direct Express");
    Logger.log(this);
    Logger.log("^^^^^^^^");
    if (!directExpressService)
      throw new InitializationError(ERR_MSG_DIRECT_EXPRESS_SERVICE_NULL);
    directExpressService.dedupe();
  },

  backupTransactions() {
    Logger.log("Backing up transactions");
    if (!transactionService)
      throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
    transactionService.backup();
  },

  restoreTransactions() {
    Logger.log("Restoring transactions");
    if (!transactionService)
      throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
    transactionService.restore();
  },

  clearAllBackups() {
    const workBook = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = workBook.getSheets();
    const backups = sheets.filter(
      (s) =>
        s.getName().includes(BACKUP_POSTFIX) ||
        s.getName().includes("Copy") ||
        /Sheet\d+/.test(s.getName())
    );
    Logger.log("Deleting" + backups.length + " sheets");
    backups.forEach((b) => workBook.deleteSheet(b));
  },

  generatePenfedIds() {
    transactionService.generatePenFedIds();
  },
};

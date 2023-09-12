import { DirectExpressService, TransactionService } from "../shared/types.js";

import { BACKUP_POSTFIX } from "../shared/constants.js";
import { InitializationError } from "../shared/errors.js";
import { MasterService } from "../shared/types.js";
import getDirectExpressService from "./direct-express-service.js";
import getTransactionService from "./transaction-service.js";
import stampit from "stampit";

const ERR_MSG_TRANSACTION_SERVICE_NULL = "transactionService is null";
const ERR_MSG_DIRECT_EXPRESS_SERVICE_NULL = "directExpressService is null";

const MasterServiceFactory = stampit({
  // region PROPERTIES
  props: {
    /**@type {DirectExpressService?} */
    directExpressService: null,
    /**@type {TransactionService?} */
    transactionService: null,
  }, // endregion PROPERTIES

  // region INIT
  /**
   * @this {MasterService}
   * @param {Object} param0
   * @param {DirectExpressService} param0.directExpressService
   * @param {TransactionService} param0.transactionService
   */
  init({ directExpressService, transactionService }) {
    Logger.log("MasterServiceFactory.init");
    Logger.log(this);
    this.directExpressService = directExpressService;
    this.transactionService = transactionService;
    Logger.log("After init");
    Logger.log(this);
  }, // endregion INIT

  // region METHODS
  methods: {
    /** @this {MasterService} */
    importDirectExpressToTransactions() {
      Logger.log("Importing from Direct Express to Transactions");
      if (!this.transactionService)
        throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
      if (!this.directExpressService)
        throw new InitializationError(ERR_MSG_DIRECT_EXPRESS_SERVICE_NULL);

      this.transactionService.backup();

      const afterTransId =
        this.transactionService.lastNonPendingFromDirectExpress?.transactionId;
      Logger.log("afterTransId: " + afterTransId);

      const directExpressImports = this.directExpressService.getNewTransactions(
        {
          afterTransId,
        }
      );
      Logger.log(
        directExpressImports.length + " new transactions from Direct Express"
      );

      this.transactionService.updateFromDirectExpress(directExpressImports);
    },

    /** @this {MasterService} */
    generateReports() {
      Logger.log("Generating reports");
      if (!this.transactionService)
        throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
      this.transactionService.generateAllReports();
    },

    /** @this {MasterService} */
    sortTransactions() {
      Logger.log("Sorting transactions");
      if (!this.transactionService)
        throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
      this.transactionService.sortByDateDescending();
    },

    /** @this {MasterService} */
    cleanUpDirectExpress() {
      Logger.log("Cleaning up Direct Express");
      Logger.log(this);
      Logger.log("^^^^^^^^");
      if (!this.directExpressService)
        throw new InitializationError(ERR_MSG_DIRECT_EXPRESS_SERVICE_NULL);
      this.directExpressService.dedupe();
    },

    /** @this {MasterService} */
    backupTransactions() {
      Logger.log("Backing up transactions");
      if (!this.transactionService)
        throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
      this.transactionService.backup();
    },

    /** @this {MasterService} */
    restoreTransactions() {
      Logger.log("Restoring transactions");
      if (!this.transactionService)
        throw new InitializationError(ERR_MSG_TRANSACTION_SERVICE_NULL);
      this.transactionService.restore();
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
      this.transactionService.generatePenFedIds();
    },
  }, // endregion METHODS
});

/** @type {MasterService} */
const masterService = MasterServiceFactory({
  directExpressService: getDirectExpressService(),
  transactionService: getTransactionService(),
});
Logger.log(`src/services/master-service.js`);
Logger.log("masterService");
Logger.log(masterService);
Logger.log("masterService.directExpressService");
Logger.log(masterService.directExpressService);
export default masterService;

import { DirectExpressService, TransactionService } from "../shared/types.js";

import { InitializationError } from "../shared/errors.js";
import { MasterService } from "../shared/types.js";
import getDirectExpressService from "./direct-express-service.js";
import getTransactionService from "./transaction-service.js";
import sheets from "../shared/sheets.js";
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
    this.directExpressService = directExpressService;
    this.transactionService = transactionService;
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
      sheets.clearAllBackups();
    },
  }, // endregion METHODS
});

/** @type {MasterService} */
const masterService = MasterServiceFactory({
  directExpressService: getDirectExpressService(),
  transactionService: getTransactionService(),
});
export default masterService;

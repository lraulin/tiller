import masterService from "./services/master-service";

Logger.log(`src/app.js`);
Logger.log("masterService");
Logger.log(masterService);

const generateReports = "generateReports";
const importDirectExpress = "importDirectExpressToTransactions";
const sortTransactions = "sortTransactions";
const cleanUpDirectExpress = "cleanUpDirectExpress";
const backupTransactions = "backupTransactions";
const restoreTransactions = "restoreTransactions";
const clearAllBackups = "clearAllBackups";
const generatePenfedIds = "generatePenfedIds";

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Lee")
    .addItem("Import Direct Express", importDirectExpress)
    .addItem("Sort Transactions", sortTransactions)
    .addItem("Clean Up Direct Express", cleanUpDirectExpress)
    .addItem("Backup Transactions", backupTransactions)
    .addItem("Restore Transactions", restoreTransactions)
    .addItem("Clear All Backups", clearAllBackups)
    .addItem("Generate PenFed Ids", generatePenfedIds)
    .addToUi();
}

// Gas plugin needs assignments to "global" to create top-level functions...

const masterServiceBound = (methodName) =>
  masterService[methodName].bind(masterService);

const global = {
  onOpen,
  [generateReports]: masterServiceBound(generateReports),
  [importDirectExpress]: masterServiceBound(importDirectExpress),
  [sortTransactions]: masterServiceBound(sortTransactions),
  [cleanUpDirectExpress]: masterServiceBound(cleanUpDirectExpress),
  [backupTransactions]: masterServiceBound(backupTransactions),
  [restoreTransactions]: masterServiceBound(restoreTransactions),
  [clearAllBackups]: masterServiceBound(clearAllBackups),
  [generatePenfedIds]: masterServiceBound(generatePenfedIds),
};

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

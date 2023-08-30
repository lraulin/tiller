import masterService from "./services/master-service.js";

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Lee")
    .addItem("Import Direct Express", "importDirectExpress")
    .addItem("Fill My Sheets", "fillCustomSheets")
    .addItem("Sort Transactions", "sortTransactions")
    .addItem("Clean Up Direct Express", "cleanUpDirectExpress")
    .addItem("Backup Transactions", "backupTransactions")
    .addItem("Restore Transactions", "restoreTransactions")
    .addItem("Clear All Backups", "clearAllBackups")
    .addToUi();
}

// Gas plugin needs assignments to "global" to create top-level functions...
const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = masterService.generateReports;
global.importDirectExpress = masterService.importDirectExpressToTransactions;
global.sortTransactions = masterService.sortTransactions;
global.cleanUpDirectExpress = masterService.cleanUpDirectExpress;
global.backupTransactions = masterService.backupTransactions;
global.restoreTransactions = masterService.restoreTransactions;
global.clearAllBackups = masterService.clearAllBackups;

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

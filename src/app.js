import {
  backupTransactions,
  cleanUpDirectExpress,
  generateReports,
  importDirectExpressToTransactions,
  restoreTransactions,
  sortTransactions,
} from "./services/master-service.js";

Logger.log(`src/app.js`);

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
global.fillCustomSheets = generateReports();
global.importDirectExpress = importDirectExpressToTransactions();
global.sortTransactions = sortTransactions();
global.cleanUpDirectExpress = cleanUpDirectExpress();
global.backupTransactions = backupTransactions();
global.restoreTransactions = restoreTransactions();
global.clearAllBackups = clearAllBackups();

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

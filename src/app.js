import masterService from "./services/master-service.js";

Logger.log(`src/app.js`);
Logger.log("masterService");
Logger.log(masterService);

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
    .addItem("Generate PenFed Ids", "generatePenfedIds")
    .addToUi();
}

// Gas plugin needs assignments to "global" to create top-level functions...
const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = masterService.generateReports.bind(masterService);
global.importDirectExpress =
  masterService.importDirectExpressToTransactions.bind(masterService);
global.sortTransactions = masterService.sortTransactions.bind(masterService);
global.cleanUpDirectExpress =
  masterService.cleanUpDirectExpress.bind(masterService);
global.backupTransactions =
  masterService.backupTransactions.bind(masterService);
global.restoreTransactions =
  masterService.restoreTransactions.bind(masterService);
global.clearAllBackups = masterService.clearAllBackups.bind(masterService);
global.generatePenfedIds = masterService.generatePenfedIds.bind(masterService);

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

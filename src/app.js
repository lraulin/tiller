import { TimeUnit } from "./categories/types.js";
import directExpress from "./direct-express/index.js";
import { getSpendingData } from "./core.js";
import sheets from "./sheets/index.js";
import transactions from "./transactions/index.js";

/**
 * @typedef {object} SpendingTableParams
 * @property {TimeUnit} unit
 * @property {string} string
 */

/**
 * @param {SpendingTableParams} param0
 */
function fillSpendingTable({ unit, string }) {
  const data = getSpendingData({
    transactions: transactions.getExpenses(),
    lastDate: new Date(),
    unit,
  });
  const sheet = sheets.get(string);
  sheet.clearContents();
  sheets.append(sheet, data);
}

function fillSpendingTables() {
  /**@type {SpendingTableParams[]} */
  const params = [
    { unit: "day", string: "Daily" },
    { unit: "week", string: "Weekly" },
    { unit: "month", string: "Monthly" },
  ];
  params.forEach(fillSpendingTable);
}

export function fillCustomSheets() {
  fillSpendingTables();
  transactions.importDirectExpress();
}

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Lee")
    .addItem("Import Direct Express", "importDirectExpress")
    .addItem("Fill My Sheets", "fillCustomSheets")
    .addItem("Sort Transactions", "sortTransactions")
    .addItem("Clean Up Direct Express", "cleanUpDirectExpress")
    .addItem("Backup Transactions", "backupTransactionsSheet")
    .addItem("Restore Transactions", "restoreTransactionsSheet")
    .addItem("Clear All Backups", "clearAllBackups")
    .addToUi();
}

// Gas plugin needs assignments to "global" to create top-level functions...
const global = {};
global.onOpen = onOpen;
global.fillCustomSheets = fillCustomSheets;
global.importDirectExpress = transactions.importDirectExpress;
global.sortTransactions = transactions.sortTransactionsSheet;
global.cleanUpDirectExpress = directExpress.cleanUp;
global.backupTransactionsSheet = transactions.backupTransactionsSheet;
global.restoreTransactionsSheet = transactions.restoreTransactionsSheet;
global.clearAllBackups = sheets.clearAllBackups;

// But "global" is no longer available in GAS; globalThis works instead
// https://developers.google.com/apps-script/guides/v8-runtime/migration#global
for (const [k, v] of Object.entries(global)) {
  globalThis[k] = v;
}

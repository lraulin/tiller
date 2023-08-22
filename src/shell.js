import { sheetNames } from "./consts";

import { filterToExpenses, getSpendingData, rowsToTransactions } from "./core";

let allTransactions /**@type {Transaction[]} */ = [];
let expenses /**@type {Transaction[]} */ = [];

/**
 * Gets Google Sheet by name.
 *
 * @param {string} name
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
   if (!sheet) throw new Error(`Unable to retrieve '${name}' sheet`);
   return sheet
}

/**
 * Loads data from spreadsheets.
 *
 */
function init() {
  const categoryRows /**@type {CategoryRow[]} */ = getRowsFromSheet(sheetNames.CATEGORIES)
  const transactionRows /**@type {TransactionRow[]} */ = getRowsFromSheet(sheetNames.TRANSACTIONS)
  allTransactions = rowsToTransactions(categoryRows, transactionRows)
  expenses = filterToExpenses(allTransactions)
}

/**
 * Get values from Google Sheet of specified name.
 *
 * @param {string} sheetName
 * @returns {any[]}
 */
function getRowsFromSheet(sheetName) {
   const sheet = getSheet(sheetName)
     const [, rows] = sheet.getDataRange().getValues();
     return rows
}

/**
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet 
 * @param {any[][]} data 
 */
function appendToSheet(sheet, data) {
  if (!data.length) console.log("No data to append!");
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}


function fillDailySpendingTable() {
  const data = getSpendingData({transactions: expenses, lastDate: new Date(), unit: "day"})
   const sheet = getSheet(sheetNames.DAILY);
  sheet.clearContents();
  appendToSheet(sheet, data);
}

function fillWeeklySpendingTable() {
  const today = newDateNoTime();
  const weekStart = weekStartDate(today);
  const weeks = everyWeek(firstTransactionDate, weekStart);
  const headers = ["Date", "Spending", "% Saved", "Over Budget"];
  const rows = weeks.map((week) => {
    const spending = spendingForWeek(week);
    const percentSaved =
      spending < WEEKLY_TAKE_HOME
        ? (WEEKLY_TAKE_HOME - spending) / WEEKLY_TAKE_HOME
        : 0;
    const overBudget =
      spending > WEEKLY_TAKE_HOME ? spending - WEEKLY_TAKE_HOME : 0;
    return [week, spending, percentSaved, overBudget];
  });
  const data = [headers, ...rows];
  sheets.weekly.clearContents();
  appendToSheet(sheets.weekly, data);
}

function importDirectExpress() {
  const deTransactions = allTransactions.filter(
    (x) => x.account === "Direct Express"
  );
  const lastId =
    deTransactions.length === 0
      ? 0
      : deTransactions
          .map((x) => Number(x.transactionId))
          .sort((a, b) => b - a);

  const deSheet = getSheetByName("DirectExpress");
  const data = getDataFromSheet(deSheet);
  const notPending = data.filter((d) => d["DATE"] !== "Pending");
  const trans = notPending.map((d) =>
    newTransaction({
      date: d["DATE"] === "Pending" ? newDateNoTime() : d["DATE"],
      institution: "Comerica",
      amount: d["AMOUNT"],
      transactionId: d["TRANSACTION ID"],
      description: d["DESCRIPTION"],
      fullDescription: [d["CITY"], d["STATE"], d["COUNTRY"]].join(", "),
      account: "Direct Express",
      accountNum: "xxxx0947",
      month: monthStartDate(d["DATE"]),
      week: weekStartDate(d["DATE"]),
    })
  );


function fillCustomSheets() {
  fillDailySpendingTable();
  fillMonthlySpendingTable();
  fillWeeklySpendingTable();
  importDirectExpress();
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu("Lee")
    .addItem("Import Direct Express", "importDirectExpress")
    .addItem("Fill My Sheets", "fillCustomSheets")
    .addToUi();
}
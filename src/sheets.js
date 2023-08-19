const getSheetByName = (name = "") => {
  if (!name) throw new Error("Called 'getSheetByName' with falsy argument");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error(`Failed to get sheet '${name}'`);
  return sheet;
};

const sheets = {
  transactions: getSheetByName(TRANSACTIONS_SHEET),
  categories: getSheetByName(CATEGORIES_SHEET),
  daily: getSheetByName(DAILY_SHEET),
  weekly: getSheetByName(WEEKLY_SHEET),
  monthly: getSheetByName(MONTHLY_SHEET),
};

/**
 * Get data from Categories sheet.
 *
 * @return {import("./types").CategoryLookup}
 */
const getCategories = () => {
  const [, rows] = sheets.categories.getDataRange().getValues();
  return Object.fromEntries(rows.map(rowToCategory).map((c) => [c.name, c]));
};

/**
 * Get data from Transactions sheet.
 *
 * @return {Transaction[]}
 */
const getTransactions = () => {
  const [, rows] = sheets.transactions.getDataRange().getValues();
  return rows.map(rowToTransaction);
};

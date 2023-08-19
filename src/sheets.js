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

const getCategories = () => {
  const [, rows] = sheets.categories.getDataRange().getValues();
  return rows.map(rowToCategory);
};

/**
 * Get data from Transactions sheet
 *
 * @return {Transaction[]}
 */
const getTransactions = () => {
  const [, rows] = sheets.transactions.getDataRange().getValues();
  return rows.map(rowToTransaction);
};

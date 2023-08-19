/**
 * Constants
 */

const TRANSACTIONS_SHEET = "Transactions";
const CATEGORIES_SHEET = "Categories";
const MONTHLY_SHEET = "Monthly";
const WEEKLY_SHEET = "Weekly";
const DAILY_SHEET = "Daily";
const DIRECT_EXPRESS_SHEET = "Direct Express";

const MONTHLY_TAKE_HOME = 4848;
const WEEKLY_TAKE_HOME = MONTHLY_TAKE_HOME / 4; // 1,212
const YEARLY_TAKE_HOME = MONTHLY_TAKE_HOME * 12; // 58,176

/**
 * Model/Factories
 */

const TransTypes = Object.freeze({
  Expense: "Expense",
  Income: "Income",
  Transfer: "Transfer",
  Unknown: "Unknown",
});

const stringToTransType = (s = "") => {
  if (s === "Expense") {
    return TransTypes.Expense;
  }

  if (s === "Income") {
    return TransTypes.Income;
  }

  if (s === "Transfer") {
    return TransTypes.Transfer;
  }

  return TransTypes.Unknown;
};

const newCategory = ({
  name = "",
  type = TransTypes.Unknown,
  group = "",
  hidden = false,
} = {}) => ({ name, type, group, hidden });

const newTransaction = ({
  date = new Date(),
  account = "",
  amount = 0,
  transactionId = "",
  description = "",
  checkNumber = 0,
  category = newCategory(),
  accountNum = "",
  month = new Date(),
  week = new Date(),
  fullDescription = "",
  dateAdded = new Date(),
  institution = "",
} = {}) => ({
  date,
  account,
  amount,
  description,
  category,
  transactionId,
  checkNumber,
  fullDescription,
  dateAdded,
  month,
  week,
  accountNum,
  institution,
});

const transactionToRow = (t = newTransaction()) => [
  ,
  t.date,
  t.description,
  t.category.name,
  t.amount,
  t.account,
  t.accountNum,
  t.institution,
  t.month,
  t.week,
  t.transactionId,
  ,
  ,
  t.fullDescription,
  t.dateAdded,
  ,
];

/**
 * General Utils
 */

const ascending = (a, b) => a - b;
const descending = (a, b) => b -a;

const log = (x) =>{
  const [k, v] = Object.entries(x)[0]
  Logger.log("*** " + k + " ***")
  Logger.log(v)
}

const sum = (arr = []) => arr.reduce((a, c) => a + c, 0);

const getAmounts = (transactions = [newTransaction()]) =>
  transactions.map((t) => t.amount);

const negatives = (arr = []) => arr.filter((n) => n < 0);

const fmtUSD = (n = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

const addDays = (date = new Date(), days = 0) => {
  const newDate = (new Date(date.toDateString()));
  newDate.setDate(date.getDate() + days)
  return newDate;
}


const prevWeekStartDate = (date = new Date()) =>
  addDays(getWeekStartDate(date), -7);

const combineFilters =
  (...filters) =>
  (item) => {
    return filters.map((filter) => filter(item)).every((x) => x === true);
  };

const newDateNoTime = () => new Date((new Date()).toDateString());

/**
/* 
/* Sheet Utils
/*/
const makeCategoryFilter =
  (categoryName = "") =>
  (transaction = newTransaction()) =>
    transaction.category.name === categoryName;

const getFirstLastTransactionDates = (trans = [newTransaction()]) => {
  const dts = trans.map((t) => t.date.getTime()).sort((a, b) => a - b);
  const first = new Date(dts[0]);
  const last = new Date(dts[dts.length - 1]);
  return [first, last];
};

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

const getSheetVals = (sheet = SpreadsheetApp.getActiveSpreadsheet()) =>
  sheet.getDataRange().getValues();

const getDataFromSheet = (sheet) => {
  if (!sheet) throw new Error("Called 'getDatafrom sheet' with falsy argument");

  const [headers, ...data] = getSheetVals(sheet);

  return data.map((row) => {
    return row.reduce((acc, value, i) => {
      const key = headers[i];
      if (key === "") return acc;
      return { ...acc, [key]: value };
    }, {});
  });
};

//************************** */
const sumAmounts = (transactions) =>
  Math.abs(transactions.map((t) => t.amount).reduce((a, c) => a + c, 0));
const sameMonth = (a = new Date(), b = new Date()) =>
  a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const categories = (() => {
  const catList = getDataFromSheet(sheets.categories);
  return catList.reduce((a, c) => {
    const name = c["Category"];
    a[name] = newCategory({
      name: name,
      type: stringToTransType(c["Type"]),
      group: c["Group"],
      hidden: c["Hide From Reports"] == "Hidden" ? true : false,
    });
    return a;
  }, {});
})();

const transactions = (() => {
  const transData = getDataFromSheet(sheets.transactions);
  const o = {};
  let count = 0;
  for (const x of Object.keys(transData[0])) {
    o[x] = count;
    o[count] = x;
    count++;
  }
  return transData
    .map((row) =>
      newTransaction({
        date: row["Date"],
        account: row["Account"],
        description: row["Description"],
        amount: row["Amount"],
        category: categories[row["Category"]],
        institution: row["Institution"],
        transactionId: row["Transaction ID"],
        checkNumber: row["Check Number"],
        fullDescription: row["Full Description"],
        dateAdded: row["Date Added"],
        month: row["Month"],
        week: row["Week"],
        accountNum: row["Account #"],
      })
    )
    .filter((t) => !t.category.hidden);
})();

const expenses = transactions.filter(
  (t) => t.category.type === TransTypes.Expense
);
const income = transactions.filter(
  (t) => t.category.type === TransTypes.Income
);

const filterByDay = (trans, date) =>
  trans.filter((t) => t.date.toDateString() === date.toDateString());

const spendingForDay = (date = new Date()) =>
  sumAmounts(filterByDay(expenses, date));

const filterByMonth = (trans, date = new Date()) =>
  trans.filter((t) => sameMonth(t.date, date));

const filterByDateRange = (trans, start, stop) => trans.filter(t=> t.date.getTime() >= start.getTime() && t.date.getTime() < stop.getTime())

const spendingForWeek = (date) => sumAmounts(filterByDateRange(expenses, date, addDays(date, 7)))

const spendingForMonth = (date = new Date()) =>
  sumAmounts(filterByMonth(expenses, date));

const incomeForMonth = (date = new Date()) => sumAmounts(filterByMonth(income, date));

const firstTransactionDate = new Date(transactions.map(t=>t.date.getTime()).sort(ascending)[0])

function importDirectExpress() {
  const deTransactions = transactions.filter(
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

  const newTrans = trans.filter((t) => Number(t.transactionId) > lastId);
  if (newTrans.length === 0) {
    log("No new transactions to add!");
    return;
  }
  const newRows = newTrans.map((t) => transactionToRow(t));
  const transSheet = getSheetByName("Transactions");
  transSheet
    .getRange(transSheet.getLastRow() + 1, 1, newRows.length, newRows[0].length)
    .setValues(newRows);
  SpreadsheetApp.getUi().alert(newRows.length + " rows added.");
}
//************************** */

const getTotalSpent = (trans) => Math.abs(sum(negatives(getAmounts(trans))));

const spendingByCategory = (trans) => {
  const totalSpent = getTotalSpent(trans);

  return categories
    .reduce((a, c) => {
      const category = c.name;
      const catAmt = sum(
        getAmounts(trans.filter(makeCategoryFilter(category)))
      );
      if (catAmt < 0) {
        const amount = Math.abs(Math.round(catAmt));
        const item = {
          category,
          amount: usd(amount),
          percent: Math.round((amount / totalSpent) * 100).toFixed(0) + "%",
        };
        return [...a, item];
      }
      return a;
    }, [])
    .sort((a, b) => a.amount - b.amount);
};

const transactionsByDate = (
  start = new Date("1/1/2022"),
  stop = new Date()
) => {
  return transactions.filter(
    (t) =>
      t.date.getTime() >= start.getTime() && t.date.getTime() <= stop.getTime()
  );
};

const monthYearDate = (mi = 0, y = 2000) => new Date(y, mi, 0, 0, 0, 0, 0);

const getMonthsInRange = (start = new Date(), end = new Date()) => {
  const dates = [];
  let current = monthYearDate(start.getMonth(), start.getFullYear());
  while (current.getTime() <= end.getTime()) {
    dates.push(new Date(current.getTime()));
    current.setMonth(current.getMonth() + 1);
  }
  return dates;
};

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu("Custom Menu")
    .addItem("Import Direct Express", "importDirectExpress")
    .addItem("Fill My Sheets", "fillCustomSheets")
    .addToUi();
}

function fillMonthlySpendingByCategory() {
  const [firstDate, lastDate] = getFirstLastTransactionDates(transactions);
  const months = getMonthsInRange(firstDate, lastDate);
  for (const month of months) {
  }
  const sheet = getSheetByName("MonthlySpendingByCategory");
}

/**
 * Cell Functions
 */

// function removeEmptyRows(sh){
//   const maxRows = sh.getMaxRows(); 
//   const lastRow = sh.getLastRow();
//   sh.deleteRows(lastRow+1, maxRows-lastRow);
// }

function monthStartDate(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function weekStartDate(date = new Date()) {
  const newDate = new Date(date.getTime());
  newDate.setDate(date.getDate() - date.getDay());
  return newDate;
}

function appendToSheet(sheet, data) {
  if (!data.length) log("No data to append!");
  const lastRow = sheet.getLastRow();
  sheet
    .getRange(lastRow + 1, 1, data.length, data[0].length)
    .setValues(data);
}

function fillMonthlySpendingTable() {
  const firstMonth = new Date(2022, 3, 1);
  const today = new Date();
  let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const months = [];
  while (currentMonth.getTime() > firstMonth.getTime()) {
    log({currentMonth});
    months.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate()));
    currentMonth.setMonth(currentMonth.getMonth()-1);
  }
  log({months})
  const numberOfMonths = months.length
  log({numberOfMonths})

  const rows = months.map((month) => {
    const spending = spendingForMonth(month);
    const income = incomeForMonth(month);
    const flow = income - spending;
    return [month, spending, income, flow];
  });

  const header = ["Month", "Spending", "Income", "Flow"];

  const data = [header, ...rows];

  sheets.monthly.clearContents();
  appendToSheet(sheets.monthly, data);
}

function everyDay(startDate = new Date('2023-03-01'), endDate = new Date('2023-03-87')) {
// array of dates
const datesArray = [];

// loop from start date to end date
for (
      let date = startDate; 
      date <= endDate; 
      date.setDate(date.getDate() + 1)
    ) 
{
  datesArray.push(new Date(date));
}
return datesArray.map(d=>d.getTime()).sort(descending).map(t=>new Date(t))
}

function fillDailySpendingTable() {
  const today = newDateNoTime()
  const dates = everyDay(firstTransactionDate, today)
  const rows = dates.map(date => {
    return [date,spendingForDay(date)]
  })
  const headers = ["Date", "Spending"]
  const data = [headers, ...rows]
  sheets.daily.clearContents()
  appendToSheet(sheets.daily, data)
}

function everyWeek(startDate = new Date('2023-03-01'), endDate = new Date('2023-03-87')) {
// array of dates
const datesArray = [];

// loop from start date to end date
for (
      let date = endDate; 
      date >= startDate; 
      date.setDate(date.getDate() - 7)
    ) 
{
  datesArray.push(new Date(date));
}
return datesArray
}

function fillWeeklySpendingTable() {
  const today = newDateNoTime()
  const weekStart = weekStartDate(today)
  const weeks = everyWeek(firstTransactionDate, weekStart)
  log({weeks})
  const headers = ["Date", "Spending", "% Saved", "Over Budget"]
  const rows = weeks.map(week => {
    const spending = spendingForWeek(week)
    const percentSaved = spending < WEEKLY_TAKE_HOME ? (WEEKLY_TAKE_HOME - spending) / WEEKLY_TAKE_HOME : 0
    const overBudget = spending > WEEKLY_TAKE_HOME ? spending - WEEKLY_TAKE_HOME : 0
    return [week,spending,  percentSaved, overBudget]
  })
  const data = [headers, ...rows]
  sheets.weekly.clearContents()
  appendToSheet(sheets.weekly, data)
}

function fillCustomSheets() {
  fillDailySpendingTable()
  fillMonthlySpendingTable()
  fillWeeklySpendingTable()
  importDirectExpress()
}
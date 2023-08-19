import dayjs from "dayjs";

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

/**
 *
 * @param {import("./types").CategoryType} type
 * @returns {function(Category[], Transaction[]): Transaction[]}
 */
const makeTypeFilter = (type) => (categories, transactions) => {
  const expenseCategories = categories
    .filter((c) => c.type === type)
    .map((c) => c.name);
  return transactions.filter((t) => expenseCategories.includes(t.category));
};

const filterExpenses = makeTypeFilter("Expense");

const filterIncome = makeTypeFilter("Income");

/**
 *
 * @param {Transaction[]} trans
 * @param {Date} date
 * @returns {Transaction[]}
 */
const filterByDay = (trans, date) =>
  trans.filter((t) => t.date.toDateString() === date.toDateString());

const spendingForDay = (date = new Date()) =>
  sumAmounts(filterByDay(expenses, date));

const filterByMonth = (trans, date = new Date()) =>
  trans.filter((t) => sameMonth(t.date, date));

const filterByDateRange = (trans, start, stop) =>
  trans.filter(
    (t) =>
      t.date.getTime() >= start.getTime() && t.date.getTime() < stop.getTime()
  );

const spendingForWeek = (date) =>
  sumAmounts(filterByDateRange(expenses, date, addDays(date, 7)));

const spendingForMonth = (date = new Date()) =>
  sumAmounts(filterByMonth(expenses, date));

const incomeForMonth = (date = new Date()) =>
  sumAmounts(filterByMonth(income, date));

const firstTransactionDate = new Date(
  transactions.map((t) => t.date.getTime()).sort(ascending)[0]
);

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
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
}

function fillMonthlySpendingTable() {
  const firstMonth = new Date(2022, 3, 1);
  const today = new Date();
  let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const months = [];
  while (currentMonth.getTime() > firstMonth.getTime()) {
    log({ currentMonth });
    months.push(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        currentMonth.getDate()
      )
    );
    currentMonth.setMonth(currentMonth.getMonth() - 1);
  }
  log({ months });
  const numberOfMonths = months.length;
  log({ numberOfMonths });

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

function everyDay(
  startDate = new Date("2023-03-01"),
  endDate = new Date("2023-03-87")
) {
  // array of dates
  const datesArray = [];

  // loop from start date to end date
  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    datesArray.push(new Date(date));
  }
  return datesArray
    .map((d) => d.getTime())
    .sort(descending)
    .map((t) => new Date(t));
}

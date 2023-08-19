import dayjs from "dayjs";

function fillDailySpendingTable() {
  const today = newDateNoTime();
  const dates = everyDay(firstTransactionDate, today);
  const rows = dates.map((date) => {
    return [date, spendingForDay(date)];
  });
  const headers = ["Date", "Spending"];
  const data = [headers, ...rows];
  sheets.daily.clearContents();
  appendToSheet(sheets.daily, data);
}

function everyWeek(
  startDate = new Date("2023-03-01"),
  endDate = new Date("2023-03-87")
) {
  // array of dates
  const datesArray = [];

  // loop from start date to end date
  for (
    let date = endDate;
    date >= startDate;
    date.setDate(date.getDate() - 7)
  ) {
    datesArray.push(new Date(date));
  }
  return datesArray;
}

function fillWeeklySpendingTable() {
  const today = newDateNoTime();
  const weekStart = weekStartDate(today);
  const weeks = everyWeek(firstTransactionDate, weekStart);
  log({ weeks });
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

function fillCustomSheets() {
  fillDailySpendingTable();
  fillMonthlySpendingTable();
  fillWeeklySpendingTable();
  importDirectExpress();
}

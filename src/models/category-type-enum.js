// Column - Index (0-based) map
const cl = Object.freeze({
  category: 0,
  group: 1,
  typeName: 2,
  hideFromReports: 3,
  jan2023: 4,
  feb2023: 5,
  mar2023: 6,
  apr2023: 7,
  may2023: 8,
  jun2023: 9,
  jul2023: 10,
  aug2023: 11,
  sep2023: 12,
  oct2023: 13,
  nov2023: 14,
  dec2023: 15,
});

export const CategoryType = Object.freeze({
  Income: "Income",
  Expense: "Expense",
  Transaction: "Transaction",
  NONE: "",
});

export const getCategoryType = (category = "") => {
  if (category === "Income") return CategoryType.Income;
  if (category === "Expense") return CategoryType.Expense;
  if (category === "Transaction") return CategoryType.Transaction;
  return CategoryType.NONE;
};

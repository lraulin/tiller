/**
 * Constants
 */

export const sheetNames = Object.freeze({
  TRANSACTIONS: "Transactions",
  CATEGORIES: "Categories",
  MONTHLY: "Monthly",
  WEEKLY: "Weekly",
  DAILY: "Daily",
  DIRECT_EXPRESS: "DirectExpress",
});

const monthly = 4848;

export const takeHomePay = Object.freeze({
  MONTHLY: monthly,
  WEEKLY: monthly / 4, // 1,212
  YEARLY: monthly * 12, // 58,176
});

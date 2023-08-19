/**
 *
 *
 * @param {import("./types").CategoryRow} r
 * @return {Category}
 */
const rowToCategory = (r) => {
  const [name, group, type, hideFromReports] = r;
  return {
    name,
    group,
    type,
    hidden: hideFromReports === "Hidden" ? true : false,
  };
};

/**
 *
 * @param {import("./types").TransactionRow} r
 * @returns {Transaction}
 */
const rowToTransaction = (r) => {
  const [
    ,
    date,
    description,
    category,
    amount,
    account,
    accountNumber,
    institution,
    month,
    week,
    transactionId,
    accountId,
    checkNumber,
    fullDescription,
    dateAdded,
    categorizedDate,
  ] = r;
  return {
    date,
    description,
    category,
    amount,
    account,
    accountNumber,
    institution,
    month,
    week,
    transactionId,
    accountId,
    checkNumber,
    fullDescription,
    dateAdded,
    categorizedDate,
  };
};

/**
 *
 *
 * @param {Transaction} t
 * @returns {import("./types").TransactionRow}
 */
const transactionToRow = ({
  date,
  description,
  category,
  amount,
  account,
  accountNumber,
  institution,
  month,
  week,
  transactionId,
  accountId,
  checkNumber,
  fullDescription,
  dateAdded,
  categorizedDate,
}) => [
  ,
  date,
  description,
  category,
  amount,
  account,
  accountNumber,
  institution,
  month,
  week,
  transactionId,
  accountId,
  checkNumber,
  fullDescription,
  dateAdded,
  categorizedDate,
];

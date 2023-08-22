/**
 *
 *
 * @param {import("./types").CategoryRow} r
 * @return {import("./types").Category}
 */
export const rowToCategory = (r) => {
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
 *
 * @param {import("./types").Transaction} t
 * @returns {import("./types").TransactionRow}
 */
export const transactionToRow = ({
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

/** @typedef {import('./types.js').Category} Category */
/** @typedef {import('./types.js').Transaction} Transaction */

/**
 * Returns a Category object
 *
 * @param {Category} param0
 */
const createCategory = ({ name, type, group, hidden }) => ({
  name,
  type,
  group,
  hidden,
});

/**
 * Returns a Transaction object
 *
 * @param {Transaction} param0
 */
const createTransaction = ({
  account,
  accountNumber,
  amount,
  category,
  checkNumber,
  date,
  dateAdded,
  description,
  fullDescription,
  institution,
  month,
  transactionId,
  week,
}) => ({
  account,
  accountNumber,
  amount,
  category,
  checkNumber,
  date,
  dateAdded,
  description,
  fullDescription,
  institution,
  month,
  transactionId,
  week,
});

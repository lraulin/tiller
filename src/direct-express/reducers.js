/**@typedef {import("./transformers.js").DirectExpressTransaction} DirectExpressTransaction */
/** @typedef {Record<number,DirectExpressTransaction>} IdMap */

/**
 *
 * @param {IdMap} accumulator
 * @param {DirectExpressTransaction} current
 * @returns {IdMap}
 */
export const idMapReducer = (accumulator, current) => {
  if (!accumulator[current.transactionId]) {
    accumulator[current.transactionId] = current;
    return accumulator;
  }

  const copyA = accumulator[current.transactionId];
  const copyB = current;

  if (copyA.isPending) {
    accumulator[current.transactionId] = copyB;
  }
  return accumulator;
};

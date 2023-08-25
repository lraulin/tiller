import { Transaction } from "../transactions/types.js";

/**
 * @typedef {Object} DEData
 * @property {Date|"Pending"} date
 * @property {number} transactionId
 * @property {string} description
 * @property {number} amount
 * @property {string} transactionType
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {boolean} isPending
 */

/**@type {DEData} */
export let DEData;

/**
 * @typedef {Object} DirectExpressTransaction
 * @property {Date?} date
 * @property {number} transactionId
 * @property {string} description
 * @property {number} amount
 * @property {string} transactionType
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {boolean} isPending
 * @property {function(DEData):DirectExpressTransaction} init
 * @property {function():any[]} toRow
 * @property {function():Transaction} toTiller
 */

/**@type {DirectExpressTransaction} */
export let DirectExpressTransaction;

/** @typedef {Record<number,DirectExpressTransaction>} IdMap */

/**@type {IdMap} */
export let IdMap;

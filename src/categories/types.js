/**
 * @typedef {'year'|'month'|'week'|'day'} TimeUnit
 */

/**@type {TimeUnit} */
export let TimeUnit;

/**
 * @typedef {'Expense'|'Income'|'Transfer'|'Uncategorized'} CategoryType
 */

/**@type {CategoryType} */
export let CategoryType;

/**
 * Represents an item from the Category table.
 * Row from Tiller's Categories table:
 *
 *  0	Category
 *  1	Group
 *  2	Type
 *  3	Hide From Reports
 *  4	Jan 2023
 *  5	Feb 2023
 *  6	Mar 2023
 *  7	Apr 2023
 *  8	May 2023
 *  9	Jun 2023
 * 10	Jul 2023
 * 11	Aug 2023
 * 12	Sep 2023
 * 13	Oct 2023
 * 14	Nov 2023
 * 15	Dec 2023
 *
 *
 * @typedef {object} Category
 * @property {string} name
 * @property {CategoryType} type
 * @property {string} group
 * @property {boolean} hidden
 */

/**@type {Category} */
export let Category;

/**
 * Object to retrieve category information by category name.
 *
 * @typedef {Object.<string, Category>} CategoryLookup
 */

/**@type {CategoryLookup} */
export let CategoryLookup;

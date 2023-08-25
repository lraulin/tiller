/**@typedef {import("./sheets.js").SheetName} SheetName */
import { getRowsFromSheet, getSheet } from "./sheets.js";

const SHEET_NAME = /**@type {SheetName} */ ("Categories");
const categorySheet = getSheet(SHEET_NAME);
let categories = [];
let categoryLookup;

/**
 *
 *
 * @param {any[]} r
 * @return {Category}
 */
const rowToCategory = (r) => {
  if (r.length < 4) throw new Error("Invalid category row");

  const [name, group, type, hideFromReports] = r;
  return {
    name,
    group,
    type,
    hidden: hideFromReports === "Hidden" ? true : false,
  };
};

export function getCategories() {
  if (categories.length > 0) {
    return categories;
  }

  const categoryRows = getRowsFromSheet(categorySheet);
  if (categoryRows.length === 0) throw new Error("No categories found");

  categories = categoryRows.map(rowToCategory);
  return categories;
}

export function getCategoryLookup() {
  if (!!categoryLookup) {
    return categoryLookup;
  }

  if (!categories.length) {
    categories = getCategories();
  }

  categoryLookup = categories.map((c) => [c.name, c]);
  return categoryLookup;
}

/**
 * @typedef {'year'|'month'|'week'|'day'} TimeUnit
 */

/**
 * @typedef {'Expense'|'Income'|'Transfer'|'Uncategorized'} CategoryType
 */

/**
 * Represents an item from the Category table.
 *
 * @typedef {object} Category
 * @property {string} name
 * @property {CategoryType} type
 * @property {string} group
 * @property {boolean} hidden
 */

/**
 * Object to retrieve category information by category name.
 *
 * @typedef {Object.<string, Category>} CategoryLookup
 */

/**
 * Row from Tiller's Categories table
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
 */

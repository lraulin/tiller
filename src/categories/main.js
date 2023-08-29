import { Category, CategoryLookup } from "./types.js";
import { get, getRows } from "../sheets/main.js";

import { categoryLookupReducer } from "./reducers.js";
import { rowToCategory } from "./transformers.js";

const SHEET_NAME = "Categories";

/**@type {GoogleAppsScript.Spreadsheet.Sheet} */
const categorySheet = get(SHEET_NAME);

/**@type {Category[]} */
let categories = [];

/**@type {CategoryLookup} */
let categoryLookup;

/**
 *
 * @returns {Category[]}
 */
export function getCategories() {
  if (categories.length > 0) {
    return categories;
  }

  const categoryRows = getRows(categorySheet);
  if (categoryRows.length === 0) throw new Error("No categories found");

  categories = categoryRows.map(rowToCategory);
  return categories;
}

/**
 *
 * @returns {CategoryLookup}
 */
export function getCategoryLookup() {
  if (!!categoryLookup) {
    return categoryLookup;
  }

  if (!categories.length) {
    categories = getCategories();
  }

  categoryLookup = categories.reduce(categoryLookupReducer, {});
  return categoryLookup;
}

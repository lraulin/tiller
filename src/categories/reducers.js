import { Category, CategoryLookup } from "./types.js";

/**
 *
 * @param {CategoryLookup} accumulator
 * @param {Category} current
 * @returns
 */
export const categoryLookupReducer = (accumulator, current) => {
  accumulator[current.name] = current;
  return accumulator;
};

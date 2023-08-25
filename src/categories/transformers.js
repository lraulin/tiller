import { Category } from "./types.js";

/**
 *
 *
 * @param {any[]} r
 * @return {Category}
 */
export const rowToCategory = (r) => {
  if (r.length < 4) throw new Error("Invalid category row");

  const [name, group, type, hideFromReports] = r;
  return {
    name,
    group,
    type,
    hidden: hideFromReports === "Hidden" ? true : false,
  };
};

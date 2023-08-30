import { getSheetByName } from "../utils.js";

const CATEGORIES = "Categories";

class CategoryService {
  sheetName = CATEGORIES;
  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /** @type {Category[]} */
  #categories = [];
  #typeLookup = {};

  constructor() {
    this.#sheet = getSheetByName(CATEGORIES);
  }

  load() {
    const [...rows] = this.#sheet.getDataRange().getValues();
    this.#categories = rows.map((row) => new Category(row));

    this.#typeLookup = this.#categories.reduce((acc, c) => {
      return { ...acc, [c.name]: c.type };
    }, {});
  }

  save() {
    const rows = this.#categories.map((c) => c.toArray());
    this.#sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

  getType(categoryName) {
    const type = this.#typeLookup[categoryName];
    if (!type) throw new Error(`Category ${categoryName} not found`);
    return type;
  }
}

export default new CategoryService();

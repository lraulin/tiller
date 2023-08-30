import Category from "../models/category.js";
import sheets from "../shared/sheets.js";

const CATEGORIES = "Categories";

class CategoryService {
  sheetName = CATEGORIES;
  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /** @type {Category[]} */
  #categories = [];
  #lookup = {};

  constructor() {
    this.#sheet = sheets.get(CATEGORIES);
    this.load();
    Logger.log("CategoryService loaded");
    Logger.log(this.#categories);
  }

  load() {
    const [, ...rows] = this.#sheet.getDataRange().getValues();
    this.#categories = rows.map((row) => new Category(row));

    this.#lookup = this.#categories.reduce((acc, c) => {
      return { ...acc, [c.name]: c };
    }, {});
  }

  save() {
    const rows = this.#categories.map((c) => c.toArray());
  }

  getType(categoryName) {
    const type = this.#lookup[categoryName]?.type;
    if (!type) throw new Error(`Category ${categoryName} not found`);
    return type;
  }

  getCategoryByName(categoryName) {
    return { ...this.#lookup[categoryName] };
  }
}

export default new CategoryService();

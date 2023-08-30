const CATEGORIES = "Categories";

export default class CategoryService {
  sheetName = CATEGORIES;
  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /** @type {Category[]} */
  #categories = [];
  #typeLookup = {};

  constructor() {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (sheet === null) throw new Error(`Sheet ${SHEET_NAME} not found`);
    this.#sheet = sheet;
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

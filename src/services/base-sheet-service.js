import stampit from "stampit";

const BaseSheetService = stampit({
  // #region PROPERTIES
  props: {
    /**@type {GoogleAppsScript.Spreadsheet.Sheet|null} */
    sheet: null,
    /**@type {Function|null} */
    model: null,
    /**@type {any[]} */
    data: [],
  }, // #endregion PROPERTIES

  // #region INIT
  init({ sheetName, model }) {
    this.sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!this.sheet) throw new Error(`Unable to retrieve '${sheetName}' sheet`);
    this.model = model;
    this.load();
  }, // #endregion INIT

  // #region METHODS
  methods: {
    load() {
      const [, ...rows] = this.sheet.getDataRange().getValues();
      this.data = rows.map((row) => this.model(row));
    },
    save() {
      const lastRow = this.sheet.getLastRow();
      const rangeToOverwrite = this.sheet.getRange(
        2,
        1,
        lastRow - 1,
        this.sheet.getLastColumn()
      );

      rangeToOverwrite.clearContent();

      const rows = this.data.map((t) => t.toArray());
      this.sheet
        .getRange(lastRow + 1, 1, rows.length, rows[0].length)
        .setValues(rows);
      this.sortSheet();
    },
    sortSheet(sortSpecObj) {
      /**@type {GoogleAppsScript.Spreadsheet.Range} */
      const range = this.sheet.getRange(
        2,
        1,
        this.sheet.getLastRow() - 1,
        this.sheet.getLastColumn()
      );
      range.sort(sortSpecObj);
      this.load();
    },
  }, // #endregion METHODS
});

export default BaseSheetService;

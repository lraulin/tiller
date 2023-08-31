import { BaseSheetService } from "../shared/types.js";
import stampit from "stampit";

const ERR_MSG_NULL_PROPS = "service not initialized";
const ERR_MSG_NO_SHEET = ERR_MSG_NULL_PROPS + ": sheet not found";
const ERR_MSG_NO_MODEL = ERR_MSG_NULL_PROPS + ": missing data model";

const BaseSheetServiceStamp = stampit({
  // #region PROPERTIES
  props: {
    sheet: null,

    model: null,

    data: [],
  }, // #endregion PROPERTIES

  // #region INIT

  /**
   * @this {BaseSheetService}
   * @param {Object} param0
   * @param {string} param0.sheetName
   * @param {Function} param0.model
   */
  init({ sheetName, model }) {
    this.sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!this.sheet) throw new Error(`Unable to retrieve '${sheetName}' sheet`);
    this.model = model;
    this.load();
  }, // #endregion INIT

  // #region METHODS
  methods: {
    /**
     * @this {BaseSheetService}
     */
    get headers() {
      if (!this.sheet) throw new Error(ERR_MSG_NO_SHEET);
      return this.sheet
        .getRange(1, 1, 1, this.sheet.getLastColumn())
        .getValues()[0]
        .map((h) => String(h).trim());
    },

    /**
     * @this {BaseSheetService}
     */
    load() {
      if (!this.sheet) throw new Error(ERR_MSG_NO_SHEET);
      if (this.model === null) throw new Error(ERR_MSG_NO_MODEL);

      const [, ...rows] = this.sheet.getDataRange().getValues();
      // @ts-ignore
      this.data = rows.map((row) => this.model(row));
    },

    /**
     * @this {BaseSheetService}
     */
    save() {
      if (!this.sheet) throw new Error(ERR_MSG_NO_SHEET);
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
    },

    /**
     * @this {BaseSheetService}
     */
    sortSheet(sortSpecObj) {
      if (!this.sheet) throw new Error(ERR_MSG_NO_SHEET);
      const range = this.sheet.getRange(
        2,
        1,
        this.sheet.getLastRow() - 1,
        this.sheet.getLastColumn()
      );
      range.sort(sortSpecObj);
      this.load();
    },

    /**
     * @this {BaseSheetService}
     */
    sortByColumn({ columnName, ascending = true }) {
      const column =
        this.headers
          .map((h) => String(this.headers).toLocaleLowerCase())
          .indexOf(columnName.toLocaleLowerCase()) + 1;
      this.sortSheet({ column, ascending });
    },
  }, // #endregion METHODS
});

export default BaseSheetServiceStamp;

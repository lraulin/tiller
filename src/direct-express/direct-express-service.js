import DirectExpressTransaction from "./direct-express-transaction.js";
import { getSheetByName } from "../utils.js";

const DIRECT_EXPRESS = "DirectExpress";
const ACCOUNT_NAME = "Direct Express";
const ACCOUNT_NUMBER = "xxxx0947";
const INSTITUTION = "Comerica";

export default class DirectExpressService {
  sheetName = DIRECT_EXPRESS;
  /**@type {GoogleAppsScript.Spreadsheet.Sheet} */
  #sheet;
  /**@type {DirectExpressTransaction[]} */
  #transactions;

  constructor() {
    this.#sheet = getSheetByName(DIRECT_EXPRESS);
  }
}

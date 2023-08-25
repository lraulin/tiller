/**
 * Functions to be exposed directly to Google Sheets
 */

import {
  deDuplicateDirectExpressTransactions,
  sortDirectExpressTransactions,
  writeToDirectExpressSheet,
} from "./main.js";

export function cleanUp() {
  deDuplicateDirectExpressTransactions();
  sortDirectExpressTransactions();
  writeToDirectExpressSheet();
}

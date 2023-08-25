import { CategoryType } from "../categories/types.js";
import { Transaction } from "./types.js";

/**
 * @param {CategoryType} type
 * @returns {(t:Transaction)=>boolean}
 */
const typeFilter = (type) => (t) => t.type === type;

export const typeIsExpense = typeFilter("Expense");
export const typeIsIncome = typeFilter("Income");
export const typeIsTransfer = typeFilter("Transfer");

/**@typedef {'Comerica'|'Capital One'|'Penfed'} Institution */

/**
 * @param {Institution} institution
 * @returns {(t:Transaction)=>boolean}
 */
const institutionFilter = (institution) => (t) => t.institution === institution;

export const institutionIsComerica = institutionFilter("Comerica");
export const institutionIsCapitalOne = institutionFilter("Capital One");
export const institutionIsPenfed = institutionFilter("Penfed");

/**
 *
 * @param {Transaction} t
 * @returns {boolean}
 */
export const isNotPending = (t) => !t.description.includes("[Pending]");

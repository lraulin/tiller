import dayjs from "dayjs";
import { startOfDate, startOfMonth, startOfWeek } from "./utils.js";

/**
 *
 * Row from Tiller's transactions table
 *
 *  0
 *  1	Date
 *  2	Description
 *  3	Category
 *  4	Amount
 *  5	Account
 *  6	Account #
 *  7	Institution
 *  8	Month
 *  9	Week
 * 10	Transaction ID
 * 11	Account ID
 * 12	Check Number
 * 13	Full Description
 * 14	Date Added
 * 15	Categorized Date
 * //@typedef {[undefined, Date, string, string, number, string, string, string, Date, Date, string, string, string, string, Date, Date?]} TransactionRow
 */

/**
 * 0	DATE              string
 * 1	TRANSACTION ID    number
 * 2	DESCRIPTION       string
 * 3	AMOUNT            number
 * 4	TRANSACTION TYPE  string
 * 5	CITY              string
 * 6	STATE             string
 * 7	COUNTRY           string
 //* @typedef {[DirectExpressDate, number, string, number, string, string, string, string]} DirectExpressRow
 */

/**@typedef {Date|"Pending"} DirectExpressDate */

export default {};

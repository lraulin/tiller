import CategoryType from "../models/category-type-enum.js";

// const headers = [
//   "Category",
//   "Group",
//   "Type",
//   "Hide From Reports",
//   "Jan 2023",
//   "Feb 2023",
//   "Mar 2023",
//   "Apr 2023",
//   "May 2023",
//   "Jun 2023",
//   "Jul 2023",
//   "Aug 2023",
//   "Sep 2023",
//   "Oct 2023",
//   "Nov 2023",
//   "Dec 2023",
// ];

/**
 * Represents a category that includes properties like name, type, group, and hidden status.
 * This is primarily designed for representing a row from Tiller's Category Table.
 */
export default class Category {
  /**
   * The name of the category.
   * @type {string}
   */
  name = "";

  /**
   * The type of the category, represented as an instance of CategoryType.
   * @type {CategoryType}
   */
  type = CategoryType.NONE;

  /**
   * The group that this category belongs to.
   * @type {string}
   */
  group = "";

  /**
   * Flag to indicate if the category should be hidden from reports.
   * @type {boolean}
   */
  hidden = false;
  jan2023 = 0;
  feb2023 = 0;
  mar2023 = 0;
  apr2023 = 0;
  may2023 = 0;
  jun2023 = 0;
  jul2023 = 0;
  aug2023 = 0;
  sep2023 = 0;
  oct2023 = 0;
  nov2023 = 0;
  dec2023 = 0;

  /**
   * Creates an instance of the Category class.
   * @param {Array} row - An array containing cell values for a row from the Category Table.
   */
  constructor(row) {
    const [
      category,
      group,
      type,
      hideFromReports,
      jan2023,
      feb2023,
      mar2023,
      apr2023,
      may2023,
      jun2023,
      jul2023,
      aug2023,
      sep2023,
      oct2023,
      nov2023,
      dec2023,
    ] = row;

    this.name = category;
    this.type = CategoryType.fromString(type);
    this.group = group;
    this.hidden = hideFromReports === "Hide";
    this.jan2023 = jan2023;
    this.feb2023 = feb2023;
    this.mar2023 = mar2023;
    this.apr2023 = apr2023;
    this.may2023 = may2023;
    this.jun2023 = jun2023;
    this.jul2023 = jul2023;
    this.aug2023 = aug2023;
    this.sep2023 = sep2023;
    this.oct2023 = oct2023;
    this.nov2023 = nov2023;
    this.dec2023 = dec2023;
  }

  toArray() {
    return [
      this.name,
      this.group,
      this.type.toString(),
      this.hidden ? "Hide" : "",
      this.jan2023,
      this.feb2023,
      this.mar2023,
      this.apr2023,
      this.may2023,
      this.jun2023,
      this.jul2023,
      this.aug2023,
      this.sep2023,
      this.oct2023,
      this.nov2023,
      this.dec2023,
    ];
  }
}

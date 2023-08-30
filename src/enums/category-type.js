/**
 * Represents a type of category, such as Expense, Income, Transfer or None.
 */
export default class CategoryType {
  #name = "";

  /**
   * Represents an Expense type of category.
   * @type {CategoryType}
   */
  static EXPENSE = new CategoryType("Expense");

  /**
   * Represents an Income type of category.
   * @type {CategoryType}
   */
  static INCOME = new CategoryType("Income");

  /**
   * Represents a Transfer type of category.
   * @type {CategoryType}
   */
  static TRANSFER = new CategoryType("Transfer");

  /**
   * Represents an undefined or None type of category.
   * @type {CategoryType}
   */
  static NONE = new CategoryType("");

  /**
   * Creates an instance of CategoryType.
   * @param {string} name - The name of the category type.
   */
  constructor(name) {
    /**
     * The name of the category type.
     * @type {string}
     */
    this.#name = name;
  }

  /**
   * Creates a new CategoryType instance from a string.
   * @param {string} type - The string representation of the category type.
   * @returns {CategoryType} The corresponding CategoryType instance.
   */
  static fromString(type) {
    switch (type) {
      case "Expense":
        return CategoryType.EXPENSE;
      case "Income":
        return CategoryType.INCOME;
      case "Transfer":
        return CategoryType.TRANSFER;
      default:
        return CategoryType.NONE;
    }
  }

  /**
   * Converts the CategoryType instance to its string representation.
   * @returns {string} The name of the category type.
   */
  static toString() {
    return this.#name;
  }
}

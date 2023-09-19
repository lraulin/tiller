import BaseSheetService from "./base-sheet-service";
import Category from "../models/category";
import { InitializationError } from "../shared/errors";

class CategoryService extends BaseSheetService<Category> {
  lookup: Record<string, Category> = {};

  constructor() {
    super("Categories", Category);

    if (!this.data.length) {
      throw new InitializationError("Categories not loaded");
    }
    this.lookup = this.data.reduce((acc, c) => {
      return { ...acc, [c.name]: c };
    }, {});
  }

  getCategoryData(categoryName) {
    return { ...this.lookup[categoryName] };
  }
}

export default new CategoryService();

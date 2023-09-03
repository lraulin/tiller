import BaseSheetServiceFactory from "./base-sheet-service.js";
import Category from "../models/category.js";

const CategoryPrototype = Object.defineProperties(
  {},
  {
    isHidden: {
      get() {
        return this.hiddenFromReports === "Hidden";
      },
      set(value) {
        this.hiddenFromReports = value ? "Hidden" : "";
      },
    },
  }
);

const CategoryServiceFactory = () => {
  const base = BaseSheetServiceFactory({ sheetName: "Categories" });
  base.data = base.data.map((row) => Category.from(row));
  Logger.log("Wrapping transactions");
  Logger.log(base.data);

  const lookup = base.data.reduce((acc, c) => {
    return { ...acc, [c.name]: c };
  }, {});

  const methods = {
    getCategoryData(categoryName) {
      return lookup[categoryName];
    },
  };
  return { ...base, ...methods };
};

export default CategoryServiceFactory();

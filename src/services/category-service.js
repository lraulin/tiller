import BaseSheetServiceFactory from "./base-sheet-service.js";
import CategoryFactory from "../models/category.js";

const CategoryServiceFactory = () => {
  const base = BaseSheetServiceFactory({ sheetName: "Categories" });
  base.data = base.data.map((row) => CategoryFactory(row));

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

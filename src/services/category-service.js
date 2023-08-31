import BaseSheetService from "./base-sheet-service.js";
import Category from "../models/category.js";

const CategoryService = BaseSheetService({
  sheetName: "Categories",
  model: Category,
}).compose({
  // #region PROPERTIES
  props: {
    lookup: {},
  }, // #endregion PROPERTIES

  // #region INIT
  init() {
    this.lookup = this.data.reduce((acc, c) => {
      return { ...acc, [c.name]: c };
    }, {});
  }, // #endregion INIT

  // #region METHODS
  methods: {
    getCategoryData(categoryName) {
      return { ...this.lookup[categoryName] };
    },
  }, // #endregion METHODS
});

export default CategoryService();

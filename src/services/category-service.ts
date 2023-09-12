import BaseSheetServiceFactory from "./base-sheet-service";
import CategoryFactory from "../models/category";
import { CategoryService } from "../shared/types";
import { InitializationError } from "../shared/errors";
import stampit from "stampit";

const CategoryServiceFactory = stampit(BaseSheetServiceFactory, {
  // #region PROPERTIES
  props: {
    lookup: {},
  }, // #endregion PROPERTIES

  // #region INIT
  init() {
    if (!this.data.length) {
      throw new InitializationError("Categories not loaded");
    }
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

/**@type {CategoryService} */
const service = CategoryServiceFactory({
  sheetName: "Categories",
  model: CategoryFactory,
});
export default service;

import BaseSheetServiceFactory from "./base-sheet-service.js";
import CategoryFactory from "../models/category.js";
import { CategoryService } from "../shared/types.js";
import stampit from "stampit";

const CategoryServiceFactory = stampit(
  BaseSheetServiceFactory({
    sheetName: "Categories",
    model: CategoryFactory,
  }),
  {
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
  }
);

/**@type {CategoryService} */
const service = CategoryServiceFactory();
export default service;

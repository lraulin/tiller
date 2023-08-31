import BaseSheetServiceStamp from "./base-sheet-service.js";
import Category from "../models/category.js";
import stampit from "stampit";

///
// CategoryService is responsible for interacting with the 'Categories' sheet.
// It extends the BaseSheetService to handle category-specific functionality.
//
// @typedef {Object} CategoryServiceTypeExtensions
//
// @property {Object} lookup - A lookup table for quick category retrieval.
// @property {Category[]} data - The loaded category data from the Google Sheet.
//
// @property {function(string): void} getCategoryData - Retrieves the data for a specified category.
///

const CategoryService = stampit(
  BaseSheetServiceStamp({
    sheetName: "Categories",
    model: Category,
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


let CategoryServiceType;
export default CategoryService;


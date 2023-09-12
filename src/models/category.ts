import CategoryType from "../models/category-type-enum";
import stampit from "stampit";

const columns = Object.freeze({
  category: 0,
  group: 1,
  typeName: 2,
  hideFromReports: 3,
  jan2023: 4,
  feb2023: 5,
  mar2023: 6,
  apr2023: 7,
  may2023: 8,
  jun2023: 9,
  jul2023: 10,
  aug2023: 11,
  sep2023: 12,
  oct2023: 13,
  nov2023: 14,
  dec2023: 15,
});

/**
 * Represents a category that includes properties like name, type, group, and hidden status.
 * This is primarily designed for representing a row from Tiller's Category Table.
 */
const CategoryFactory = stampit({
  props: {
    name: "",
    type: CategoryType.NONE,
    group: "",
    isHidden: false,
    budget: {
      jan2023: 0,
      feb2023: 0,
      mar2023: 0,
      apr2023: 0,
      may2023: 0,
      jun2023: 0,
      jul2023: 0,
      aug2023: 0,
      sep2023: 0,
      oct2023: 0,
      nov2023: 0,
      dec2023: 0,
    },
  },
  init(data) {
    if (Array.isArray(data)) {
      this.initFromRow(data);
      return;
    }

    this.initFromObject(data);
  },
  methods: {
    initFromObject({ name, type, group, isHidden, budget = {} } = {}) {
      this.name = name;
      this.type = type;
      this.group = group;
      this.isHidden = isHidden;
      this.budget.jan2023 = budget.jan2023 ?? 0;
      this.budget.feb2023 = budget.feb2023 ?? 0;
      this.budget.mar2023 = budget.mar2023 ?? 0;
      this.budget.apr2023 = budget.apr2023 ?? 0;
      this.budget.may2023 = budget.may2023 ?? 0;
      this.budget.jun2023 = budget.jun2023 ?? 0;
      this.budget.jul2023 = budget.jul2023 ?? 0;
      this.budget.aug2023 = budget.aug2023 ?? 0;
      this.budget.sep2023 = budget.sep2023 ?? 0;
      this.budget.oct2023 = budget.oct2023 ?? 0;
      this.budget.nov2023 = budget.nov2023 ?? 0;
      this.budget.dec2023 = budget.dec2023 ?? 0;
    },
    initFromRow(row) {
      this.name = row[columns.category];
      this.type = CategoryType[row[columns.typeName]];
      this.group = row[columns.group];
      this.isHidden = row[columns.hideFromReports] === "Hidden";
      this.budget.jan2023 = row[columns.jan2023];
      this.budget.feb2023 = row[columns.feb2023];
      this.budget.mar2023 = row[columns.mar2023];
      this.budget.apr2023 = row[columns.apr2023];
      this.budget.may2023 = row[columns.may2023];
      this.budget.jun2023 = row[columns.jun2023];
      this.budget.jul2023 = row[columns.jul2023];
      this.budget.aug2023 = row[columns.aug2023];
      this.budget.sep2023 = row[columns.sep2023];
      this.budget.oct2023 = row[columns.oct2023];
      this.budget.nov2023 = row[columns.nov2023];
      this.budget.dec2023 = row[columns.dec2023];
    },
    toRow() {
      return [
        this.name,
        this.group,
        CategoryType[this.type],
        this.isHidden ? "Hidden" : "",
        this.budget.jan2023,
        this.budget.feb2023,
        this.budget.mar2023,
        this.budget.apr2023,
        this.budget.may2023,
        this.budget.jun2023,
        this.budget.jul2023,
        this.budget.aug2023,
        this.budget.sep2023,
        this.budget.oct2023,
        this.budget.nov2023,
        this.budget.dec2023,
      ];
    },
  },
});

export default CategoryFactory;

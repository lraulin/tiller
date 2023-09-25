import Model from "./model";

type CategoryRow = [
  string, // category
  string, // group
  string, // typeName
  string, // hideFromReports
  number, // jan2023
  number, // feb2023
  number, // mar2023
  number, // apr2023
  number, // may2023
  number, // jun2023
  number, // jul2023
  number, // aug2023
  number, // sep2023
  number, // oct2023
  number, // nov2023
  number // dec2023
];

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

type CategoryType = "Income" | "Expense" | "Transfer" | "Unknown";

const getType = (type: string): CategoryType => {
  switch (type) {
    case "Income":
      return "Income";
    case "Expense":
      return "Expense";
    case "Transfer":
      return "Transfer";
    default:
      return "Unknown";
  }
};

interface CategoryBudget {
  jan2023: number;
  feb2023: number;
  mar2023: number;
  apr2023: number;
  may2023: number;
  jun2023: number;
  jul2023: number;
  aug2023: number;
  sep2023: number;
  oct2023: number;
  nov2023: number;
  dec2023: number;
}

interface CategoryData {
  name: string;
  type: CategoryType;
  group: string;
  isHidden: boolean;
  budget?: CategoryBudget;
}

export default class Category extends Model implements CategoryData {
  name = "";
  type: CategoryType = "Unknown";
  group = "";
  isHidden = false;
  budget?: CategoryBudget = {
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
  };

  constructor(categoryData: CategoryData);
  constructor(row: CategoryRow);
  constructor(data: CategoryData | CategoryRow) {
    super(data);
    if (Array.isArray(data)) {
      this.name = data[columns.category];
      this.type = getType(data[columns.typeName]);
      this.group = data[columns.group];
      this.isHidden = data[columns.hideFromReports] === "Hidden";
      this.budget.jan2023 = data[columns.jan2023];
      this.budget.feb2023 = data[columns.feb2023];
      this.budget.mar2023 = data[columns.mar2023];
      this.budget.apr2023 = data[columns.apr2023];
      this.budget.may2023 = data[columns.may2023];
      this.budget.jun2023 = data[columns.jun2023];
      this.budget.jul2023 = data[columns.jul2023];
      this.budget.aug2023 = data[columns.aug2023];
      this.budget.sep2023 = data[columns.sep2023];
      this.budget.oct2023 = data[columns.oct2023];
      this.budget.nov2023 = data[columns.nov2023];
      this.budget.dec2023 = data[columns.dec2023];
      return;
    }

    this.name = data.name;
    this.type = data.type;
    this.group = data.group;
    this.isHidden = data.isHidden;
    this.budget.jan2023 = data.budget.jan2023 ?? 0;
    this.budget.feb2023 = data.budget.feb2023 ?? 0;
    this.budget.mar2023 = data.budget.mar2023 ?? 0;
    this.budget.apr2023 = data.budget.apr2023 ?? 0;
    this.budget.may2023 = data.budget.may2023 ?? 0;
    this.budget.jun2023 = data.budget.jun2023 ?? 0;
    this.budget.jul2023 = data.budget.jul2023 ?? 0;
    this.budget.aug2023 = data.budget.aug2023 ?? 0;
    this.budget.sep2023 = data.budget.sep2023 ?? 0;
    this.budget.oct2023 = data.budget.oct2023 ?? 0;
    this.budget.nov2023 = data.budget.nov2023 ?? 0;
    this.budget.dec2023 = data.budget.dec2023 ?? 0;
  }

  toArray(): CategoryRow {
    return [
      this.name,
      this.type,
      this.group,
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
  }
}

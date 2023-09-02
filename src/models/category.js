import extendBaseRow from "./extend-base-row.js";

// Column - Index (0-based) map
const cl = Object.freeze({
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

const validateNumber = (value) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;

  const asNumber = Number(value);
  if (Number.isNaN(asNumber))
    throw new TypeError(`Expected a number, but received '${value}'`);

  return asNumber;
};

const columnRowPropertyDescriptorMap = {
  category: {
    get() {
      return String(this[cl.category]);
    },
    set(value) {
      this[cl.category] = String(value);
    },
  },

  group: {
    get() {
      return String(this[cl.group]);
    },
    set(value) {
      this[cl.group] = String(value);
    },
  },

  typeName: {
    get() {
      return String(this[cl.typeName]);
    },
    set(value) {
      this[cl.typeName] = String(value);
    },
  },

  isHidden: {
    get() {
      return this[cl.hideFromReports] === "Hidden";
    },
    set(value) {
      this[cl.hideFromReports] = value ? "Hidden" : "";
    },
  },

  jan2023: {
    get() {
      return Number(this[cl.jan2023]);
    },
    set(value) {
      validateNumber(value);
      this[cl.jan2023] = validateNumber(value);
    },
  },

  feb2023: {
    get() {
      return Number(this[cl.feb2023]);
    },
    set(value) {
      this[cl.feb2023] = validateNumber(value);
    },
  },

  mar2023: {
    get() {
      return Number(this[cl.mar2023]);
    },
    set(value) {
      this[cl.mar2023] = validateNumber(value);
    },
  },

  apr2023: {
    get() {
      return validateNumber(this[cl.apr2023]);
    },
    set(value) {
      this[cl.apr2023] = validateNumber(value);
    },
  },

  may2023: {
    get() {
      return Number(this[cl.may2023]);
    },
    set(value) {
      this[cl.may2023] = validateNumber(value);
    },
  },

  jun2023: {
    get() {
      return Number(this[cl.jun2023]);
    },
    set(value) {
      this[cl.jun2023] = validateNumber(value);
    },
  },

  jul2023: {
    get() {
      return Number(this[cl.jul2023]);
    },
    set(value) {
      this[cl.jul2023] = validateNumber(value);
    },
  },

  aug2023: {
    get() {
      return Number(this[cl.aug2023]);
    },
    set(value) {
      this[cl.aug2023] = validateNumber(value);
    },
  },

  sep2023: {
    get() {
      return Number(this[cl.sep2023]);
    },
    set(value) {
      this[cl.sep2023] = validateNumber(value);
    },
  },

  oct2023: {
    get() {
      return Number(this[cl.oct2023]);
    },
    set(value) {
      this[cl.oct2023] = validateNumber(value);
    },
  },

  nov2023: {
    get() {
      return Number(this[cl.nov2023]);
    },
    set(value) {
      this[cl.nov2023] = validateNumber(value);
    },
  },

  dec2023: {
    get() {
      return Number(this[cl.dec2023]);
    },
    set(value) {
      this[cl.dec2023] = validateNumber(value);
    },
  },
};

const Category = extendBaseRow(columnRowPropertyDescriptorMap);

export default Category;

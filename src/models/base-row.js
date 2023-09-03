import { arraysToObjects, camelCase } from "../shared/util.js";

import { DefaultArgumentError } from "../shared/errors.js";

// const exampleData = [
//   ["First Name", "Last Name", "Email", "Phone", "Address"],
//   ["John", "Smith", "johnsmith@email.com", "422-555-1234", "5337 Deer Lane"],
// ];
export const baseRowCreator = (data) => {
  // if (data.toString() === exampleData.toString())
  //   throw new DefaultArgumentError();

  const [headers, ...rows] = data;
  const keys = Object.freeze(headers.map(camelCase));

  const BaseRowPrototype = Object.defineProperties(
    { _headers: headers, _keys: keys },
    {
      asArray: {
        get() {
          return this._keys.map((k) => this[k]);
        },
      },
      headers: {
        get() {
          return this._headers;
        },
      },
      keys: {
        get() {
          return this._keys;
        },
      },
    }
  );
  keys.forEach((key) => {
    BaseRowPrototype[key] = null;
  });

  const newRowObject = (row) =>
    row.reduce((obj, value, i) => {
      const key = keys[i];
      obj[key] = value;
      return obj;
    }, Object.create(BaseRowPrototype));

  const rowObjects = rows.map((row) => newRowObject(row));
  return rowObjects;
};

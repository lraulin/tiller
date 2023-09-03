import { camelCase } from "../shared/util.js";

const arraysToObjects = (headers, data) => {
  if (!headers.length) throw new Error("No headers provided");
  if (!data.length) throw new Error("No data provided");
  if (headers.length !== data[0].length)
    throw new Error(
      "Headers and data length mismatch: " + headers.length + " !== " + data[0]
    );

  return data.map((row) => {
    return row.reduce((acc, value, i) => {
      const key = headers[i];
      if (key === "") return acc;
      return { ...acc, [key]: value };
    }, {});
  });
};

const RowManagerPrototype = {
  headers: [],
  keys: [],
  data: [],
  fromArrays(headers, arrs) {
    const instance = Object.create(RowManagerPrototype);
    instance.headers = headers;
    const camelHeaders = headers.map(camelCase);
    instance.data = arraysToObjects(camelHeaders, arrs);
    return instance;
  },
  toArrays() {
    return [
      this.headers,
      ...this.data.map((row) => this.headers.map((header) => row[header])),
    ];
  },
};

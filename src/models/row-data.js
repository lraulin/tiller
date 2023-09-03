import { camelize } from "../shared/strings.js";

const dataToObjects

const RowManagerPrototype = {
  headers: [],
  rows: [],
  fromArrays(headers, arrs) {
    const instance = Object.create(RowManagerPrototype);
    instance.headers = headers;
    instance.rows = arrs.map((arr) => {
          camelHeaders = theseHeaders.map((h) => camelize(h));
    const data = rows.map((r) => {
      r.reduce((a, c, i) => {
        a[camelHeaders[i]] = c;
        return r;
      }, {});
      return data;
    });
    return instance;
},

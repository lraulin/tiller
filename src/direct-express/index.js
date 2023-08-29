import * as global from "./global.js";
import * as main from "./main.js";
import * as reducers from "./reducers.js";
import * as sorters from "./sorters.js";
import * as transformers from "./transformers.js";
import * as types from "./types.js";

export default {
  ...main,
  ...reducers,
  ...transformers,
  ...types,
  ...global,
  ...sorters,
};

import * as main from "./main.js";
import * as predicates from "./predicates.js";
import * as transformers from "./transformers.js";
import * as types from "./types.js";

export default {
  ...main,
  ...transformers,
  ...types,
  ...predicates,
};

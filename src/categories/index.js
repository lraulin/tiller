import * as main from "./main.js";
import * as reducers from "./reducers.js";
import * as transformers from "./transformers.js";
import * as types from "./types.js";

export default { ...main, ...reducers, ...transformers, ...types };

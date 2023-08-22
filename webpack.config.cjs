const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/shell.js",
  output: {
    filename: "Code.js",
    path: path.resolve(__dirname, "dist"),
  },
};

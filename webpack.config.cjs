const path = require("path");
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.js",
  output: {
    filename: "Code.gs",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new GasPlugin()],
};

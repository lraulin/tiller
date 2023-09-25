const webpack = require("webpack");
const path = require("path");
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "Code.gs",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new webpack.BannerPlugin({
      banner: "function onOpen(){}\n",
      raw: true,
    }),
  ],
};

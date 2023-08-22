const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/shell.js",
  output: {
    filename: "Code.gs",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "var",
    library: "AppLib",
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};

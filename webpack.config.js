const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    popUp: "./src/popUp.js",
    options: "./src/options.js",
    backGround: "./src/background.js",
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.module\.(scss|css)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
        exclude: [path.join(__dirname, "/node_modules")],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
        include: [
          path.join(__dirname, "/node_modules"),
          path.join(__dirname, "/src/styles/global.css"),
        ],
      },
      {
        test: /\.(png|jpe?g|gif|ttf|svg|woff|eot)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./popUp.html",
      chunks: ["popUp"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./options.html",
      chunks: ["options"],
    }),
  ],
};

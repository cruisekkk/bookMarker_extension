const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    popUp: "./src/popUp.js",
    options: "./src/options.js",
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./popUp.html",
      chunks: ['popUp'],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./options.html",
      chunks: ['options'],
    })
  ]
}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'js'),
  entry: './main',
  output: {
    path: path.join(__dirname, '../', 'public'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css?$/,
        loader: 'style!css',
      },
      {
        test: /\.png?$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'js'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [new HtmlWebpackPlugin()],
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'js'),
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './main',
  ],
  output: {
    path: path.join(__dirname, '../', 'public'),
    filename: 'bundle.js',
    publicPath: '/',
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
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
      },
    ],
  },
  resolve: {
    root: [
      path.join(__dirname, 'js'),
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'node_modules', 'cesium', 'Build', 'Cesium'), to: 'cesium' }]),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

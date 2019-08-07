const path = require('path');
const webpack = require('webpack');

console.info(path.resolve(__dirname, 'dist'));
const webpackRules = [];
const webpackOption = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: webpackRules,
  },
};
const babelLoader = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  },
};

webpackRules.push(babelLoader);
module.exports = webpackOption;

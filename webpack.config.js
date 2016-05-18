var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/client/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.js',
    library: 'App',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.vue$/, loader: 'vue' }
    ]
  }
}

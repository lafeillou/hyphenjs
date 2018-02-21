const path = require('path')
const webpack = require('webpack')
const buildPath = path.resolve(__dirname, 'dist')

module.exports = {
  entry: './src/index.js',
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'hyphen.js',
    library: 'Hyphen',
    libraryTarget: 'var'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      include: [/src/],
      loader: 'babel-loader?presets[]=es2015'
    }]
  }
}
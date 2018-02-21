const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
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
  },
  plugins: [
    new webpack.BannerPlugin('Develop by 1kg'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin('dist/*.*', {
      root: __dirname,
      verbose: true
    })
  ]
}
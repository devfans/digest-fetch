const webpack  = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  context: path.join(__dirname, './digest-fetch-src.js'),
  entry: [
    path.join(__dirname, './digest-fetch-src.js')
  ],
  output: {
    path: path.join(__dirname, '.'),
    filename: 'digest-fetch.js',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test    : /\.js$/,
        exclude : /(node_modules|build|dist\/)/,
        loader    : 'babel-loader',
        query   : { presets: ["@babel/preset-env"] }
      }
    ]
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
    modules: [
      path.join(__dirname, './node_modules'),
      __dirname,
    ],
  }
};

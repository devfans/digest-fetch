const webpack  = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  context: path.join(__dirname, './digest-fetch-src.js'),
  entry: [
    'babel-polyfill',
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
        query   : { presets: ['es2015'] }
      }
    ]
  },
  // optimization: {
  //   minimizer: [
  //     // we specify a custom UglifyJsPlugin here to get source maps in production
  //     new UglifyJsPlugin({
  //       cache: true,
  //       parallel: true,
  //       uglifyOptions: {
  //         compress: false,
  //         ecma: 6,
  //         mangle: false
  //       },
  //       sourceMap: false
  //     })
  //   ]
  // },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
    modules: [
      path.join(__dirname, './node_modules'),
      __dirname,
    ],
  }
};

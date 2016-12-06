var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var src_dir = path.join(__dirname, 'extension_src');
var build_dir = path.join(__dirname, 'extension_build');
module.exports = {
  context: src_dir,

  entry: {
    background: ['./background/background.js', './options.js', './storage.js']
  },

  output: {
    path: build_dir,
    filename: '[name].bundle.js'
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'icons/', to: 'icons/' }
    ])
  ],

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        query: {
          plugins: ['transform-es2015-modules-commonjs']
        }
      }
    ]
  },

  devtool: 'source-map'
};

var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var src_dir = path.join(__dirname, 'extension_src');
var build_dir = path.join(__dirname, 'extension_build');
module.exports = {
  context: src_dir,

  entry: {
    background: ['./background/background.js', './options.js', './storage.js'],
    popup: ['./popup/popup.js']
  },

  output: {
    path: build_dir,
    filename: '[name].bundle.js'
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'icons/*' },
      { from: 'popup/popup.html' }
    ])
  ],

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        query: {
          plugins: ['transform-es2015-modules-commonjs'],
          presets: ['react']
        }
      }
    ]
  },

  devtool: 'source-map'
};

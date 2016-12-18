var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var src_dir = path.join(__dirname, 'extension_src');
var build_dir = path.join(__dirname, 'extension_build');
module.exports = {
  context: src_dir,

  entry: {
    background: ['./background/background.js', './options.js', './storage.js'],
    popup: ['./popup/popup.js'],
    options: ['./options/options.js', './options.js', './storage.js']
  },

  output: {
    path: build_dir,
    filename: '[name].bundle.js'
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'icons/*' },
      { from: 'popup/popup.html' },
      { from: 'options/options.html' }
    ])
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-es2015-modules-commonjs'],
          presets: ['react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },

  devtool: 'source-map'
};

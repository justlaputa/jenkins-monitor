var path = require('path');

module.exports = {
  context: path.join(__dirname, 'extension_src'),
  entry: {
    background: ['./background/background.js', './options.js', './storage.js']
  },
  output: {
    path: __dirname + '/extension_build',
    filename: '[name].bundle.js'
  }
};

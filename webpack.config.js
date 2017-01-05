var webpack = require('webpack');
var path = require('path');
var devServerPort = 9090;

module.exports = {
  entry: {
    app: path.resolve('./src/main.js')
  },
  output: {
    path: path.resolve('./build'),
    filename: "bundle.js"
  },
  module : {
    loaders : [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader : 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devServer: {
    port : devServerPort,
    inline: false,
    hot: true,
    colors: true
  }
};

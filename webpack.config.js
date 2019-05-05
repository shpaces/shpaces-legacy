const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = { 'electron-config': 'require("electron-config")',};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  externals: nodeModules,
  entry: [
    './src/index.js'
  ],
  target: 'node',
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css' ]
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 4172
  }
};

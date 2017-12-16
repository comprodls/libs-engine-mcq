/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env;
const nodeExternals = require('webpack-node-externals');

let libraryName = 'mcq';

let plugins = [], outputFile;

plugins.push(new webpack.ProvidePlugin({
  "$": "jquery",
  "jQuery": "jquery",
  "window.jQuery": "jquery",
  "jquery-ui": "jquery-ui-dist"
}));

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
}

const config = {
  entry: { 'mcq6': __dirname + '/src/js/index.js', 'mcq6-editor': __dirname + '/src/js/mcq-editor/mcqeditor.js' },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ]
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
    alias: {
      "jquery-ui-dist": "jquery-ui-dist/jquery-ui.js",
      "bootpag": "bootpag/lib/jquery.bootpag.js"
    }
  },
  plugins: plugins,
  externals: [nodeExternals({ whitelist: ['sightglass', 'rivets', 'jquery', 'jquery-ui-dist','bootpag' ] })] // in order to avoid bundling of modules in node_modules folder  
};

module.exports = config;

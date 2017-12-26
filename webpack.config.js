/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJSPlugin = webpack.optimize.UglifyJsPlugin;
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
  console.log('Invoked production build...');

  plugins.push(new UglifyJSPlugin({
    test: /\.js($|\?)/i,
    sourceMap: true,
    uglifyOptions: {
      compress: true
    }
  }));
}

const config = {
  entry: {
    'jquery': __dirname + '/node_modules/jquery/dist/jquery.min.js',
    'jquery-ui-dist': __dirname + '/node_modules/jquery-ui-dist/jquery-ui.min.js',
    'vendor': [
      __dirname + '/node_modules/sightglass/index.js',
      __dirname + '/node_modules/rivets/dist/rivets.min.js'
    ],
    'mcq': __dirname + '/src/js/index.js',
    'mcq-editor': __dirname + '/src/js/mcq-editor/mcqeditor.js'
  },
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
        exclude: /(node_modules|bower_components)/,
        options: {  // << add options with presets env
          presets: ['env']
        }
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
      "jquery-ui-dist": "jquery-ui-dist/jquery-ui.min.js"
    }
  },
  plugins: plugins,
  externals: { jquery: 'jquery', 'jquery-ui-dist': 'jquery-ui-dist', 'vendor': 'vendor' } // in order to avoid bundling of modules in node_modules folder  
};

module.exports = config;

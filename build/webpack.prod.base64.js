/**
 * Created by xuanjinliang on 2018/12/27.
 */

process.env.base64 = true;

const path = require('path');
const utils = require('./utils');
const merge = require('webpack-merge');
const prodWebpackConfig = require('./webpack.prod.conf');
const config = require('../config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

delete prodWebpackConfig.module.rules;

const webpackConfig = merge(prodWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, '..', 'src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2048000,
          fallback: "file-loader",
          outputPath: utils.assetsPath("images"),
          name: '[name]_[hash].[ext]'
        }
      },
      {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2048000,
          fallback: "file-loader",
          outputPath: utils.assetsPath("sound"),
          name: '[name]_[hash].[ext]'
        }
      },
      ...utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })
    ]
  },
  plugins: [
    new HtmlWebpackInlineSourcePlugin()
  ]
});

module.exports = webpackConfig;

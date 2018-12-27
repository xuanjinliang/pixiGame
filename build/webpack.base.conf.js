/**
 * Created by xuanjinliang on 2018/12/07.
 */

const path = require('path');
const config = require('../config');
const utils = require('./utils');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  exclude: [/node_modules/, '/dist/'],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: config.dirPathObj,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".json"],
    alias: {
      '@': resolve('src'),
      'common': resolve('src/common/js/common.js'),
      'random': resolve('src/common/js/random.js')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.js$/,
        use: (process.env.NODE_ENV === 'production' ? ['cache-loader'] : []).concat(['babel-loader']),
        //use: ['babel-loader'],
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },
      /*{
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },*/
      /*{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          outputPath: utils.assetsPath("images"),
          name: '[name]_[hash].[ext]'
        }
      },
      {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          outputPath: utils.assetsPath("sound"),
          name: '[name]_[hash].[ext]'
        }
      },*/
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          fallback: "file-loader",
          outputPath: utils.assetsPath("images"),
          name: '[name]_[hash].[ext]'
        }
      },
      {
        test: /\.(mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          fallback: "file-loader",
          outputPath: utils.assetsPath("sound"),
          name: '[name]_[hash].[ext]'
        }
      }
    ]
  }
};

/**
 * Created by xuanjinliang on 2018/12/07.
 */

const path = require('path');

module.exports = {
  dev: {
    mode: 'development',
    assetsSubDirectory: 'resource',
    assetsPublicPath: '/',
    proxyTable: {},
    host: 'localhost',
    port: 7000,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true,
    showEslintErrorsInOverlay: false,
    cssSourceMap: true,
    devtool: 'cheap-module-eval-source-map'
  },
  build: {
    mode: 'production',
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'resource',
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
};

/**
 * Created by xuanjinliang on 2018/12/07.
 */

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = process.cwd();
const argv = require('minimist')(process.argv.slice(2), {
  '--': true
});

let globPath = `${path.join(rootDir, 'src')}/!(common)*`;

if(argv.dir){
  globPath = path.join(rootDir, 'src', argv.dir.toString());
}

let dirPathObj = {},
  htmlObjArray = [];

glob.sync(globPath).forEach((element) => {
  if(fs.statSync(element).isDirectory()){
    let dirNameArray = element.split(path.sep),
      dirName = dirNameArray[dirNameArray.length - 1];

    let indexJsPath = path.join(element, 'js', 'index.js');

    if(fs.statSync(indexJsPath).isFile()){
      dirPathObj[dirName] = indexJsPath;
      htmlObjArray.push({
        filename: `${dirName}/view/index.html`,
        template: path.join(element, 'view', 'index.html'),
        chunks: [dirName]
      });
    }
  }
});

if(Object.keys(dirPathObj).length <= 0 || htmlObjArray.length <= 0){
  let err = new Error('输入参数有误');
  throw err;
}

module.exports = {
  dirPathObj,
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
    devtool: 'cheap-module-eval-source-map',
    htmlPlugin: () => {
      let array = [];
      htmlObjArray.forEach((o) => {

        let obj = Object.assign(o, {
          inject: true
        });
        array.push(new HtmlWebpackPlugin(obj));
      });
      return array;
    }
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

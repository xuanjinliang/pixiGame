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
  htmlObjArray = [],
  prodChunks = process.env.NODE_ENV === 'production' ? ['styles', 'vendors', 'common'] : [];

glob.sync(globPath).forEach((element) => {
  if(fs.existsSync(element) && fs.statSync(element).isDirectory()){
    let dirNameArray = element.split(path.sep),
      dirName = dirNameArray[dirNameArray.length - 1];

    let indexJsPath = path.join(element, 'js', 'index.js');

    if(fs.existsSync(indexJsPath) && fs.statSync(indexJsPath).isFile()){
      dirPathObj[dirName] = indexJsPath;

      let htmlPath = path.join(element, 'view', 'index.html');

      let tempObj = fs.existsSync(htmlPath) ? {
        template: htmlPath
      } : {
        templateParameters: {
          title: dirName
        },
        template: path.join(element, '..', 'index.html')
      };

      htmlObjArray.push(Object.assign({
        filename: `${dirName}/index.html`,
        chunks: prodChunks.concat([dirName])
      }, tempObj));
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
    assetsRoot: path.resolve(__dirname, (process.env.base64  ? '../distBase64' : '../dist')),
    assetsSubDirectory: 'resource',
    assetsPublicPath: '/',
    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    bundleAnalyzerReport: false,
    productionGzipExtensions: ['js', 'css'],
    htmlPlugin: () => {
      let array = [];
      htmlObjArray.forEach((o) => {

        let obj = Object.assign(o, {
          inject: true,
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          },
          chunksSortMode: 'dependency'
        });
        if(process.env.base64){
          obj = Object.assign(obj, {
            inlineSource: '.(js|css)$'
          });
        }
        array.push(new HtmlWebpackPlugin(obj));
      });
      return array;
    }
  }
};

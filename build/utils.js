/**
 * Created by xuanjinliang on 2018/12/07.
 */
const path = require('path');
const config = require('../config');
const packageConfig = require('../package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
}

exports.cssLoaders = (options = {}) => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      modules: true,
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`, //loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders
      });
    }

    return ['style-loader'].concat(loaders)
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less')
  };
};

exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp(`\\.${extension}$`),
      use: loader
    });
  }

  //console.log(JSON.stringify(output, null, "\t"));
  return output;
};

exports.createNotifierCallback = () => {
  //系统通知功能
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: `${severity}:${error.name}`,
      subtitle: filename || ''
      //icon: path.join(__dirname, 'logo.png')
    });
  };
};

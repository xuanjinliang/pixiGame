/**
 * Created by xuanjinliang on 2018/04/27.
 */

const tinify = require("tinify");
const glob = require('glob');
const path = require('path');
const common = require('./common');
const argumentArray = process.argv;
const rootDir = process.cwd();

const imgReg = /\.(png|jpe?g)$/gi;

/*
* tinify key
* inputImage
* outPath 如果这个不填写，默认替换原来图片
* */

if (argumentArray.length < 4) {
  throw new Error('Incorrect parameter');
}

function rootPathVerify(p) {
  if (p.match(rootDir)) {
    return path.join(p);
  }

  return path.join(rootDir, p);
}

const imgPath = rootPathVerify(argumentArray[3]);
let outPath = '';

if (argumentArray[4]) {
  outPath = rootPathVerify(argumentArray[4]);

  let dir = outPath;

  if (path.extname(dir).match(imgReg)) {
    dir = dir.replace(path.basename(dir), '');
  }
  common.mkdirsSync(dir);
}

tinify.key = argumentArray[2];
tinify.validate((err) => {
  console.log(`该帐号已压缩${tinify.compressionCount}张图片`);
  if (err) throw err;
});

function compressImg(imgPath, outPath) {
  if (!outPath) {
    outPath = imgPath;
  }

  tinify.fromFile(imgPath).toFile(outPath, (err) => {
    if (err) throw err;
  });
}

if (imgReg.test(imgPath)) {
  compressImg(imgPath, outPath);
  return;
}

glob.sync(`${path.join(imgPath, '/')}**`).forEach((element) => {
  let ext = path.extname(element).trim();
  if (ext.match(imgReg)) {
    compressImg(element, outPath);
  }
});





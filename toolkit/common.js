/**
 * Created by timxuan on 2016/7/13.
 */

"use strict";

let path = require('path'),
    fs = require('fs');

module.exports = {
  mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
      let pathtmp;
      dirpath.split(path.sep).forEach(function(dirname) {
        if (pathtmp) {
          pathtmp = path.join(pathtmp, dirname);
        }else {
          pathtmp = dirname || '/';
        }
        if (!fs.existsSync(pathtmp)) {
          if (!fs.mkdirSync(pathtmp, mode)) {
            return false;
          }
        }
      });
    }
    return true;
  }
};


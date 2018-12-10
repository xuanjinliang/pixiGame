/**
 * Created by xuanjinliang on 2018/12/07.
 */

import * as PIXI from 'pixi.js';
import '../../common/style/common.less';

let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas";
}

PIXI.utils.sayHello(type);

/**
 * Created by xuanjinliang on 2018/12/10.
 */

const defaultW = 750,
  defaultH = 1334,
  containerW = defaultW / 2,
  containerH = defaultH / 2;

export default {
  images: {},
  app: null,
  canvas: null,
  canvasW: 0,
  canvasH: 0,
  stage: null,
  containerW: containerW,  //以iphone 6 的宽为标准
  containerH: containerH,
  containerRadio: defaultW / containerW,
  defaultW: defaultW,
  defaultH: defaultH,
  stageW: 0,
  stageH: 0,
  stageScaleX: 0,
  stageScaleY: 0,
  WHRadio: containerW / containerH,
  buttonLoadTime: 1000
};

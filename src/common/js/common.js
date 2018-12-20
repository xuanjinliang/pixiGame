/**
 * Created by xuanjinliang on 2018/12/11.
 */

import _ from 'lodash';
import {Spritesheet, loader} from "pixi.js";

function compareWH(o, bool){
  let array = bool ? ['minWidth', 'width'] : ['minHeight', 'height'];

  if(_.isNumber(o[array[0]]) && o[array[0]] > o[array[1]]){
    return o[array[0]];
  }

  return o[array[1]];
}

export function angleToRadians(degNum){
  return Math.PI / 180 * degNum;
}

export function loadSheet(name, json){
  let sheet = null;
  return new Promise((resolve, reject) => {
    if(name && json){
      sheet = new Spritesheet(loader.resources[name].texture.baseTexture, json);
      sheet.name = name;
      sheet.parse(() => {
        resolve(sheet);
      });
    }else{
      reject('name and json are not null');
    }
  });
}

export function hitTestRectangle(r1, r2) {

  let hit = false,
    combinedHalfWidths, combinedHalfHeights, vx, vy;

  let r1Width = compareWH(r1, 1),
    r1Height = compareWH(r1),
    r2Width = compareWH(r2, 1),
    r2Height = compareWH(r2);

  r1.centerX = r1.x + r1Width / 2;
  r1.centerY = r1.y + r1Height / 2;
  r2.centerX = r2.x + r2Width / 2;
  r2.centerY = r2.y + r2Height / 2;

  r1.halfWidth = r1Width / 2;
  r1.halfHeight = r1Height / 2;
  r2.halfWidth = r2Width / 2;
  r2.halfHeight = r2Height / 2;

  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (Math.abs(vx) <= combinedHalfWidths && Math.abs(vy) <= combinedHalfHeights) {
    hit = true;
  }

  return hit;
}

export function fbClick(fun) {
  try{
    FbPlayableAd.onCTAClick();
  }catch (e) {
    if(_.isFunction(fun)){
      fun();
    }
    console.log(e);
  }
}

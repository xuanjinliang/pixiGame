/**
 * Created by xuanjinliang on 2018/12/11.
 */

import {Spritesheet, loader} from "pixi.js";

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

  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights) {
    hit = true;
  }

  return hit;
}

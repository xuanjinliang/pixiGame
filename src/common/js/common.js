/**
 * Created by xuanjinliang on 2018/12/11.
 */

import {Spritesheet, loader} from "pixi.js";

let sheetObj = {};

export function angleToRadians(degNum){
  return Math.PI / 180 * degNum;
}

export function loadSheet(name, json){
  return new Promise((resolve, reject) => {
    if(name && json){
      if(!sheetObj[name]){
        sheetObj[name] = new Spritesheet(loader.resources[name].texture.baseTexture, json);
        sheetObj[name].parse(() => {
          resolve(sheetObj[name]);
        });
      }else{
        resolve(sheetObj[name]);
      }
    }else{
      reject('name and json are not null');
    }
  });
}

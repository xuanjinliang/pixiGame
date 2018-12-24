/**
 * Created by xuanjinliang on 2018/12/10.
 */

import * as PIXI from 'pixi.js';
import config from './config';
import {fbClick} from "common";

class GameBg {
  constructor() {
    this.download = null;
    this.shade = null;
    this.bg2 = null;
  }

  resizeShade(w, h){
    if(this.shade){
      this.shade.width = w;
      this.shade.height = h;
    }
  }

  setShade(w, h){
    this.shade = new PIXI.Graphics();
    this.shade.alpha = 0.8;
    this.shade.beginFill('#000').drawRect(0, 0, w, h).closePath();
    this.shade.visible = false;

    this.shade.interactive = true;
    /*this.shade.on('tap', function(event){
      console.log(event);
      event.stopPropagation();
      return false;
    });*/

    return this.shade;
  }

  resizeBg() {
    if(this.bg2){
      this.bg2.y = config.stageH - this.bg2.height;
    }
  }

  setBg() {
    let container = new PIXI.Container();

    let bg1 = new PIXI.Sprite(
      PIXI.loader.resources['bg1'].texture
    );
    this.bg2 = new PIXI.Sprite(
      PIXI.loader.resources['bg2'].texture
    );

    this.resizeBg();
    container.addChild(this.bg2, bg1);

    return container;
  }

  setDownload() {
    this.download = new PIXI.Sprite(PIXI.loader.resources['download'].texture);
    let minRatio = 0.4,
      maxRatio = 0.5;

    this.download.pivot.set(this.download.width / 2, 0);
    this.download.scale.set(maxRatio);

    this.download.x = config.containerW / 2;
    this.download.y = config.containerH - this.download.height - 5;

    let downloadTween = PIXI.tweenManager.createTween(this.download);
    downloadTween.loop = true;
    downloadTween.pingPong = true;
    downloadTween.time = 600;
    downloadTween.easing = PIXI.tween.Easing.linear();
    downloadTween.from({
      scale: {x: maxRatio, y: maxRatio}
    }).to({
      scale: {x: minRatio, y: minRatio}
    }).start();

    this.download.interactive = true;
    this.download.on('pointertap', function(){
      fbClick();
    });

    return this.download;
  }

}

export default GameBg;

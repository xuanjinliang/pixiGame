/**
 * Created by xuanjinliang on 2018/12/10.
 */

import * as PIXI from 'pixi.js';
import config from './config';

class GameBg {
  constructor() {
    this.download = null;
    this.shade = null;
    this.bg2 = null;
  }

  resizeShade(w, h){
    if(this.shade){
      this.shade.beginFill('#000').drawRect(0, 0, w, h).closePath();
    }
  }

  setShade(w, h){
    this.shade = new PIXI.Graphics();
    this.shade.alpha = 0.8;
    this.resizeShade(w, h);
    this.shade.visible = false;

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

}

export default GameBg;

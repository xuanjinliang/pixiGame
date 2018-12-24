/**
 * Created by xuanjinliang on 2018/12/21.
 */

import {loader, Container, Sprite} from "pixi.js";
import config from "./config";

class GameBg{
  constructor() {
    this.bg = null;
  }

  resizeBg() {
    if(this.bg){
      this.bg.scale.set(config.containerScaleY);
      this.bg.x = config.canvasW / 2;
      this.bg.y = config.canvasH / 2;

      this.leftBg.scale.set(-config.containerScaleY, config.containerScaleY);
      this.leftBg.x = (config.canvasW - this.leftBg.width * 2) / 2;
      this.leftBg.y = config.canvasH / 2;

      this.rightBg.scale.set(-config.containerScaleY, config.containerScaleY);
      this.rightBg.y = config.canvasH / 2;
      this.rightBg.x = config.canvasW + (this.rightBg.width * 2 - config.canvasW) / 2;
    }
  }

  setBg() {
    let container = new Container();

    this.bg = new Sprite(loader.resources['bg'].texture);
    this.bg.pivot.set(this.bg.width / 2, this.bg.height / 2);

    this.leftBg = new Sprite(loader.resources['bg'].texture);
    this.leftBg.pivot.set(this.bg.width / 2, this.bg.height / 2);

    this.rightBg = new Sprite(loader.resources['bg'].texture);
    this.rightBg.pivot.set(this.bg.width / 2, this.bg.height / 2);


    this.resizeBg();

    container.addChild(this.leftBg, this.rightBg, this.bg);

    return container;
  }

}

export default GameBg;

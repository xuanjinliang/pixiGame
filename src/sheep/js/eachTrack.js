/**
 * Created by xuanjinliang on 2018/12/13.
 */

import {Container, Sprite, loader, Rectangle} from "pixi.js";

class EachTrack{
  constructor(name){
    this.name = name;
    this.container = new Container();
    this.containerW = 49;
    this.containerH = 455;
    this.runTrack = null;
    this.distance = 0.5;
    this.trackBArray = []; //记录黑羊进入跑道
    this.trackWArray = []; //记录白羊进入跑道
    this.firstWSheep = null; //记录第一白羊，用于碰撞
    this.firstBSheep = null; //记录第一黑羊，用于碰撞
    this.energyContainer = null;
    this.cry1 = null;
    this.cry1Timeout = null;
    this.cry2 = null;
    this.cry2Timeout = null;
    this.space = null;
    this.spaceTimeout = null;
  }

  init() {
    let runTrack = new Sprite(loader.resources['track'].texture);

    runTrack.scale.set(this.containerW / runTrack.width, this.containerH / runTrack.height);

    runTrack.alpha = 0;

    this.container.name = this.name;
    this.container.addChild(runTrack);

    this.container.hitArea = new Rectangle(0, 0, runTrack.width, runTrack.height);

    return this.container;
  }
}

export default EachTrack;

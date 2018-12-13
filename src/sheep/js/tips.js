/**
 * Created by xuanjinliang on 2018/12/13.
 */

import {Container, Sprite, loader} from "pixi.js";

class Tips{
  constructor() {
    this.tipW = 129;
    this.tipH = 98;
    this.container = new Container();
  }

  init(num) {
    let tipsBg = new Sprite(loader.resources['tipsBg'].texture);

    if (num) {
      tipsBg.x = tipsBg.width - 6;
      tipsBg.scale.set(-1, 1);
    }

    let clickTips = new Sprite(loader.resources[num ? 'clickTips1' : 'clickTips'].texture);

    clickTips.x = (tipsBg.width - clickTips.width) / 2 - 4;
    clickTips.y = (tipsBg.height - clickTips.height) / 2 - 20;

    this.container.scale.set(this.tipW / tipsBg.width, this.tipH / tipsBg.height);

    this.container.addChild(tipsBg, clickTips);

    return this.container;
  }
}

export default Tips;

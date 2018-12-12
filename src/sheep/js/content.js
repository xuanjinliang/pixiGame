/**
 * Created by xuanjinliang on 2018/12/10.
 */

import * as PIXI from "pixi.js";
import config from './config';
import ScrollButton from './ScrollButton';
import TopBar from './topBar';

class Content{
  constructor() {
    this.containerW = config.containerW;
    this.containerH = 589;
    this.container = new PIXI.Container();
    this.guardBar = null;
    this.scrollButton = new ScrollButton();
    this.topBar = new TopBar();
  }

  setGuardBar() {
    this.guardBar = new PIXI.Sprite(
      PIXI.loader.resources['guardBar'].texture
    );

    this.guardBar.scale.set(0.5);
    this.guardBar.x = -26;
    this.guardBar.y = 261;

    return this.guardBar;
  }

  setContentRect() {
    let mask = new PIXI.Graphics();
    mask.drawRect(0, 0, this.containerW, this.containerH).closePath();

    let shape = new PIXI.Graphics();
    shape.beginFill('0x000000').drawRect(0, 0, this.containerW, this.containerH).closePath();

    let gbCon = this.setGuardBar();
    let scrollCon = this.scrollButton.setScrollCon();

    scrollCon.y = this.containerH / 2 + 10;

    let topBarCon = this.topBar.init();

    this.container.x = 0;
    this.container.y = 24;

    this.container.width = this.containerW;
    this.container.height = this.containerH;

    this.container.addChild(mask, shape, gbCon, scrollCon, topBarCon);
    this.container.mask = mask;

    return this.container;
  }
}

export default Content;

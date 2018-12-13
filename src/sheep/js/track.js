/**
 * Created by xuanjinliang on 2018/12/13.
 */

import * as PIXI from "pixi.js";

class Track{
  constructor() {
    this.container = null;
    this.fingerCon = null;
    this.containerW = 293;
    this.containerH = 455;
    this.cutWidth = 323;
    this.cutX = -(this.cutWidth - this.containerW) / 2;
    this.recordTrackName = '';
    this.trackArray = ['first', 'second', 'third', 'fourth', 'fifth'];
    this.gameStart = false;
    this.addBsheepTimeout = null;
  }

  init() {
    let that = this;

    that.container = new PIXI.Container();

    let trackBg = new PIXI.Sprite(PIXI.loader.resources['trackBg'].texture);

    trackBg.scale.set(this.containerW / trackBg.width, this.containerH / trackBg.height);

    let mask = new PIXI.Graphics();
    mask.beginFill('0x000000').drawRect(0, 0, this.containerW, this.containerH).closePath();

    that.container.mask = mask;

    that.container.addChild(mask, trackBg);

    return that.container;

  }
}

export default Track;

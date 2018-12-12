/**
 * Created by xuanjinliang on 2018/12/11.
 */

import * as PIXI from "pixi.js";
import ProgressBar from './progressBar';

class TopBar{
  constructor() {
    this.container = new PIXI.Container();
    this.containerW = 314;
    this.containerH = 87;
    this.progressBar = new ProgressBar();
  }

  init() {
    let titleBg = new PIXI.Sprite(PIXI.loader.resources['titleBg'].texture),
      titiBgW = 85,
      titiBgH = 45;

    titleBg.pivot.x = titleBg.width / 2;
    titleBg.x = this.containerW / 2;

    titleBg.scale.set(titiBgW / titleBg.width, titiBgH / titleBg.height);

    let progressBarCon = this.progressBar.init();

    progressBarCon.y = titiBgH;

    this.container.width = this.containerW;
    this.container.height = this.containerH;

    this.container.addChild(titleBg, progressBarCon);

    return this.container;

  }

}

export default TopBar;

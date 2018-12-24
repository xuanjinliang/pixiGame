/**
 * Created by xuanjinliang on 2018/12/20.
 */

import _ from 'lodash';
import {Container, Sprite, loader, tweenManager, tween} from "pixi.js";
import config from "./config";
import {fbClick} from "common";

class Fail{
  constructor() {
    this.container = new Container();
    this.failed = null;
    this.download = null;
    this.again = null;
    this.tryFun = null;
  }

  resize() {
    if(this.failed){
      this.failed.x = config.stageW / 2;
      this.failed.y = config.stageH / 2 - 150;
    }

    if(this.download){
      this.download.x = config.stageW / 2;
      this.download.y = config.stageH - this.download.height * 3;
    }

    if(this.again){
      this.again.x = config.stageW / 2;
      this.again.y = config.stageH - this.download.height * 2;
    }
  }

  init() {
    this.failed = new Sprite(loader.resources['failed'].texture);
    this.failed.pivot.set(this.failed.width / 2, this.failed.height / 2);

    this.download = new Sprite(loader.resources['download'].texture);
    this.download.pivot.set(this.download.width / 2, this.download.height / 2);

    const downloadTween = tweenManager.createTween(this.download);
    downloadTween.loop = true;
    downloadTween.pingPong = true;
    downloadTween.time = 600;
    downloadTween.easing = tween.Easing.linear();
    downloadTween.from({
      scale: {x: 1, y: 1}
    }).to({
      scale: {x: 0.8, y: 0.8}
    }).start();

    this.download.interactive = true;
    this.download.on('pointertap', (event) => {
      event.stopPropagation();
      fbClick(this.tryFun);
    });

    this.again = new Sprite(loader.resources['again'].texture);
    this.again.pivot.set(this.again.width / 2, this.again.height / 2);

    this.again.interactive = true;
    this.again.on('pointertap', () => {
      if(_.isFunction(this.tryFun)){
        this.tryFun();
      }
    });

    this.resize();

    this.container.addChild(this.failed, this.download, this.again);
    this.container.visible = false;

    return this.container;
  }
}

export default Fail;
